var Ks=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function zg(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Ud={203:(n,e)=>{function t(k){if(!Number.isSafeInteger(k))throw new Error(`Wrong integer: ${k}`)}function r(...k){const $=(Z,X)=>Y=>Z(X(Y)),A=Array.from(k).reverse().reduce(((Z,X)=>Z?$(Z,X.encode):X.encode),void 0),V=k.reduce(((Z,X)=>Z?$(Z,X.decode):X.decode),void 0);return{encode:A,decode:V}}function o(k){return{encode:$=>{if(!Array.isArray($)||$.length&&typeof $[0]!="number")throw new Error("alphabet.encode input should be an array of numbers");return $.map((A=>{if(t(A),A<0||A>=k.length)throw new Error(`Digit index outside alphabet: ${A} (alphabet: ${k.length})`);return k[A]}))},decode:$=>{if(!Array.isArray($)||$.length&&typeof $[0]!="string")throw new Error("alphabet.decode input should be array of strings");return $.map((A=>{if(typeof A!="string")throw new Error(`alphabet.decode: not string element=${A}`);const V=k.indexOf(A);if(V===-1)throw new Error(`Unknown letter: "${A}". Allowed: ${k}`);return V}))}}}function c(k=""){if(typeof k!="string")throw new Error("join separator should be string");return{encode:$=>{if(!Array.isArray($)||$.length&&typeof $[0]!="string")throw new Error("join.encode input should be array of strings");for(let A of $)if(typeof A!="string")throw new Error(`join.encode: non-string input=${A}`);return $.join(k)},decode:$=>{if(typeof $!="string")throw new Error("join.decode input should be string");return $.split(k)}}}function l(k,$="="){if(t(k),typeof $!="string")throw new Error("padding chr should be string");return{encode(A){if(!Array.isArray(A)||A.length&&typeof A[0]!="string")throw new Error("padding.encode input should be array of strings");for(let V of A)if(typeof V!="string")throw new Error(`padding.encode: non-string input=${V}`);for(;A.length*k%8;)A.push($);return A},decode(A){if(!Array.isArray(A)||A.length&&typeof A[0]!="string")throw new Error("padding.encode input should be array of strings");for(let Z of A)if(typeof Z!="string")throw new Error(`padding.decode: non-string input=${Z}`);let V=A.length;if(V*k%8)throw new Error("Invalid padding: string should have whole number of bytes");for(;V>0&&A[V-1]===$;V--)if(!((V-1)*k%8))throw new Error("Invalid padding: string has too much padding");return A.slice(0,V)}}}function h(k){if(typeof k!="function")throw new Error("normalize fn should be function");return{encode:$=>$,decode:$=>k($)}}function d(k,$,A){if($<2)throw new Error(`convertRadix: wrong from=${$}, base cannot be less than 2`);if(A<2)throw new Error(`convertRadix: wrong to=${A}, base cannot be less than 2`);if(!Array.isArray(k))throw new Error("convertRadix: data should be array");if(!k.length)return[];let V=0;const Z=[],X=Array.from(k);for(X.forEach((Y=>{if(t(Y),Y<0||Y>=$)throw new Error(`Wrong integer: ${Y}`)}));;){let Y=0,re=!0;for(let pe=V;pe<X.length;pe++){const ye=X[pe],le=$*Y+ye;if(!Number.isSafeInteger(le)||$*Y/$!==Y||le-ye!=$*Y)throw new Error("convertRadix: carry overflow");if(Y=le%A,X[pe]=Math.floor(le/A),!Number.isSafeInteger(X[pe])||X[pe]*A+Y!==le)throw new Error("convertRadix: carry overflow");re&&(X[pe]?re=!1:V=pe)}if(Z.push(Y),re)break}for(let Y=0;Y<k.length-1&&k[Y]===0;Y++)Z.push(0);return Z.reverse()}Object.defineProperty(e,"__esModule",{value:!0}),e.bytes=e.stringToBytes=e.str=e.bytesToString=e.hex=e.utf8=e.bech32m=e.bech32=e.base58check=e.base58xmr=e.base58xrp=e.base58flickr=e.base58=e.base64url=e.base64=e.base32crockford=e.base32hex=e.base32=e.base16=e.utils=e.assertNumber=void 0,e.assertNumber=t;const g=(k,$)=>$?g($,k%$):k,w=(k,$)=>k+($-g(k,$));function m(k,$,A,V){if(!Array.isArray(k))throw new Error("convertRadix2: data should be array");if($<=0||$>32)throw new Error(`convertRadix2: wrong from=${$}`);if(A<=0||A>32)throw new Error(`convertRadix2: wrong to=${A}`);if(w($,A)>32)throw new Error(`convertRadix2: carry overflow from=${$} to=${A} carryBits=${w($,A)}`);let Z=0,X=0;const Y=2**A-1,re=[];for(const pe of k){if(t(pe),pe>=2**$)throw new Error(`convertRadix2: invalid data word=${pe} from=${$}`);if(Z=Z<<$|pe,X+$>32)throw new Error(`convertRadix2: carry overflow pos=${X} from=${$}`);for(X+=$;X>=A;X-=A)re.push((Z>>X-A&Y)>>>0);Z&=2**X-1}if(Z=Z<<A-X&Y,!V&&X>=$)throw new Error("Excess padding");if(!V&&Z)throw new Error(`Non-zero padding: ${Z}`);return V&&X>0&&re.push(Z>>>0),re}function v(k){return t(k),{encode:$=>{if(!($ instanceof Uint8Array))throw new Error("radix.encode input should be Uint8Array");return d(Array.from($),256,k)},decode:$=>{if(!Array.isArray($)||$.length&&typeof $[0]!="number")throw new Error("radix.decode input should be array of strings");return Uint8Array.from(d($,k,256))}}}function L(k,$=!1){if(t(k),k<=0||k>32)throw new Error("radix2: bits should be in (0..32]");if(w(8,k)>32||w(k,8)>32)throw new Error("radix2: carry overflow");return{encode:A=>{if(!(A instanceof Uint8Array))throw new Error("radix2.encode input should be Uint8Array");return m(Array.from(A),8,k,!$)},decode:A=>{if(!Array.isArray(A)||A.length&&typeof A[0]!="number")throw new Error("radix2.decode input should be array of strings");return Uint8Array.from(m(A,k,8,$))}}}function C(k){if(typeof k!="function")throw new Error("unsafeWrapper fn should be function");return function(...$){try{return k.apply(null,$)}catch{}}}function S(k,$){if(t(k),typeof $!="function")throw new Error("checksum fn should be function");return{encode(A){if(!(A instanceof Uint8Array))throw new Error("checksum.encode: input should be Uint8Array");const V=$(A).slice(0,k),Z=new Uint8Array(A.length+k);return Z.set(A),Z.set(V,A.length),Z},decode(A){if(!(A instanceof Uint8Array))throw new Error("checksum.decode: input should be Uint8Array");const V=A.slice(0,-k),Z=$(V).slice(0,k),X=A.slice(-k);for(let Y=0;Y<k;Y++)if(Z[Y]!==X[Y])throw new Error("Invalid checksum");return V}}}e.utils={alphabet:o,chain:r,checksum:S,radix:v,radix2:L,join:c,padding:l},e.base16=r(L(4),o("0123456789ABCDEF"),c("")),e.base32=r(L(5),o("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"),l(5),c("")),e.base32hex=r(L(5),o("0123456789ABCDEFGHIJKLMNOPQRSTUV"),l(5),c("")),e.base32crockford=r(L(5),o("0123456789ABCDEFGHJKMNPQRSTVWXYZ"),c(""),h((k=>k.toUpperCase().replace(/O/g,"0").replace(/[IL]/g,"1")))),e.base64=r(L(6),o("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),l(6),c("")),e.base64url=r(L(6),o("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),l(6),c(""));const z=k=>r(v(58),o(k),c(""));e.base58=z("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"),e.base58flickr=z("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),e.base58xrp=z("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");const F=[0,2,3,5,6,7,9,10,11];e.base58xmr={encode(k){let $="";for(let A=0;A<k.length;A+=8){const V=k.subarray(A,A+8);$+=e.base58.encode(V).padStart(F[V.length],"1")}return $},decode(k){let $=[];for(let A=0;A<k.length;A+=11){const V=k.slice(A,A+11),Z=F.indexOf(V.length),X=e.base58.decode(V);for(let Y=0;Y<X.length-Z;Y++)if(X[Y]!==0)throw new Error("base58xmr: wrong padding");$=$.concat(Array.from(X.slice(X.length-Z)))}return Uint8Array.from($)}},e.base58check=k=>r(S(4,($=>k(k($)))),e.base58);const H=r(o("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),c("")),ee=[996825010,642813549,513874426,1027748829,705979059];function oe(k){const $=k>>25;let A=(33554431&k)<<5;for(let V=0;V<ee.length;V++)($>>V&1)==1&&(A^=ee[V]);return A}function W(k,$,A=1){const V=k.length;let Z=1;for(let X=0;X<V;X++){const Y=k.charCodeAt(X);if(Y<33||Y>126)throw new Error(`Invalid prefix (${k})`);Z=oe(Z)^Y>>5}Z=oe(Z);for(let X=0;X<V;X++)Z=oe(Z)^31&k.charCodeAt(X);for(let X of $)Z=oe(Z)^X;for(let X=0;X<6;X++)Z=oe(Z);return Z^=A,H.encode(m([Z%2**30],30,5,!1))}function K(k){const $=k==="bech32"?1:734539939,A=L(5),V=A.decode,Z=A.encode,X=C(V);function Y(re,pe=90){if(typeof re!="string")throw new Error("bech32.decode input should be string, not "+typeof re);if(re.length<8||pe!==!1&&re.length>pe)throw new TypeError(`Wrong string length: ${re.length} (${re}). Expected (8..${pe})`);const ye=re.toLowerCase();if(re!==ye&&re!==re.toUpperCase())throw new Error("String must be lowercase or uppercase");const le=(re=ye).lastIndexOf("1");if(le===0||le===-1)throw new Error('Letter "1" must be present between prefix and data only');const $e=re.slice(0,le),ve=re.slice(le+1);if(ve.length<6)throw new Error("Data must be at least 6 characters long");const _e=H.decode(ve).slice(0,-6),Be=W($e,_e,$);if(!ve.endsWith(Be))throw new Error(`Invalid checksum in ${re}: expected "${Be}"`);return{prefix:$e,words:_e}}return{encode:function(re,pe,ye=90){if(typeof re!="string")throw new Error("bech32.encode prefix should be string, not "+typeof re);if(!Array.isArray(pe)||pe.length&&typeof pe[0]!="number")throw new Error("bech32.encode words should be array of numbers, not "+typeof pe);const le=re.length+7+pe.length;if(ye!==!1&&le>ye)throw new TypeError(`Length ${le} exceeds limit ${ye}`);return`${re=re.toLowerCase()}1${H.encode(pe)}${W(re,pe,$)}`},decode:Y,decodeToBytes:function(re){const{prefix:pe,words:ye}=Y(re,!1);return{prefix:pe,words:ye,bytes:V(ye)}},decodeUnsafe:C(Y),fromWords:V,fromWordsUnsafe:X,toWords:Z}}e.bech32=K("bech32"),e.bech32m=K("bech32m"),e.utf8={encode:k=>new TextDecoder().decode(k),decode:k=>new TextEncoder().encode(k)},e.hex=r(L(4),o("0123456789abcdef"),c(""),h((k=>{if(typeof k!="string"||k.length%2)throw new TypeError(`hex.decode: expected string, got ${typeof k} with length ${k.length}`);return k.toLowerCase()})));const Q={utf8:e.utf8,hex:e.hex,base16:e.base16,base32:e.base32,base64:e.base64,base64url:e.base64url,base58:e.base58,base58xmr:e.base58xmr},G=`Invalid encoding type. Available types: ${Object.keys(Q).join(", ")}`;e.bytesToString=(k,$)=>{if(typeof k!="string"||!Q.hasOwnProperty(k))throw new TypeError(G);if(!($ instanceof Uint8Array))throw new TypeError("bytesToString() expects Uint8Array");return Q[k].encode($)},e.str=e.bytesToString,e.stringToBytes=(k,$)=>{if(!Q.hasOwnProperty(k))throw new TypeError(G);if(typeof $!="string")throw new TypeError("stringToBytes() expects string");return Q[k].decode($)},e.bytes=e.stringToBytes},806:(n,e,t)=>{t.d(e,{A:()=>h});var r=t(601),o=t.n(r),c=t(314),l=t.n(c)()(o());l.push([n.id,`.zap-sender.with-comment {
  border-radius: 6px 6px 0 0;
}

/* Color Classes Generator */
[class*="zap-amount-"] .zap-sender {
  border-radius: 6px;
}

[class*="zap-amount-"] .zap-sender.with-comment {
  border-radius: 6px 6px 0 0;
}

[class*="zap-amount-"] .zap-details {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Amount-based Styles */
.zap-amount-100 .zap-sender {
  background-color: var(--zap-100);
}

.zap-amount-200 .zap-sender {
  background-color: var(--zap-200);
}

.zap-amount-500 .zap-sender {
  background-color: var(--zap-500);
}

.zap-amount-1k .zap-sender {
  background-color: var(--zap-1k);
}

.zap-amount-2k .zap-sender {
  background-color: var(--zap-2k);
}

.zap-amount-5k .zap-sender {
  background-color: var(--zap-5k);
}

.zap-amount-10k .zap-sender {
  background-color: var(--zap-10k);
}

/* Details Background Colors */
.zap-amount-100 .zap-details {
  background-color: var(--zap-100-light);
}

.zap-amount-200 .zap-details {
  background-color: var(--zap-200-light);
}

.zap-amount-500 .zap-details {
  background-color: var(--zap-500-light);
}

.zap-amount-1k .zap-details {
  background-color: var(--zap-1k-light);
}

.zap-amount-2k .zap-details {
  background-color: var(--zap-2k-light);
}

.zap-amount-5k .zap-details {
  background-color: var(--zap-5k-light);
}

.zap-amount-10k .zap-details {
  background-color: var(--zap-10k-light);
}

/* Dark Text Colors */
.zap-amount-100,
.zap-amount-2k,
.zap-amount-5k,
.zap-amount-10k {
  .zap-amount {
    color: var(--text-light);
  }

  .sender-name {
    color: var(--text-light-secondary);
  }

  .sender-pubkey {
    color: var(--text-light-tertiary);
  }

  .zap-comment {
    color: var(--text-light);
  }
}

/* Light Text Colors */
.zap-amount-200,
.zap-amount-500,
.zap-amount-1k {
  .zap-amount {
    color: var(--text-dark);
  }

  .sender-name {
    color: var(--text-dark-secondary);
  }

  .sender-pubkey {
    color: var(--text-dark-tertiary);
  }

  .zap-comment {
    color: var(--text-dark);
  }
}`,""]);const h=l},540:(n,e,t)=>{t.r(e),t.d(e,{default:()=>g});var r=t(601),o=t.n(r),c=t(314),l=t.n(c),h=t(806),d=l()(o());d.i(h.A),d.push([n.id,`/* styles.css */

:host {
  --main-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --main-text: Black;
  --pubkey-text: #888;
  --custom-title-text: #555;
  --stats-item-text: #333;
  --name-text: #444;
  --dialog-bg: #ffffff;
  --zap-stats-bg: #edf2f7;
  --hover-bg: #edf2f7;
  --border: #ddd;
  --skeleton: #fdfdfd;
  --skeleton2: #e2e5ec;
  --zap-stats-skeleton-bg: #bbc5cf;
  --new-mark: #22c55e;

  /* Zap Amount Colors */
  --zap-100: #1565c0;
  --zap-200: #00b8d4;
  --zap-500: #00bfa5;
  --zap-1k: #ffb300;
  --zap-2k: #e65100;
  --zap-5k: #c2185b;
  --zap-10k: #d00000;

  /* Light Variants */
  --zap-100-light: #1e88e5;
  --zap-200-light: #00e5ff;
  --zap-500-light: #1de9b6;
  --zap-1k-light: #ffca28;
  --zap-2k-light: #f57c00;
  --zap-5k-light: #e91e63;
  --zap-10k-light: #e62117;

  /* Text Colors */
  --text-light: #ffffff;
  --text-light-secondary: rgba(255, 255, 255, 0.9);
  --text-light-tertiary: rgba(255, 255, 255, 0.5);
  --text-dark: #000000;
  --text-dark-secondary: rgba(0, 0, 0, 0.7);
  --text-dark-tertiary: rgba(0, 0, 0, 0.5);
}

* {
  box-sizing: border-box;
}

button {
  color: var(--main-text);
  background: none;
  border: none;
  cursor: pointer;
}

.dialog {
  font-family: var(--main-font);
  color: var(--main-text);
  font-size: medium;
  font-weight: normal;
  max-height: 700px;
  height: 100dvh;
  width: 360px;
  margin: auto;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: var(--dialog-bg);
  display: flex;
  flex-direction: column;
}

.close-dialog-button {
  color: var(--custom-title-text);
  font-size: 16px;
  font-weight: 500;
  position: absolute;
  right: 0;
  width: 2.625rem;
  height: 2.625rem;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
  padding: 10px;
  text-align: center;
}

.close-dialog-button:hover {
  background-color: var(--hover-bg);
}

.dialog-title {
  height: 42px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & a {
    font-size: 0.9rem;
    font-weight: normal;
    color: var(--pubkey-text);
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  & a:hover {
    text-decoration: underline;
  }
}

.dialog-title.custom-title a {
  color: var(--custom-title-text);
  font-weight: 600;
  font-size: 1rem;
}

.zap-stats {
  min-height: 80px;
  padding: 6px 14px;
  background: var(--zap-stats-bg);
  border-radius: 6px;
  display: grid;
  grid-template-columns: 90px 1fr 40px;
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  margin: 0 8px;

  .stats-item {
    height: 23px;
    color: var(--stats-item-text);
    font-size: 0.9rem;

    .number {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .number.skeleton {
      width: 100%;
      background: linear-gradient(90deg,
          var(--skeleton) 0%,
          var(--zap-stats-skeleton-bg) 50%,
          var(--skeleton) 100%);
      background-size: 200% 100%;
    }
  }
}

.stats-item:nth-child(3n + 1) {
  justify-content: flex-start;
}

.stats-item:nth-child(3n + 2),
.stats-item:nth-child(3n + 3) {
  justify-content: flex-end;
}

.text-muted {
  margin-right: 16px;
  opacity: 0.4;
}

.dialog-zap-list {
  list-style-type: none;
  margin: 10px 0;
  padding: 0 6px;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;

  /* スクロールバーのスタイリング */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transition: background 0.2s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  /* Firefox用のスクロールバースタイル */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.zap-list-item {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  padding: 4px 0;
}

.zap-content {
  display: flex;
  flex-direction: column;
}

.reference-container {
  display: flex;
  flex-direction: column;
}

.zap-sender {
  gap: 12px;
  height: 46px;
  justify-content: space-between;
  padding: 6px;
}

.sender-icon {
  flex-shrink: 0;

  & img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
    object-position: center;
  }
}

.sender-icon.is-new::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  background-color: var(--new-mark);
  border: 1px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation: pulse 2500ms cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

.sender-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
  min-width: 0;
}

.sender-name {
  font-size: 0.9375rem;
  font-weight: bold;
  color: var(--name-text);
}

.sender-pubkey {
  font-size: 0.625rem;
  color: var(--pubkey-text);
  margin-top: -1px;
}

.zap-amount {
  font-size: 0.8rem;
  white-space: nowrap;
  flex-shrink: 0;

  .number {
    font-size: 1.4rem;
    font-weight: 500;
    text-align: right;
  }
}

.zap-details {
  padding: 2px 8px;
  border-radius: 0 0 6px 6px;
  margin: 0;
}

.zap-comment {
  font-size: 0.9375rem;
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 100%;
}

.no-zaps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.no-zaps-message {
  text-align: center;
  color: var(--pubkey-text);
  font-size: 1.8rem;
  font-weight: 700;
}

.zap-reference {
  padding: 2px 0 2px 12px;
  margin: 0;
  font-size: 0.875rem;
  color: var(--pubkey-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reference-arrow {
  flex-shrink: 0;

  img {
    height: 16px;
    width: auto;
  }
}

.reference-text {
  font-size: 0.75rem;
  margin: 0 2px;
  flex-grow: 1;
}

.reference-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.5rem;
  width: 2.6rem;
  text-decoration: none;
  border-left: 1px solid var(--border);
  flex-shrink: 0;

  & img {
    height: 20px;
    width: auto;
  }
}

.zap-placeholder-name {
  height: 30px;
  width: 140px;
}

.zap-placeholder-name.skeleton {
  width: 120px;
  height: 19px;
  margin: 2px 0;
}

.skeleton {
  color: transparent;
  border-radius: 2px;
  background: linear-gradient(90deg,
      var(--skeleton) 0%,
      var(--skeleton2) 50%,
      var(--skeleton) 100%);
  background-size: 200% 100%;
  animation: loading-animation 3.5s infinite;
  opacity: 0.7;
}

@keyframes loading-animation {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* 共通のテキストオーバーフロー処理 */
.dialog-title,
.sender-name,
.sender-pubkey,
.reference-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 共通のフレックスボックス設定 */
.zap-sender,
.stats-item,
.zap-details,
.reference-link,
.zap-reference {
  display: flex;
  align-items: center;
}

/* 共通のアイコンサイズ */
.zap-placeholder-icon,
.sender-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  position: relative;
}

.load-more-trigger {
  height: 40px;
  margin: 10px 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--zap-stats-bg);
  border-top: 3px solid var(--pubkey-text);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}`,""]);const g=d},314:n=>{n.exports=function(e){var t=[];return t.toString=function(){return this.map((function(r){var o="",c=r[5]!==void 0;return r[4]&&(o+="@supports (".concat(r[4],") {")),r[2]&&(o+="@media ".concat(r[2]," {")),c&&(o+="@layer".concat(r[5].length>0?" ".concat(r[5]):""," {")),o+=e(r),c&&(o+="}"),r[2]&&(o+="}"),r[4]&&(o+="}"),o})).join("")},t.i=function(r,o,c,l,h){typeof r=="string"&&(r=[[null,r,void 0]]);var d={};if(c)for(var g=0;g<this.length;g++){var w=this[g][0];w!=null&&(d[w]=!0)}for(var m=0;m<r.length;m++){var v=[].concat(r[m]);c&&d[v[0]]||(h!==void 0&&(v[5]===void 0||(v[1]="@layer".concat(v[5].length>0?" ".concat(v[5]):""," {").concat(v[1],"}")),v[5]=h),o&&(v[2]&&(v[1]="@media ".concat(v[2]," {").concat(v[1],"}")),v[2]=o),l&&(v[4]?(v[1]="@supports (".concat(v[4],") {").concat(v[1],"}"),v[4]=l):v[4]="".concat(l)),t.push(v))}},t}},601:n=>{n.exports=function(e){return e[1]}},705:(n,e,t)=>{const{bech32:r,hex:o,utf8:c}=t(203),l={bech32:"bc",pubKeyHash:0,scriptHash:5,validWitnessVersions:[0]},h={bech32:"tb",pubKeyHash:111,scriptHash:196,validWitnessVersions:[0]},d={bech32:"tbs",pubKeyHash:111,scriptHash:196,validWitnessVersions:[0]},g={bech32:"bcrt",pubKeyHash:111,scriptHash:196,validWitnessVersions:[0]},w={bech32:"sb",pubKeyHash:63,scriptHash:123,validWitnessVersions:[0]},m=["option_data_loss_protect","initial_routing_sync","option_upfront_shutdown_script","gossip_queries","var_onion_optin","gossip_queries_ex","option_static_remotekey","payment_secret","basic_mpp","option_support_large_channel"],v={m:BigInt(1e3),u:BigInt(1e6),n:BigInt(1e9),p:BigInt(1e12)},L=BigInt("2100000000000000000"),C=BigInt(1e11),S={payment_hash:1,payment_secret:16,description:13,payee:19,description_hash:23,expiry:6,min_final_cltv_expiry:24,fallback_address:9,route_hint:3,feature_bits:5,metadata:27},z={};for(let W=0,K=Object.keys(S);W<K.length;W++){const Q=K[W],G=S[K[W]].toString();z[G]=Q}const F={1:W=>o.encode(r.fromWordsUnsafe(W)),16:W=>o.encode(r.fromWordsUnsafe(W)),13:W=>c.encode(r.fromWordsUnsafe(W)),19:W=>o.encode(r.fromWordsUnsafe(W)),23:W=>o.encode(r.fromWordsUnsafe(W)),27:W=>o.encode(r.fromWordsUnsafe(W)),6:ee,24:ee,3:function(W){const K=[];let Q,G,k,$,A,V=r.fromWordsUnsafe(W);for(;V.length>0;)Q=o.encode(V.slice(0,33)),G=o.encode(V.slice(33,41)),k=parseInt(o.encode(V.slice(41,45)),16),$=parseInt(o.encode(V.slice(45,49)),16),A=parseInt(o.encode(V.slice(49,51)),16),V=V.slice(51),K.push({pubkey:Q,short_channel_id:G,fee_base_msat:k,fee_proportional_millionths:$,cltv_expiry_delta:A});return K},5:function(W){const K=W.slice().reverse().map((k=>[!!(1&k),!!(2&k),!!(4&k),!!(8&k),!!(16&k)])).reduce(((k,$)=>k.concat($)),[]);for(;K.length<2*m.length;)K.push(!1);const Q={};m.forEach(((k,$)=>{let A;A=K[2*$]?"required":K[2*$+1]?"supported":"unsupported",Q[k]=A}));const G=K.slice(2*m.length);return Q.extra_bits={start_bit:2*m.length,bits:G,has_required:G.reduce(((k,$,A)=>A%2!=0?k||!1:k||$),!1)},Q}};function H(W){return K=>({tagCode:parseInt(W),words:r.encode("unknown",K,Number.MAX_SAFE_INTEGER)})}function ee(W){return W.reverse().reduce(((K,Q,G)=>K+Q*Math.pow(32,G)),0)}function oe(W,K){let Q,G;if(W.slice(-1).match(/^[munp]$/))Q=W.slice(-1),G=W.slice(0,-1);else{if(W.slice(-1).match(/^[^munp0-9]$/))throw new Error("Not a valid multiplier for the amount");G=W}if(!G.match(/^\d+$/))throw new Error("Not a valid human readable amount");const k=BigInt(G),$=Q?k*C/v[Q]:k*C;if(Q==="p"&&k%BigInt(10)!==BigInt(0)||$>L)throw new Error("Amount is outside of valid range");return K?$.toString():$}n.exports={decode:function(W,K){if(typeof W!="string")throw new Error("Lightning Payment Request must be string");if(W.slice(0,2).toLowerCase()!=="ln")throw new Error("Not a proper lightning payment request");const Q=[],G=r.decode(W,Number.MAX_SAFE_INTEGER);W=W.toLowerCase();const k=G.prefix;let $=G.words,A=W.slice(k.length+1),V=$.slice(-104);$=$.slice(0,-104);let Z=k.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/);if(Z&&!Z[2]&&(Z=k.match(/^ln(\S+)$/)),!Z)throw new Error("Not a proper lightning payment request");Q.push({name:"lightning_network",letters:"ln"});const X=Z[1];let Y;if(K){if(K.bech32===void 0||K.pubKeyHash===void 0||K.scriptHash===void 0||!Array.isArray(K.validWitnessVersions))throw new Error("Invalid network");Y=K}else switch(X){case l.bech32:Y=l;break;case h.bech32:Y=h;break;case d.bech32:Y=d;break;case g.bech32:Y=g;break;case w.bech32:Y=w}if(!Y||Y.bech32!==X)throw new Error("Unknown coin bech32 prefix");Q.push({name:"coin_network",letters:X,value:Y});const re=Z[2];let pe;re?(pe=oe(re+Z[3],!0),Q.push({name:"amount",letters:Z[2]+Z[3],value:pe})):pe=null,Q.push({name:"separator",letters:"1"});const ye=ee($.slice(0,7));let le,$e,ve,_e;for($=$.slice(7),Q.push({name:"timestamp",letters:A.slice(0,7),value:ye}),A=A.slice(7);$.length>0;){const ke=$[0].toString();le=z[ke]||"unknown_tag",$e=F[ke]||H(ke),$=$.slice(1),ve=ee($.slice(0,2)),$=$.slice(2),_e=$.slice(0,ve),$=$.slice(ve),Q.push({name:le,tag:A[0],letters:A.slice(0,3+ve),value:$e(_e)}),A=A.slice(3+ve)}Q.push({name:"signature",letters:A.slice(0,104),value:o.encode(r.fromWordsUnsafe(V))}),A=A.slice(104),Q.push({name:"checksum",letters:A});let Be={paymentRequest:W,sections:Q,get expiry(){let ke=Q.find((Oe=>Oe.name==="expiry"));if(ke)return Re("timestamp")+ke.value},get route_hints(){return Q.filter((ke=>ke.name==="route_hint")).map((ke=>ke.value))}};for(let ke in S)ke!=="route_hint"&&Object.defineProperty(Be,ke,{get:()=>Re(ke)});return Be;function Re(ke){let Oe=Q.find((We=>We.name===ke));return Oe?Oe.value:void 0}},hrpToMillisat:oe}},0:(n,e,t)=>{var r=t(540);r&&r.__esModule&&(r=r.default),n.exports=typeof r=="string"?r:r.toString()}},Ws={};function et(n){var e=Ws[n];if(e!==void 0)return e.exports;var t=Ws[n]={id:n,exports:{}};return Ud[n](t,t.exports,et),t.exports}et.n=n=>{var e=n&&n.__esModule?()=>n.default:()=>n;return et.d(e,{a:e}),e},et.d=(n,e)=>{for(var t in e)et.o(e,t)&&!et.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:e[t]})},et.o=(n,e)=>Object.prototype.hasOwnProperty.call(n,e),et.r=n=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})};var Ot={};et.d(Ot,{vQ:()=>Ae,ZM:()=>lr,yk:()=>we,h0:()=>vn,n_:()=>Nl,Xz:()=>Mg,Uv:()=>ur,fU:()=>hr,Dw:()=>Ct});var Zi={};et.r(Zi),et.d(Zi,{OG:()=>ao,My:()=>Nn,Ph:()=>ut,lX:()=>oo,Id:()=>En,fg:()=>_a,qj:()=>Je,aT:()=>or,lq:()=>sn,z:()=>so,Q5:()=>sr});var Vi={};et.r(Vi),et.d(Vi,{Relay:()=>Bc,SimplePool:()=>t0,finalizeEvent:()=>Et,fj:()=>Ic,generateSecretKey:()=>fc,getEventHash:()=>nr,getFilterLimit:()=>Gp,getPublicKey:()=>wo,kinds:()=>pc,matchFilter:()=>kc,matchFilters:()=>Sc,mergeFilters:()=>Vp,nip04:()=>Uc,nip05:()=>Hc,nip10:()=>Fc,nip11:()=>qc,nip13:()=>Zc,nip18:()=>Kc,nip19:()=>Rc,nip21:()=>Qc,nip25:()=>Yc,nip27:()=>Xc,nip28:()=>Jc,nip30:()=>el,nip39:()=>nl,nip42:()=>Lc,nip44:()=>rl,nip47:()=>cl,nip57:()=>ll,nip59:()=>ul,nip98:()=>wl,parseReferences:()=>u0,serializeEvent:()=>dc,sortEvents:()=>Tf,utils:()=>lc,validateEvent:()=>Gr,verifiedSymbol:()=>rn,verifyEvent:()=>Fn});var Dd=et(705);function Qs(n){if(!Number.isSafeInteger(n)||n<0)throw new Error(`Wrong positive integer: ${n}`)}function va(n,...e){if(!(n instanceof Uint8Array))throw new Error("Expected Uint8Array");if(e.length>0&&!e.includes(n.length))throw new Error(`Expected Uint8Array of length ${e}, not of length=${n.length}`)}function Pd(n){if(typeof n!="function"||typeof n.create!="function")throw new Error("Hash should be wrapped by utils.wrapConstructor");Qs(n.outputLen),Qs(n.blockLen)}function Nr(n,e=!0){if(n.destroyed)throw new Error("Hash instance has been destroyed");if(e&&n.finished)throw new Error("Hash#digest() has already been called")}function Hd(n,e){va(n);const t=e.outputLen;if(n.length<t)throw new Error(`digestInto() expects output buffer of length at least ${t}`)}const Ti=typeof globalThis=="object"&&"crypto"in globalThis?globalThis.crypto:void 0,Ea=n=>n instanceof Uint8Array,Li=n=>new DataView(n.buffer,n.byteOffset,n.byteLength),_t=(n,e)=>n<<32-e|n>>>e;if(new Uint8Array(new Uint32Array([287454020]).buffer)[0]!==68)throw new Error("Non little-endian hardware is not supported");function io(n){if(typeof n=="string"&&(n=(function(e){if(typeof e!="string")throw new Error("utf8ToBytes expected string, got "+typeof e);return new Uint8Array(new TextEncoder().encode(e))})(n)),!Ea(n))throw new Error("expected Uint8Array, got "+typeof n);return n}class xa{clone(){return this._cloneInto()}}function jd(n){const e=r=>n().update(io(r)).digest(),t=n();return e.outputLen=t.outputLen,e.blockLen=t.blockLen,e.create=()=>n(),e}function $a(n=32){if(Ti&&typeof Ti.getRandomValues=="function")return Ti.getRandomValues(new Uint8Array(n));throw new Error("crypto.getRandomValues must be defined")}class Fd extends xa{constructor(e,t,r,o){super(),this.blockLen=e,this.outputLen=t,this.padOffset=r,this.isLE=o,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(e),this.view=Li(this.buffer)}update(e){Nr(this);const{view:t,buffer:r,blockLen:o}=this,c=(e=io(e)).length;for(let l=0;l<c;){const h=Math.min(o-this.pos,c-l);if(h!==o)r.set(e.subarray(l,l+h),this.pos),this.pos+=h,l+=h,this.pos===o&&(this.process(t,0),this.pos=0);else{const d=Li(e);for(;o<=c-l;l+=o)this.process(d,l)}}return this.length+=e.length,this.roundClean(),this}digestInto(e){Nr(this),Hd(e,this),this.finished=!0;const{buffer:t,view:r,blockLen:o,isLE:c}=this;let{pos:l}=this;t[l++]=128,this.buffer.subarray(l).fill(0),this.padOffset>o-l&&(this.process(r,0),l=0);for(let m=l;m<o;m++)t[m]=0;(function(m,v,L,C){if(typeof m.setBigUint64=="function")return m.setBigUint64(v,L,C);const S=BigInt(32),z=BigInt(4294967295),F=Number(L>>S&z),H=Number(L&z),ee=C?4:0,oe=C?0:4;m.setUint32(v+ee,F,C),m.setUint32(v+oe,H,C)})(r,o-8,BigInt(8*this.length),c),this.process(r,0);const h=Li(e),d=this.outputLen;if(d%4)throw new Error("_sha2: outputLen should be aligned to 32bit");const g=d/4,w=this.get();if(g>w.length)throw new Error("_sha2: outputLen bigger than state");for(let m=0;m<g;m++)h.setUint32(4*m,w[m],c)}digest(){const{buffer:e,outputLen:t}=this;this.digestInto(e);const r=e.slice(0,t);return this.destroy(),r}_cloneInto(e){e||(e=new this.constructor),e.set(...this.get());const{blockLen:t,buffer:r,length:o,finished:c,destroyed:l,pos:h}=this;return e.length=o,e.pos=h,e.finished=c,e.destroyed=l,o%t&&e.buffer.set(r),e}}const qd=(n,e,t)=>n&e^n&t^e&t,Zd=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Jt=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),en=new Uint32Array(64);class Vd extends Fd{constructor(){super(64,32,8,!1),this.A=0|Jt[0],this.B=0|Jt[1],this.C=0|Jt[2],this.D=0|Jt[3],this.E=0|Jt[4],this.F=0|Jt[5],this.G=0|Jt[6],this.H=0|Jt[7]}get(){const{A:e,B:t,C:r,D:o,E:c,F:l,G:h,H:d}=this;return[e,t,r,o,c,l,h,d]}set(e,t,r,o,c,l,h,d){this.A=0|e,this.B=0|t,this.C=0|r,this.D=0|o,this.E=0|c,this.F=0|l,this.G=0|h,this.H=0|d}process(e,t){for(let v=0;v<16;v++,t+=4)en[v]=e.getUint32(t,!1);for(let v=16;v<64;v++){const L=en[v-15],C=en[v-2],S=_t(L,7)^_t(L,18)^L>>>3,z=_t(C,17)^_t(C,19)^C>>>10;en[v]=z+en[v-7]+S+en[v-16]|0}let{A:r,B:o,C:c,D:l,E:h,F:d,G:g,H:w}=this;for(let v=0;v<64;v++){const L=w+(_t(h,6)^_t(h,11)^_t(h,25))+((m=h)&d^~m&g)+Zd[v]+en[v]|0,C=(_t(r,2)^_t(r,13)^_t(r,22))+qd(r,o,c)|0;w=g,g=d,d=h,h=l+L|0,l=c,c=o,o=r,r=L+C|0}var m;r=r+this.A|0,o=o+this.B|0,c=c+this.C|0,l=l+this.D|0,h=h+this.E|0,d=d+this.F|0,g=g+this.G|0,w=w+this.H|0,this.set(r,o,c,l,h,d,g,w)}roundClean(){en.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}}const Gi=jd((()=>new Vd)),Gd=(BigInt(0),BigInt(1)),Kd=BigInt(2),Hr=n=>n instanceof Uint8Array,Wd=Array.from({length:256},((n,e)=>e.toString(16).padStart(2,"0")));function Nn(n){if(!Hr(n))throw new Error("Uint8Array expected");let e="";for(let t=0;t<n.length;t++)e+=Wd[n[t]];return e}function Aa(n){if(typeof n!="string")throw new Error("hex string expected, got "+typeof n);return BigInt(n===""?"0":`0x${n}`)}function or(n){if(typeof n!="string")throw new Error("hex string expected, got "+typeof n);const e=n.length;if(e%2)throw new Error("padded hex string expected, got unpadded hex of length "+e);const t=new Uint8Array(e/2);for(let r=0;r<t.length;r++){const o=2*r,c=n.slice(o,o+2),l=Number.parseInt(c,16);if(Number.isNaN(l)||l<0)throw new Error("Invalid byte sequence");t[r]=l}return t}function ut(n){return Aa(Nn(n))}function oo(n){if(!Hr(n))throw new Error("Uint8Array expected");return Aa(Nn(Uint8Array.from(n).reverse()))}function sn(n,e){return or(n.toString(16).padStart(2*e,"0"))}function so(n,e){return sn(n,e).reverse()}function Je(n,e,t){let r;if(typeof e=="string")try{r=or(e)}catch(c){throw new Error(`${n} must be valid hex string, got "${e}". Cause: ${c}`)}else{if(!Hr(e))throw new Error(`${n} must be hex string or Uint8Array`);r=Uint8Array.from(e)}const o=r.length;if(typeof t=="number"&&o!==t)throw new Error(`${n} expected ${t} bytes, got ${o}`);return r}function En(...n){const e=new Uint8Array(n.reduce(((r,o)=>r+o.length),0));let t=0;return n.forEach((r=>{if(!Hr(r))throw new Error("Uint8Array expected");e.set(r,t),t+=r.length})),e}const ao=n=>(Kd<<BigInt(n-1))-Gd,Oi=n=>new Uint8Array(n),Ys=n=>Uint8Array.from(n);function _a(n,e,t){if(typeof n!="number"||n<2)throw new Error("hashLen must be a number");if(typeof e!="number"||e<2)throw new Error("qByteLen must be a number");if(typeof t!="function")throw new Error("hmacFn must be a function");let r=Oi(n),o=Oi(n),c=0;const l=()=>{r.fill(1),o.fill(0),c=0},h=(...w)=>t(o,r,...w),d=(w=Oi())=>{o=h(Ys([0]),w),r=h(),w.length!==0&&(o=h(Ys([1]),w),r=h())},g=()=>{if(c++>=1e3)throw new Error("drbg: tried 1000 values");let w=0;const m=[];for(;w<e;){r=h();const v=r.slice();m.push(v),w+=r.length}return En(...m)};return(w,m)=>{let v;for(l(),d(w);!(v=m(g()));)d();return l(),v}}const Qd={bigint:n=>typeof n=="bigint",function:n=>typeof n=="function",boolean:n=>typeof n=="boolean",string:n=>typeof n=="string",stringOrUint8Array:n=>typeof n=="string"||n instanceof Uint8Array,isSafeInteger:n=>Number.isSafeInteger(n),array:n=>Array.isArray(n),field:(n,e)=>e.Fp.isValid(n),hash:n=>typeof n=="function"&&Number.isSafeInteger(n.outputLen)};function sr(n,e,t={}){const r=(o,c,l)=>{const h=Qd[c];if(typeof h!="function")throw new Error(`Invalid validator "${c}", expected function`);const d=n[o];if(!(l&&d===void 0||h(d,n)))throw new Error(`Invalid param ${String(o)}=${d} (${typeof d}), expected ${c}`)};for(const[o,c]of Object.entries(e))r(o,c,!1);for(const[o,c]of Object.entries(t))r(o,c,!0);return n}const qe=BigInt(0),He=BigInt(1),mn=BigInt(2),Yd=BigInt(3),Mi=BigInt(4),Xs=BigInt(5),Js=BigInt(8);BigInt(9),BigInt(16);function Ke(n,e){const t=n%e;return t>=qe?t:e+t}function Xd(n,e,t){if(t<=qe||e<qe)throw new Error("Expected power/modulo > 0");if(t===He)return qe;let r=He;for(;e>qe;)e&He&&(r=r*n%t),n=n*n%t,e>>=He;return r}function pt(n,e,t){let r=n;for(;e-- >qe;)r*=r,r%=t;return r}function Ki(n,e){if(n===qe||e<=qe)throw new Error(`invert: expected positive integers, got n=${n} mod=${e}`);let t=Ke(n,e),r=e,o=qe,c=He;for(;t!==qe;){const l=r/t,h=r%t,d=o-c*l;r=t,t=h,o=c,c=d}if(r!==He)throw new Error("invert: does not exist");return Ke(o,e)}function Jd(n){if(n%Mi===Yd){const e=(n+He)/Mi;return function(t,r){const o=t.pow(r,e);if(!t.eql(t.sqr(o),r))throw new Error("Cannot find square root");return o}}if(n%Js===Xs){const e=(n-Xs)/Js;return function(t,r){const o=t.mul(r,mn),c=t.pow(o,e),l=t.mul(r,c),h=t.mul(t.mul(l,mn),c),d=t.mul(l,t.sub(h,t.ONE));if(!t.eql(t.sqr(d),r))throw new Error("Cannot find square root");return d}}return(function(e){const t=(e-He)/mn;let r,o,c;for(r=e-He,o=0;r%mn===qe;r/=mn,o++);for(c=mn;c<e&&Xd(c,t,e)!==e-He;c++);if(o===1){const h=(e+He)/Mi;return function(d,g){const w=d.pow(g,h);if(!d.eql(d.sqr(w),g))throw new Error("Cannot find square root");return w}}const l=(r+He)/mn;return function(h,d){if(h.pow(d,t)===h.neg(h.ONE))throw new Error("Cannot find square root");let g=o,w=h.pow(h.mul(h.ONE,c),r),m=h.pow(d,l),v=h.pow(d,r);for(;!h.eql(v,h.ONE);){if(h.eql(v,h.ZERO))return h.ZERO;let L=1;for(let S=h.sqr(v);L<g&&!h.eql(S,h.ONE);L++)S=h.sqr(S);const C=h.pow(w,He<<BigInt(g-L-1));w=h.sqr(C),m=h.mul(m,C),v=h.mul(v,w),g=L}return m}})(n)}const ef=["create","isValid","is0","neg","inv","sqrt","sqr","eql","add","sub","mul","pow","div","addN","subN","mulN","sqrN"];function ka(n,e){const t=e!==void 0?e:n.toString(2).length;return{nBitLength:t,nByteLength:Math.ceil(t/8)}}function Sa(n){if(typeof n!="bigint")throw new Error("field order must be bigint");const e=n.toString(2).length;return Math.ceil(e/8)}function ea(n){const e=Sa(n);return e+Math.ceil(e/2)}class Ia extends xa{constructor(e,t){super(),this.finished=!1,this.destroyed=!1,Pd(e);const r=io(t);if(this.iHash=e.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const o=this.blockLen,c=new Uint8Array(o);c.set(r.length>o?e.create().update(r).digest():r);for(let l=0;l<c.length;l++)c[l]^=54;this.iHash.update(c),this.oHash=e.create();for(let l=0;l<c.length;l++)c[l]^=106;this.oHash.update(c),c.fill(0)}update(e){return Nr(this),this.iHash.update(e),this}digestInto(e){Nr(this),va(e,this.outputLen),this.finished=!0,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy()}digest(){const e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||(e=Object.create(Object.getPrototypeOf(this),{}));const{oHash:t,iHash:r,finished:o,destroyed:c,blockLen:l,outputLen:h}=this;return e.finished=o,e.destroyed=c,e.blockLen=l,e.outputLen=h,e.oHash=t._cloneInto(e.oHash),e.iHash=r._cloneInto(e.iHash),e}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}}const Ca=(n,e,t)=>new Ia(n,e).update(t).digest();Ca.create=(n,e)=>new Ia(n,e);const tf=BigInt(0),Ni=BigInt(1);function Ta(n){return sr(n.Fp,ef.reduce(((e,t)=>(e[t]="function",e)),{ORDER:"bigint",MASK:"bigint",BYTES:"isSafeInteger",BITS:"isSafeInteger"})),sr(n,{n:"bigint",h:"bigint",Gx:"field",Gy:"field"},{nBitLength:"isSafeInteger",nByteLength:"isSafeInteger"}),Object.freeze({...ka(n.n,n.nBitLength),...n,p:n.Fp.ORDER})}const{Ph:nf,aT:rf}=Zi,wn={Err:class extends Error{constructor(n=""){super(n)}},_parseInt(n){const{Err:e}=wn;if(n.length<2||n[0]!==2)throw new e("Invalid signature integer tag");const t=n[1],r=n.subarray(2,t+2);if(!t||r.length!==t)throw new e("Invalid signature integer: wrong length");if(128&r[0])throw new e("Invalid signature integer: negative");if(r[0]===0&&!(128&r[1]))throw new e("Invalid signature integer: unnecessary leading zero");return{d:nf(r),l:n.subarray(t+2)}},toSig(n){const{Err:e}=wn,t=typeof n=="string"?rf(n):n;if(!(t instanceof Uint8Array))throw new Error("ui8a expected");let r=t.length;if(r<2||t[0]!=48)throw new e("Invalid signature tag");if(t[1]!==r-2)throw new e("Invalid signature: incorrect length");const{d:o,l:c}=wn._parseInt(t.subarray(2)),{d:l,l:h}=wn._parseInt(c);if(h.length)throw new e("Invalid signature: left bytes after parsing");return{r:o,s:l}},hexFromSig(n){const e=g=>8&Number.parseInt(g[0],16)?"00"+g:g,t=g=>{const w=g.toString(16);return 1&w.length?`0${w}`:w},r=e(t(n.s)),o=e(t(n.r)),c=r.length/2,l=o.length/2,h=t(c),d=t(l);return`30${t(l+c+4)}02${d}${o}02${h}${r}`}},Ut=BigInt(0),gt=BigInt(1),ta=(BigInt(2),BigInt(3));BigInt(4);function of(n){const e=(function(C){const S=Ta(C);sr(S,{a:"field",b:"field"},{allowedPrivateKeyLengths:"array",wrapPrivateKey:"boolean",isTorsionFree:"function",clearCofactor:"function",allowInfinityPoint:"boolean",fromBytes:"function",toBytes:"function"});const{endo:z,Fp:F,a:H}=S;if(z){if(!F.eql(H,F.ZERO))throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");if(typeof z!="object"||typeof z.beta!="bigint"||typeof z.splitScalar!="function")throw new Error("Expected endomorphism with beta: bigint and splitScalar: function")}return Object.freeze({...S})})(n),{Fp:t}=e,r=e.toBytes||((C,S,z)=>{const F=S.toAffine();return En(Uint8Array.from([4]),t.toBytes(F.x),t.toBytes(F.y))}),o=e.fromBytes||(C=>{const S=C.subarray(1);return{x:t.fromBytes(S.subarray(0,t.BYTES)),y:t.fromBytes(S.subarray(t.BYTES,2*t.BYTES))}});function c(C){const{a:S,b:z}=e,F=t.sqr(C),H=t.mul(F,C);return t.add(t.add(H,t.mul(C,S)),z)}if(!t.eql(t.sqr(e.Gy),c(e.Gx)))throw new Error("bad generator point: equation left != right");function l(C){return typeof C=="bigint"&&Ut<C&&C<e.n}function h(C){if(!l(C))throw new Error("Expected valid bigint: 0 < bigint < curve.n")}function d(C){const{allowedPrivateKeyLengths:S,nByteLength:z,wrapPrivateKey:F,n:H}=e;if(S&&typeof C!="bigint"){if(C instanceof Uint8Array&&(C=Nn(C)),typeof C!="string"||!S.includes(C.length))throw new Error("Invalid key");C=C.padStart(2*z,"0")}let ee;try{ee=typeof C=="bigint"?C:ut(Je("private key",C,z))}catch{throw new Error(`private key must be ${z} bytes, hex or bigint, not ${typeof C}`)}return F&&(ee=Ke(ee,H)),h(ee),ee}const g=new Map;function w(C){if(!(C instanceof m))throw new Error("ProjectivePoint expected")}class m{constructor(S,z,F){if(this.px=S,this.py=z,this.pz=F,S==null||!t.isValid(S))throw new Error("x required");if(z==null||!t.isValid(z))throw new Error("y required");if(F==null||!t.isValid(F))throw new Error("z required")}static fromAffine(S){const{x:z,y:F}=S||{};if(!S||!t.isValid(z)||!t.isValid(F))throw new Error("invalid affine point");if(S instanceof m)throw new Error("projective point not allowed");const H=ee=>t.eql(ee,t.ZERO);return H(z)&&H(F)?m.ZERO:new m(z,F,t.ONE)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}static normalizeZ(S){const z=t.invertBatch(S.map((F=>F.pz)));return S.map(((F,H)=>F.toAffine(z[H]))).map(m.fromAffine)}static fromHex(S){const z=m.fromAffine(o(Je("pointHex",S)));return z.assertValidity(),z}static fromPrivateKey(S){return m.BASE.multiply(d(S))}_setWindowSize(S){this._WINDOW_SIZE=S,g.delete(this)}assertValidity(){if(this.is0()){if(e.allowInfinityPoint&&!t.is0(this.py))return;throw new Error("bad point: ZERO")}const{x:S,y:z}=this.toAffine();if(!t.isValid(S)||!t.isValid(z))throw new Error("bad point: x or y not FE");const F=t.sqr(z),H=c(S);if(!t.eql(F,H))throw new Error("bad point: equation left != right");if(!this.isTorsionFree())throw new Error("bad point: not in prime-order subgroup")}hasEvenY(){const{y:S}=this.toAffine();if(t.isOdd)return!t.isOdd(S);throw new Error("Field doesn't support isOdd")}equals(S){w(S);const{px:z,py:F,pz:H}=this,{px:ee,py:oe,pz:W}=S,K=t.eql(t.mul(z,W),t.mul(ee,H)),Q=t.eql(t.mul(F,W),t.mul(oe,H));return K&&Q}negate(){return new m(this.px,t.neg(this.py),this.pz)}double(){const{a:S,b:z}=e,F=t.mul(z,ta),{px:H,py:ee,pz:oe}=this;let W=t.ZERO,K=t.ZERO,Q=t.ZERO,G=t.mul(H,H),k=t.mul(ee,ee),$=t.mul(oe,oe),A=t.mul(H,ee);return A=t.add(A,A),Q=t.mul(H,oe),Q=t.add(Q,Q),W=t.mul(S,Q),K=t.mul(F,$),K=t.add(W,K),W=t.sub(k,K),K=t.add(k,K),K=t.mul(W,K),W=t.mul(A,W),Q=t.mul(F,Q),$=t.mul(S,$),A=t.sub(G,$),A=t.mul(S,A),A=t.add(A,Q),Q=t.add(G,G),G=t.add(Q,G),G=t.add(G,$),G=t.mul(G,A),K=t.add(K,G),$=t.mul(ee,oe),$=t.add($,$),G=t.mul($,A),W=t.sub(W,G),Q=t.mul($,k),Q=t.add(Q,Q),Q=t.add(Q,Q),new m(W,K,Q)}add(S){w(S);const{px:z,py:F,pz:H}=this,{px:ee,py:oe,pz:W}=S;let K=t.ZERO,Q=t.ZERO,G=t.ZERO;const k=e.a,$=t.mul(e.b,ta);let A=t.mul(z,ee),V=t.mul(F,oe),Z=t.mul(H,W),X=t.add(z,F),Y=t.add(ee,oe);X=t.mul(X,Y),Y=t.add(A,V),X=t.sub(X,Y),Y=t.add(z,H);let re=t.add(ee,W);return Y=t.mul(Y,re),re=t.add(A,Z),Y=t.sub(Y,re),re=t.add(F,H),K=t.add(oe,W),re=t.mul(re,K),K=t.add(V,Z),re=t.sub(re,K),G=t.mul(k,Y),K=t.mul($,Z),G=t.add(K,G),K=t.sub(V,G),G=t.add(V,G),Q=t.mul(K,G),V=t.add(A,A),V=t.add(V,A),Z=t.mul(k,Z),Y=t.mul($,Y),V=t.add(V,Z),Z=t.sub(A,Z),Z=t.mul(k,Z),Y=t.add(Y,Z),A=t.mul(V,Y),Q=t.add(Q,A),A=t.mul(re,Y),K=t.mul(X,K),K=t.sub(K,A),A=t.mul(X,V),G=t.mul(re,G),G=t.add(G,A),new m(K,Q,G)}subtract(S){return this.add(S.negate())}is0(){return this.equals(m.ZERO)}wNAF(S){return L.wNAFCached(this,g,S,(z=>{const F=t.invertBatch(z.map((H=>H.pz)));return z.map(((H,ee)=>H.toAffine(F[ee]))).map(m.fromAffine)}))}multiplyUnsafe(S){const z=m.ZERO;if(S===Ut)return z;if(h(S),S===gt)return this;const{endo:F}=e;if(!F)return L.unsafeLadder(this,S);let{k1neg:H,k1:ee,k2neg:oe,k2:W}=F.splitScalar(S),K=z,Q=z,G=this;for(;ee>Ut||W>Ut;)ee&gt&&(K=K.add(G)),W&gt&&(Q=Q.add(G)),G=G.double(),ee>>=gt,W>>=gt;return H&&(K=K.negate()),oe&&(Q=Q.negate()),Q=new m(t.mul(Q.px,F.beta),Q.py,Q.pz),K.add(Q)}multiply(S){h(S);let z,F,H=S;const{endo:ee}=e;if(ee){const{k1neg:oe,k1:W,k2neg:K,k2:Q}=ee.splitScalar(H);let{p:G,f:k}=this.wNAF(W),{p:$,f:A}=this.wNAF(Q);G=L.constTimeNegate(oe,G),$=L.constTimeNegate(K,$),$=new m(t.mul($.px,ee.beta),$.py,$.pz),z=G.add($),F=k.add(A)}else{const{p:oe,f:W}=this.wNAF(H);z=oe,F=W}return m.normalizeZ([z,F])[0]}multiplyAndAddUnsafe(S,z,F){const H=m.BASE,ee=(W,K)=>K!==Ut&&K!==gt&&W.equals(H)?W.multiply(K):W.multiplyUnsafe(K),oe=ee(this,z).add(ee(S,F));return oe.is0()?void 0:oe}toAffine(S){const{px:z,py:F,pz:H}=this,ee=this.is0();S==null&&(S=ee?t.ONE:t.inv(H));const oe=t.mul(z,S),W=t.mul(F,S),K=t.mul(H,S);if(ee)return{x:t.ZERO,y:t.ZERO};if(!t.eql(K,t.ONE))throw new Error("invZ was invalid");return{x:oe,y:W}}isTorsionFree(){const{h:S,isTorsionFree:z}=e;if(S===gt)return!0;if(z)return z(m,this);throw new Error("isTorsionFree() has not been declared for the elliptic curve")}clearCofactor(){const{h:S,clearCofactor:z}=e;return S===gt?this:z?z(m,this):this.multiplyUnsafe(e.h)}toRawBytes(S=!0){return this.assertValidity(),r(m,this,S)}toHex(S=!0){return Nn(this.toRawBytes(S))}}m.BASE=new m(e.Gx,e.Gy,t.ONE),m.ZERO=new m(t.ZERO,t.ONE,t.ZERO);const v=e.nBitLength,L=(function(C,S){const z=(H,ee)=>{const oe=ee.negate();return H?oe:ee},F=H=>({windows:Math.ceil(S/H)+1,windowSize:2**(H-1)});return{constTimeNegate:z,unsafeLadder(H,ee){let oe=C.ZERO,W=H;for(;ee>tf;)ee&Ni&&(oe=oe.add(W)),W=W.double(),ee>>=Ni;return oe},precomputeWindow(H,ee){const{windows:oe,windowSize:W}=F(ee),K=[];let Q=H,G=Q;for(let k=0;k<oe;k++){G=Q,K.push(G);for(let $=1;$<W;$++)G=G.add(Q),K.push(G);Q=G.double()}return K},wNAF(H,ee,oe){const{windows:W,windowSize:K}=F(H);let Q=C.ZERO,G=C.BASE;const k=BigInt(2**H-1),$=2**H,A=BigInt(H);for(let V=0;V<W;V++){const Z=V*K;let X=Number(oe&k);oe>>=A,X>K&&(X-=$,oe+=Ni);const Y=Z,re=Z+Math.abs(X)-1,pe=V%2!=0,ye=X<0;X===0?G=G.add(z(pe,ee[Y])):Q=Q.add(z(ye,ee[re]))}return{p:Q,f:G}},wNAFCached(H,ee,oe,W){const K=H._WINDOW_SIZE||1;let Q=ee.get(H);return Q||(Q=this.precomputeWindow(H,K),K!==1&&ee.set(H,W(Q))),this.wNAF(K,Q,oe)}}})(m,e.endo?Math.ceil(v/2):v);return{CURVE:e,ProjectivePoint:m,normPrivateKeyToScalar:d,weierstrassEquation:c,isWithinCurveOrder:l}}function sf(n){const e=(function(k){const $=Ta(k);return sr($,{hash:"hash",hmac:"function",randomBytes:"function"},{bits2int:"function",bits2int_modN:"function",lowS:"boolean"}),Object.freeze({lowS:!0,...$})})(n),{Fp:t,n:r}=e,o=t.BYTES+1,c=2*t.BYTES+1;function l(k){return Ke(k,r)}function h(k){return Ki(k,r)}const{ProjectivePoint:d,normPrivateKeyToScalar:g,weierstrassEquation:w,isWithinCurveOrder:m}=of({...e,toBytes(k,$,A){const V=$.toAffine(),Z=t.toBytes(V.x),X=En;return A?X(Uint8Array.from([$.hasEvenY()?2:3]),Z):X(Uint8Array.from([4]),Z,t.toBytes(V.y))},fromBytes(k){const $=k.length,A=k[0],V=k.subarray(1);if($!==o||A!==2&&A!==3){if($===c&&A===4)return{x:t.fromBytes(V.subarray(0,t.BYTES)),y:t.fromBytes(V.subarray(t.BYTES,2*t.BYTES))};throw new Error(`Point of length ${$} was invalid. Expected ${o} compressed bytes or ${c} uncompressed bytes`)}{const X=ut(V);if(!(Ut<(Z=X)&&Z<t.ORDER))throw new Error("Point is not on curve");const Y=w(X);let re=t.sqrt(Y);return!(1&~A)!=((re&gt)===gt)&&(re=t.neg(re)),{x:X,y:re}}var Z}}),v=k=>Nn(sn(k,e.nByteLength));function L(k){return k>r>>gt}const C=(k,$,A)=>ut(k.slice($,A));class S{constructor($,A,V){this.r=$,this.s=A,this.recovery=V,this.assertValidity()}static fromCompact($){const A=e.nByteLength;return $=Je("compactSignature",$,2*A),new S(C($,0,A),C($,A,2*A))}static fromDER($){const{r:A,s:V}=wn.toSig(Je("DER",$));return new S(A,V)}assertValidity(){if(!m(this.r))throw new Error("r must be 0 < r < CURVE.n");if(!m(this.s))throw new Error("s must be 0 < s < CURVE.n")}addRecoveryBit($){return new S(this.r,this.s,$)}recoverPublicKey($){const{r:A,s:V,recovery:Z}=this,X=ee(Je("msgHash",$));if(Z==null||![0,1,2,3].includes(Z))throw new Error("recovery id invalid");const Y=Z===2||Z===3?A+e.n:A;if(Y>=t.ORDER)throw new Error("recovery id 2 or 3 invalid");const re=1&Z?"03":"02",pe=d.fromHex(re+v(Y)),ye=h(Y),le=l(-X*ye),$e=l(V*ye),ve=d.BASE.multiplyAndAddUnsafe(pe,le,$e);if(!ve)throw new Error("point at infinify");return ve.assertValidity(),ve}hasHighS(){return L(this.s)}normalizeS(){return this.hasHighS()?new S(this.r,l(-this.s),this.recovery):this}toDERRawBytes(){return or(this.toDERHex())}toDERHex(){return wn.hexFromSig({r:this.r,s:this.s})}toCompactRawBytes(){return or(this.toCompactHex())}toCompactHex(){return v(this.r)+v(this.s)}}const z={isValidPrivateKey(k){try{return g(k),!0}catch{return!1}},normPrivateKeyToScalar:g,randomPrivateKey:()=>{const k=ea(e.n);return(function($,A,V=!1){const Z=$.length,X=Sa(A),Y=ea(A);if(Z<16||Z<Y||Z>1024)throw new Error(`expected ${Y}-1024 bytes of input, got ${Z}`);const re=Ke(V?ut($):oo($),A-He)+He;return V?so(re,X):sn(re,X)})(e.randomBytes(k),e.n)},precompute:(k=8,$=d.BASE)=>($._setWindowSize(k),$.multiply(BigInt(3)),$)};function F(k){const $=k instanceof Uint8Array,A=typeof k=="string",V=($||A)&&k.length;return $?V===o||V===c:A?V===2*o||V===2*c:k instanceof d}const H=e.bits2int||function(k){const $=ut(k),A=8*k.length-e.nBitLength;return A>0?$>>BigInt(A):$},ee=e.bits2int_modN||function(k){return l(H(k))},oe=ao(e.nBitLength);function W(k){if(typeof k!="bigint")throw new Error("bigint expected");if(!(Ut<=k&&k<oe))throw new Error(`bigint expected < 2^${e.nBitLength}`);return sn(k,e.nByteLength)}function K(k,$,A=Q){if(["recovered","canonical"].some((_e=>_e in A)))throw new Error("sign() legacy options not supported");const{hash:V,randomBytes:Z}=e;let{lowS:X,prehash:Y,extraEntropy:re}=A;X==null&&(X=!0),k=Je("msgHash",k),Y&&(k=Je("prehashed msgHash",V(k)));const pe=ee(k),ye=g($),le=[W(ye),W(pe)];if(re!=null){const _e=re===!0?Z(t.BYTES):re;le.push(Je("extraEntropy",_e))}const $e=En(...le),ve=pe;return{seed:$e,k2sig:function(_e){const Be=H(_e);if(!m(Be))return;const Re=h(Be),ke=d.BASE.multiply(Be).toAffine(),Oe=l(ke.x);if(Oe===Ut)return;const We=l(Re*l(ve+Oe*ye));if(We===Ut)return;let ae=(ke.x===Oe?0:2)|Number(ke.y&gt),ze=We;return X&&L(We)&&(ze=(function(qn){return L(qn)?l(-qn):qn})(We),ae^=1),new S(Oe,ze,ae)}}}const Q={lowS:e.lowS,prehash:!1},G={lowS:e.lowS,prehash:!1};return d.BASE._setWindowSize(8),{CURVE:e,getPublicKey:function(k,$=!0){return d.fromPrivateKey(k).toRawBytes($)},getSharedSecret:function(k,$,A=!0){if(F(k))throw new Error("first arg must be private key");if(!F($))throw new Error("second arg must be public key");return d.fromHex($).multiply(g(k)).toRawBytes(A)},sign:function(k,$,A=Q){const{seed:V,k2sig:Z}=K(k,$,A),X=e;return _a(X.hash.outputLen,X.nByteLength,X.hmac)(V,Z)},verify:function(k,$,A,V=G){const Z=k;if($=Je("msgHash",$),A=Je("publicKey",A),"strict"in V)throw new Error("options.strict was renamed to lowS");const{lowS:X,prehash:Y}=V;let re,pe;try{if(typeof Z=="string"||Z instanceof Uint8Array)try{re=S.fromDER(Z)}catch(ke){if(!(ke instanceof wn.Err))throw ke;re=S.fromCompact(Z)}else{if(typeof Z!="object"||typeof Z.r!="bigint"||typeof Z.s!="bigint")throw new Error("PARSE");{const{r:ke,s:Oe}=Z;re=new S(ke,Oe)}}pe=d.fromHex(A)}catch(ke){if(ke.message==="PARSE")throw new Error("signature must be Signature instance, Uint8Array or hex string");return!1}if(X&&re.hasHighS())return!1;Y&&($=e.hash($));const{r:ye,s:le}=re,$e=ee($),ve=h(le),_e=l($e*ve),Be=l(ye*ve),Re=d.BASE.multiplyAndAddUnsafe(pe,_e,Be)?.toAffine();return!!Re&&l(Re.x)===ye},ProjectivePoint:d,Signature:S,utils:z}}function af(n){return{hash:n,hmac:(e,...t)=>Ca(n,e,(function(...r){const o=new Uint8Array(r.reduce(((l,h)=>l+h.length),0));let c=0;return r.forEach((l=>{if(!Ea(l))throw new Error("Uint8Array expected");o.set(l,c),c+=l.length})),o})(...t)),randomBytes:$a}}const jr=BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),Br=BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),La=BigInt(1),Rr=BigInt(2),na=(n,e)=>(n+e/Rr)/e;function Oa(n){const e=jr,t=BigInt(3),r=BigInt(6),o=BigInt(11),c=BigInt(22),l=BigInt(23),h=BigInt(44),d=BigInt(88),g=n*n*n%e,w=g*g*n%e,m=pt(w,t,e)*w%e,v=pt(m,t,e)*w%e,L=pt(v,Rr,e)*g%e,C=pt(L,o,e)*L%e,S=pt(C,c,e)*C%e,z=pt(S,h,e)*S%e,F=pt(z,d,e)*z%e,H=pt(F,h,e)*S%e,ee=pt(H,t,e)*w%e,oe=pt(ee,l,e)*C%e,W=pt(oe,r,e)*g%e,K=pt(W,Rr,e);if(!Wi.eql(Wi.sqr(K),n))throw new Error("Cannot find square root");return K}const Wi=(function(n,e,t=!1,r={}){if(n<=qe)throw new Error(`Expected Field ORDER > 0, got ${n}`);const{nBitLength:o,nByteLength:c}=ka(n,e);if(c>2048)throw new Error("Field lengths over 2048 bytes are not supported");const l=Jd(n),h=Object.freeze({ORDER:n,BITS:o,BYTES:c,MASK:ao(o),ZERO:qe,ONE:He,create:d=>Ke(d,n),isValid:d=>{if(typeof d!="bigint")throw new Error("Invalid field element: expected bigint, got "+typeof d);return qe<=d&&d<n},is0:d=>d===qe,isOdd:d=>(d&He)===He,neg:d=>Ke(-d,n),eql:(d,g)=>d===g,sqr:d=>Ke(d*d,n),add:(d,g)=>Ke(d+g,n),sub:(d,g)=>Ke(d-g,n),mul:(d,g)=>Ke(d*g,n),pow:(d,g)=>(function(w,m,v){if(v<qe)throw new Error("Expected power > 0");if(v===qe)return w.ONE;if(v===He)return m;let L=w.ONE,C=m;for(;v>qe;)v&He&&(L=w.mul(L,C)),C=w.sqr(C),v>>=He;return L})(h,d,g),div:(d,g)=>Ke(d*Ki(g,n),n),sqrN:d=>d*d,addN:(d,g)=>d+g,subN:(d,g)=>d-g,mulN:(d,g)=>d*g,inv:d=>Ki(d,n),sqrt:r.sqrt||(d=>l(h,d)),invertBatch:d=>(function(g,w){const m=new Array(w.length),v=w.reduce(((C,S,z)=>g.is0(S)?C:(m[z]=C,g.mul(C,S))),g.ONE),L=g.inv(v);return w.reduceRight(((C,S,z)=>g.is0(S)?C:(m[z]=g.mul(C,m[z]),g.mul(C,S))),L),m})(h,d),cmov:(d,g,w)=>w?g:d,toBytes:d=>t?so(d,c):sn(d,c),fromBytes:d=>{if(d.length!==c)throw new Error(`Fp.fromBytes: expected ${c}, got ${d.length}`);return t?oo(d):ut(d)}});return Object.freeze(h)})(jr,void 0,void 0,{sqrt:Oa}),Dn=(function(n,e){const t=r=>sf({...n,...af(r)});return Object.freeze({...t(e),create:t})})({a:BigInt(0),b:BigInt(7),Fp:Wi,n:Br,Gx:BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),Gy:BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),h:BigInt(1),lowS:!0,endo:{beta:BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),splitScalar:n=>{const e=Br,t=BigInt("0x3086d221a7d46bcde86c90e49284eb15"),r=-La*BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),o=BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),c=t,l=BigInt("0x100000000000000000000000000000000"),h=na(c*n,e),d=na(-r*n,e);let g=Ke(n-h*t-d*o,e),w=Ke(-h*r-d*c,e);const m=g>l,v=w>l;if(m&&(g=e-g),v&&(w=e-w),g>l||w>l)throw new Error("splitScalar: Endomorphism failed, k="+n);return{k1neg:m,k1:g,k2neg:v,k2:w}}}},Gi),Fr=BigInt(0),Ma=n=>typeof n=="bigint"&&Fr<n&&n<jr,ra={};function zr(n,...e){let t=ra[n];if(t===void 0){const r=Gi(Uint8Array.from(n,(o=>o.charCodeAt(0))));t=En(r,r),ra[n]=t}return Gi(En(t,...e))}const co=n=>n.toRawBytes(!0).slice(1),Qi=n=>sn(n,32),Bi=n=>Ke(n,jr),ar=n=>Ke(n,Br),lo=Dn.ProjectivePoint;function Yi(n){let e=Dn.utils.normPrivateKeyToScalar(n),t=lo.fromPrivateKey(e);return{scalar:t.hasEvenY()?e:ar(-e),bytes:co(t)}}function Na(n){if(!Ma(n))throw new Error("bad x: need 0 < x < p");const e=Bi(n*n);let t=Oa(Bi(e*n+BigInt(7)));t%Rr!==Fr&&(t=Bi(-t));const r=new lo(n,t,La);return r.assertValidity(),r}function Ba(...n){return ar(ut(zr("BIP0340/challenge",...n)))}function cf(n){return Yi(n).bytes}function lf(n,e,t=$a(32)){const r=Je("message",n),{bytes:o,scalar:c}=Yi(e),l=Je("auxRand",t,32),h=Qi(c^ut(zr("BIP0340/aux",l))),d=zr("BIP0340/nonce",h,o,r),g=ar(ut(d));if(g===Fr)throw new Error("sign failed: k is zero");const{bytes:w,scalar:m}=Yi(g),v=Ba(w,o,r),L=new Uint8Array(64);if(L.set(w,0),L.set(Qi(ar(m+v*c)),32),!Ra(L,r,o))throw new Error("sign: Invalid signature produced");return L}function Ra(n,e,t){const r=Je("signature",n,64),o=Je("message",e),c=Je("publicKey",t,32);try{const w=Na(ut(c)),m=ut(r.subarray(0,32));if(!Ma(m))return!1;const v=ut(r.subarray(32,64));if(!(typeof(g=v)=="bigint"&&Fr<g&&g<Br))return!1;const L=Ba(Qi(m),co(w),o),C=(l=w,h=v,d=ar(-L),lo.BASE.multiplyAndAddUnsafe(l,h,d));return!(!C||!C.hasEvenY()||C.toAffine().x!==m)}catch{return!1}var l,h,d,g}const St={getPublicKey:cf,sign:lf,verify:Ra,utils:{randomPrivateKey:Dn.utils.randomPrivateKey,lift_x:Na,pointToBytes:co,numberToBytesBE:sn,bytesToNumberBE:ut,taggedHash:zr,mod:Ke}},Ri=typeof globalThis=="object"&&"crypto"in globalThis?globalThis.crypto:void 0,uo=n=>n instanceof Uint8Array,zi=n=>new DataView(n.buffer,n.byteOffset,n.byteLength),kt=(n,e)=>n<<32-e|n>>>e;if(new Uint8Array(new Uint32Array([287454020]).buffer)[0]!==68)throw new Error("Non little-endian hardware is not supported");const uf=Array.from({length:256},((n,e)=>e.toString(16).padStart(2,"0")));function Fe(n){if(!uo(n))throw new Error("Uint8Array expected");let e="";for(let t=0;t<n.length;t++)e+=uf[n[t]];return e}function Bn(n){if(typeof n!="string")throw new Error("hex string expected, got "+typeof n);const e=n.length;if(e%2)throw new Error("padded hex string expected, got unpadded hex of length "+e);const t=new Uint8Array(e/2);for(let r=0;r<t.length;r++){const o=2*r,c=n.slice(o,o+2),l=Number.parseInt(c,16);if(Number.isNaN(l)||l<0)throw new Error("Invalid byte sequence");t[r]=l}return t}function cr(n){if(typeof n=="string"&&(n=(function(e){if(typeof e!="string")throw new Error("utf8ToBytes expected string, got "+typeof e);return new Uint8Array(new TextEncoder().encode(e))})(n)),!uo(n))throw new Error("expected Uint8Array, got "+typeof n);return n}function qr(...n){const e=new Uint8Array(n.reduce(((r,o)=>r+o.length),0));let t=0;return n.forEach((r=>{if(!uo(r))throw new Error("Uint8Array expected");e.set(r,t),t+=r.length})),e}class za{clone(){return this._cloneInto()}}function Ua(n){const e=r=>n().update(cr(r)).digest(),t=n();return e.outputLen=t.outputLen,e.blockLen=t.blockLen,e.create=()=>n(),e}function Da(n=32){if(Ri&&typeof Ri.getRandomValues=="function")return Ri.getRandomValues(new Uint8Array(n));throw new Error("crypto.getRandomValues must be defined")}function Ui(n){if(!Number.isSafeInteger(n)||n<0)throw new Error(`Wrong positive integer: ${n}`)}function ia(n,...e){if(!(n instanceof Uint8Array))throw new Error("Expected Uint8Array");if(e.length>0&&!e.includes(n.length))throw new Error(`Expected Uint8Array of length ${e}, not of length=${n.length}`)}const hf={number:Ui,bool:function(n){if(typeof n!="boolean")throw new Error(`Expected boolean, not ${n}`)},bytes:ia,hash:function(n){if(typeof n!="function"||typeof n.create!="function")throw new Error("Hash should be wrapped by utils.wrapConstructor");Ui(n.outputLen),Ui(n.blockLen)},exists:function(n,e=!0){if(n.destroyed)throw new Error("Hash instance has been destroyed");if(e&&n.finished)throw new Error("Hash#digest() has already been called")},output:function(n,e){ia(n);const t=e.outputLen;if(n.length<t)throw new Error(`digestInto() expects output buffer of length at least ${t}`)}},Tt=hf;class df extends za{constructor(e,t,r,o){super(),this.blockLen=e,this.outputLen=t,this.padOffset=r,this.isLE=o,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(e),this.view=zi(this.buffer)}update(e){Tt.exists(this);const{view:t,buffer:r,blockLen:o}=this,c=(e=cr(e)).length;for(let l=0;l<c;){const h=Math.min(o-this.pos,c-l);if(h!==o)r.set(e.subarray(l,l+h),this.pos),this.pos+=h,l+=h,this.pos===o&&(this.process(t,0),this.pos=0);else{const d=zi(e);for(;o<=c-l;l+=o)this.process(d,l)}}return this.length+=e.length,this.roundClean(),this}digestInto(e){Tt.exists(this),Tt.output(e,this),this.finished=!0;const{buffer:t,view:r,blockLen:o,isLE:c}=this;let{pos:l}=this;t[l++]=128,this.buffer.subarray(l).fill(0),this.padOffset>o-l&&(this.process(r,0),l=0);for(let m=l;m<o;m++)t[m]=0;(function(m,v,L,C){if(typeof m.setBigUint64=="function")return m.setBigUint64(v,L,C);const S=BigInt(32),z=BigInt(4294967295),F=Number(L>>S&z),H=Number(L&z),ee=C?4:0,oe=C?0:4;m.setUint32(v+ee,F,C),m.setUint32(v+oe,H,C)})(r,o-8,BigInt(8*this.length),c),this.process(r,0);const h=zi(e),d=this.outputLen;if(d%4)throw new Error("_sha2: outputLen should be aligned to 32bit");const g=d/4,w=this.get();if(g>w.length)throw new Error("_sha2: outputLen bigger than state");for(let m=0;m<g;m++)h.setUint32(4*m,w[m],c)}digest(){const{buffer:e,outputLen:t}=this;this.digestInto(e);const r=e.slice(0,t);return this.destroy(),r}_cloneInto(e){e||(e=new this.constructor),e.set(...this.get());const{blockLen:t,buffer:r,length:o,finished:c,destroyed:l,pos:h}=this;return e.length=o,e.pos=h,e.finished=c,e.destroyed=l,o%t&&e.buffer.set(r),e}}const ff=(n,e,t)=>n&e^n&t^e&t,pf=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),tn=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),nn=new Uint32Array(64);class Pa extends df{constructor(){super(64,32,8,!1),this.A=0|tn[0],this.B=0|tn[1],this.C=0|tn[2],this.D=0|tn[3],this.E=0|tn[4],this.F=0|tn[5],this.G=0|tn[6],this.H=0|tn[7]}get(){const{A:e,B:t,C:r,D:o,E:c,F:l,G:h,H:d}=this;return[e,t,r,o,c,l,h,d]}set(e,t,r,o,c,l,h,d){this.A=0|e,this.B=0|t,this.C=0|r,this.D=0|o,this.E=0|c,this.F=0|l,this.G=0|h,this.H=0|d}process(e,t){for(let v=0;v<16;v++,t+=4)nn[v]=e.getUint32(t,!1);for(let v=16;v<64;v++){const L=nn[v-15],C=nn[v-2],S=kt(L,7)^kt(L,18)^L>>>3,z=kt(C,17)^kt(C,19)^C>>>10;nn[v]=z+nn[v-7]+S+nn[v-16]|0}let{A:r,B:o,C:c,D:l,E:h,F:d,G:g,H:w}=this;for(let v=0;v<64;v++){const L=w+(kt(h,6)^kt(h,11)^kt(h,25))+((m=h)&d^~m&g)+pf[v]+nn[v]|0,C=(kt(r,2)^kt(r,13)^kt(r,22))+ff(r,o,c)|0;w=g,g=d,d=h,h=l+L|0,l=c,c=o,o=r,r=L+C|0}var m;r=r+this.A|0,o=o+this.B|0,c=c+this.C|0,l=l+this.D|0,h=h+this.E|0,d=d+this.F|0,g=g+this.G|0,w=w+this.H|0,this.set(r,o,c,l,h,d,g,w)}roundClean(){nn.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}}class gf extends Pa{constructor(){super(),this.A=-1056596264,this.B=914150663,this.C=812702999,this.D=-150054599,this.E=-4191439,this.F=1750603025,this.G=1694076839,this.H=-1090891868,this.outputLen=28}}const xn=Ua((()=>new Pa));Ua((()=>new gf));function Pn(n){if(!Number.isSafeInteger(n))throw new Error(`Wrong integer: ${n}`)}function Pt(...n){const e=(o,c)=>l=>o(c(l)),t=Array.from(n).reverse().reduce(((o,c)=>o?e(o,c.encode):c.encode),void 0),r=n.reduce(((o,c)=>o?e(o,c.decode):c.decode),void 0);return{encode:t,decode:r}}function Ht(n){return{encode:e=>{if(!Array.isArray(e)||e.length&&typeof e[0]!="number")throw new Error("alphabet.encode input should be an array of numbers");return e.map((t=>{if(Pn(t),t<0||t>=n.length)throw new Error(`Digit index outside alphabet: ${t} (alphabet: ${n.length})`);return n[t]}))},decode:e=>{if(!Array.isArray(e)||e.length&&typeof e[0]!="string")throw new Error("alphabet.decode input should be array of strings");return e.map((t=>{if(typeof t!="string")throw new Error(`alphabet.decode: not string element=${t}`);const r=n.indexOf(t);if(r===-1)throw new Error(`Unknown letter: "${t}". Allowed: ${n}`);return r}))}}}function jt(n=""){if(typeof n!="string")throw new Error("join separator should be string");return{encode:e=>{if(!Array.isArray(e)||e.length&&typeof e[0]!="string")throw new Error("join.encode input should be array of strings");for(let t of e)if(typeof t!="string")throw new Error(`join.encode: non-string input=${t}`);return e.join(n)},decode:e=>{if(typeof e!="string")throw new Error("join.decode input should be string");return e.split(n)}}}function Ur(n,e="="){if(Pn(n),typeof e!="string")throw new Error("padding chr should be string");return{encode(t){if(!Array.isArray(t)||t.length&&typeof t[0]!="string")throw new Error("padding.encode input should be array of strings");for(let r of t)if(typeof r!="string")throw new Error(`padding.encode: non-string input=${r}`);for(;t.length*n%8;)t.push(e);return t},decode(t){if(!Array.isArray(t)||t.length&&typeof t[0]!="string")throw new Error("padding.encode input should be array of strings");for(let o of t)if(typeof o!="string")throw new Error(`padding.decode: non-string input=${o}`);let r=t.length;if(r*n%8)throw new Error("Invalid padding: string should have whole number of bytes");for(;r>0&&t[r-1]===e;r--)if(!((r-1)*n%8))throw new Error("Invalid padding: string has too much padding");return t.slice(0,r)}}}function Ha(n){if(typeof n!="function")throw new Error("normalize fn should be function");return{encode:e=>e,decode:e=>n(e)}}function oa(n,e,t){if(e<2)throw new Error(`convertRadix: wrong from=${e}, base cannot be less than 2`);if(t<2)throw new Error(`convertRadix: wrong to=${t}, base cannot be less than 2`);if(!Array.isArray(n))throw new Error("convertRadix: data should be array");if(!n.length)return[];let r=0;const o=[],c=Array.from(n);for(c.forEach((l=>{if(Pn(l),l<0||l>=e)throw new Error(`Wrong integer: ${l}`)}));;){let l=0,h=!0;for(let d=r;d<c.length;d++){const g=c[d],w=e*l+g;if(!Number.isSafeInteger(w)||e*l/e!==l||w-g!=e*l)throw new Error("convertRadix: carry overflow");if(l=w%t,c[d]=Math.floor(w/t),!Number.isSafeInteger(c[d])||c[d]*t+l!==w)throw new Error("convertRadix: carry overflow");h&&(c[d]?h=!1:r=d)}if(o.push(l),h)break}for(let l=0;l<n.length-1&&n[l]===0;l++)o.push(0);return o.reverse()}const ja=(n,e)=>e?ja(e,n%e):n,Dr=(n,e)=>n+(e-ja(n,e));function Xi(n,e,t,r){if(!Array.isArray(n))throw new Error("convertRadix2: data should be array");if(e<=0||e>32)throw new Error(`convertRadix2: wrong from=${e}`);if(t<=0||t>32)throw new Error(`convertRadix2: wrong to=${t}`);if(Dr(e,t)>32)throw new Error(`convertRadix2: carry overflow from=${e} to=${t} carryBits=${Dr(e,t)}`);let o=0,c=0;const l=2**t-1,h=[];for(const d of n){if(Pn(d),d>=2**e)throw new Error(`convertRadix2: invalid data word=${d} from=${e}`);if(o=o<<e|d,c+e>32)throw new Error(`convertRadix2: carry overflow pos=${c} from=${e}`);for(c+=e;c>=t;c-=t)h.push((o>>c-t&l)>>>0);o&=2**c-1}if(o=o<<t-c&l,!r&&c>=e)throw new Error("Excess padding");if(!r&&o)throw new Error(`Non-zero padding: ${o}`);return r&&c>0&&h.push(o>>>0),h}function yf(n){return Pn(n),{encode:e=>{if(!(e instanceof Uint8Array))throw new Error("radix.encode input should be Uint8Array");return oa(Array.from(e),256,n)},decode:e=>{if(!Array.isArray(e)||e.length&&typeof e[0]!="number")throw new Error("radix.decode input should be array of strings");return Uint8Array.from(oa(e,n,256))}}}function an(n,e=!1){if(Pn(n),n<=0||n>32)throw new Error("radix2: bits should be in (0..32]");if(Dr(8,n)>32||Dr(n,8)>32)throw new Error("radix2: carry overflow");return{encode:t=>{if(!(t instanceof Uint8Array))throw new Error("radix2.encode input should be Uint8Array");return Xi(Array.from(t),8,n,!e)},decode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!="number")throw new Error("radix2.decode input should be array of strings");return Uint8Array.from(Xi(t,n,8,e))}}}function sa(n){if(typeof n!="function")throw new Error("unsafeWrapper fn should be function");return function(...e){try{return n.apply(null,e)}catch{}}}Pt(an(4),Ht("0123456789ABCDEF"),jt(""));Pt(an(5),Ht("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"),Ur(5),jt(""));const cn=(Pt(an(5),Ht("0123456789ABCDEFGHIJKLMNOPQRSTUV"),Ur(5),jt("")),Pt(an(5),Ht("0123456789ABCDEFGHJKMNPQRSTVWXYZ"),jt(""),Ha((n=>n.toUpperCase().replace(/O/g,"0").replace(/[IL]/g,"1")))),Pt(an(6),Ht("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),Ur(6),jt("")));Pt(an(6),Ht("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),Ur(6),jt(""));const Ji=n=>Pt(yf(58),Ht(n),jt(""));Ji("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");Ji("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),Ji("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");const eo=Pt(Ht("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),jt("")),aa=[996825010,642813549,513874426,1027748829,705979059];function Jn(n){const e=n>>25;let t=(33554431&n)<<5;for(let r=0;r<aa.length;r++)(e>>r&1)==1&&(t^=aa[r]);return t}function ca(n,e,t=1){const r=n.length;let o=1;for(let c=0;c<r;c++){const l=n.charCodeAt(c);if(l<33||l>126)throw new Error(`Invalid prefix (${n})`);o=Jn(o)^l>>5}o=Jn(o);for(let c=0;c<r;c++)o=Jn(o)^31&n.charCodeAt(c);for(let c of e)o=Jn(o)^c;for(let c=0;c<6;c++)o=Jn(o);return o^=t,eo.encode(Xi([o%2**30],30,5,!1))}function Fa(n){const e=n==="bech32"?1:734539939,t=an(5),r=t.decode,o=t.encode,c=sa(r);function l(h,d=90){if(typeof h!="string")throw new Error("bech32.decode input should be string, not "+typeof h);if(h.length<8||d!==!1&&h.length>d)throw new TypeError(`Wrong string length: ${h.length} (${h}). Expected (8..${d})`);const g=h.toLowerCase();if(h!==g&&h!==h.toUpperCase())throw new Error("String must be lowercase or uppercase");const w=(h=g).lastIndexOf("1");if(w===0||w===-1)throw new Error('Letter "1" must be present between prefix and data only');const m=h.slice(0,w),v=h.slice(w+1);if(v.length<6)throw new Error("Data must be at least 6 characters long");const L=eo.decode(v).slice(0,-6),C=ca(m,L,e);if(!v.endsWith(C))throw new Error(`Invalid checksum in ${h}: expected "${C}"`);return{prefix:m,words:L}}return{encode:function(h,d,g=90){if(typeof h!="string")throw new Error("bech32.encode prefix should be string, not "+typeof h);if(!Array.isArray(d)||d.length&&typeof d[0]!="number")throw new Error("bech32.encode words should be array of numbers, not "+typeof d);const w=h.length+7+d.length;if(g!==!1&&w>g)throw new TypeError(`Length ${w} exceeds limit ${g}`);return`${h=h.toLowerCase()}1${eo.encode(d)}${ca(h,d,e)}`},decode:l,decodeToBytes:function(h){const{prefix:d,words:g}=l(h,!1);return{prefix:d,words:g,bytes:r(g)}},decodeUnsafe:sa(l),fromWords:r,fromWordsUnsafe:c,toWords:o}}const Rn=Fa("bech32");Fa("bech32m");Pt(an(4),Ht("0123456789abcdef"),jt(""),Ha((n=>{if(typeof n!="string"||n.length%2)throw new TypeError(`hex.decode: expected string, got ${typeof n} with length ${n.length}`);return n.toLowerCase()})));function Di(n){if(!Number.isSafeInteger(n)||n<0)throw new Error(`positive integer expected, not ${n}`)}function la(n){if(typeof n!="boolean")throw new Error(`boolean expected, not ${n}`)}function qa(n){return n instanceof Uint8Array||n!=null&&typeof n=="object"&&n.constructor.name==="Uint8Array"}function Ne(n,...e){if(!qa(n))throw new Error("Uint8Array expected");if(e.length>0&&!e.includes(n.length))throw new Error(`Uint8Array expected of length ${e}, not of length=${n.length}`)}function zn(n,e=!0){if(n.destroyed)throw new Error("Hash instance has been destroyed");if(e&&n.finished)throw new Error("Hash#digest() has already been called")}function ho(n,e){Ne(n);const t=e.outputLen;if(n.length<t)throw new Error(`digestInto() expects output buffer of length at least ${t}`)}const fo=n=>new Uint8Array(n.buffer,n.byteOffset,n.byteLength),Ce=n=>new Uint32Array(n.buffer,n.byteOffset,Math.floor(n.byteLength/4)),Zr=n=>new DataView(n.buffer,n.byteOffset,n.byteLength);if(new Uint8Array(new Uint32Array([287454020]).buffer)[0]!==68)throw new Error("Non little-endian hardware is not supported");function ln(n){if(typeof n=="string")n=(function(e){if(typeof e!="string")throw new Error("string expected, got "+typeof e);return new Uint8Array(new TextEncoder().encode(e))})(n);else{if(!qa(n))throw new Error("Uint8Array expected, got "+typeof n);n=n.slice()}return n}function po(n,e){if(n.length!==e.length)return!1;let t=0;for(let r=0;r<n.length;r++)t|=n[r]^e[r];return t===0}const Hn=(n,e)=>(Object.assign(e,n),e);function to(n,e,t,r){if(typeof n.setBigUint64=="function")return n.setBigUint64(e,t,r);const o=BigInt(32),c=BigInt(4294967295),l=Number(t>>o&c),h=Number(t&c),d=r?4:0,g=r?0:4;n.setUint32(e+d,l,r),n.setUint32(e+g,h,r)}const zt=16,go=new Uint8Array(16),It=Ce(go),yt=n=>(n>>>0&255)<<24|(n>>>8&255)<<16|(n>>>16&255)<<8|n>>>24&255;class Za{constructor(e,t){this.blockLen=zt,this.outputLen=zt,this.s0=0,this.s1=0,this.s2=0,this.s3=0,this.finished=!1,Ne(e=ln(e),16);const r=Zr(e);let o=r.getUint32(0,!1),c=r.getUint32(4,!1),l=r.getUint32(8,!1),h=r.getUint32(12,!1);const d=[];for(let F=0;F<128;F++)d.push({s0:yt(o),s1:yt(c),s2:yt(l),s3:yt(h)}),{s0:o,s1:c,s2:l,s3:h}={s3:(m=l)<<31|(v=h)>>>1,s2:(w=c)<<31|m>>>1,s1:(g=o)<<31|w>>>1,s0:g>>>1^225<<24&-(1&v)};var g,w,m,v;const L=(F=>F>65536?8:F>1024?4:2)(t||1024);if(![1,2,4,8].includes(L))throw new Error(`ghash: wrong window size=${L}, should be 2, 4 or 8`);this.W=L;const C=128/L,S=this.windowSize=2**L,z=[];for(let F=0;F<C;F++)for(let H=0;H<S;H++){let ee=0,oe=0,W=0,K=0;for(let Q=0;Q<L;Q++){if(!(H>>>L-Q-1&1))continue;const{s0:G,s1:k,s2:$,s3:A}=d[L*F+Q];ee^=G,oe^=k,W^=$,K^=A}z.push({s0:ee,s1:oe,s2:W,s3:K})}this.t=z}_updateBlock(e,t,r,o){e^=this.s0,t^=this.s1,r^=this.s2,o^=this.s3;const{W:c,t:l,windowSize:h}=this;let d=0,g=0,w=0,m=0;const v=(1<<c)-1;let L=0;for(const C of[e,t,r,o])for(let S=0;S<4;S++){const z=C>>>8*S&255;for(let F=8/c-1;F>=0;F--){const H=z>>>c*F&v,{s0:ee,s1:oe,s2:W,s3:K}=l[L*h+H];d^=ee,g^=oe,w^=W,m^=K,L+=1}}this.s0=d,this.s1=g,this.s2=w,this.s3=m}update(e){e=ln(e),zn(this);const t=Ce(e),r=Math.floor(e.length/zt),o=e.length%zt;for(let c=0;c<r;c++)this._updateBlock(t[4*c+0],t[4*c+1],t[4*c+2],t[4*c+3]);return o&&(go.set(e.subarray(r*zt)),this._updateBlock(It[0],It[1],It[2],It[3]),It.fill(0)),this}destroy(){const{t:e}=this;for(const t of e)t.s0=0,t.s1=0,t.s2=0,t.s3=0}digestInto(e){zn(this),ho(e,this),this.finished=!0;const{s0:t,s1:r,s2:o,s3:c}=this,l=Ce(e);return l[0]=t,l[1]=r,l[2]=o,l[3]=c,e}digest(){const e=new Uint8Array(zt);return this.digestInto(e),this.destroy(),e}}class mf extends Za{constructor(e,t){const r=(function(o){o.reverse();const c=1&o[15];let l=0;for(let h=0;h<o.length;h++){const d=o[h];o[h]=d>>>1|l,l=(1&d)<<7}return o[0]^=225&-c,o})((e=ln(e)).slice());super(r,t),r.fill(0)}update(e){e=ln(e),zn(this);const t=Ce(e),r=e.length%zt,o=Math.floor(e.length/zt);for(let c=0;c<o;c++)this._updateBlock(yt(t[4*c+3]),yt(t[4*c+2]),yt(t[4*c+1]),yt(t[4*c+0]));return r&&(go.set(e.subarray(o*zt)),this._updateBlock(yt(It[3]),yt(It[2]),yt(It[1]),yt(It[0])),It.fill(0)),this}digestInto(e){zn(this),ho(e,this),this.finished=!0;const{s0:t,s1:r,s2:o,s3:c}=this,l=Ce(e);return l[0]=t,l[1]=r,l[2]=o,l[3]=c,e.reverse()}}function Va(n){const e=(r,o)=>n(o,r.length).update(ln(r)).digest(),t=n(new Uint8Array(16),0);return e.outputLen=t.outputLen,e.blockLen=t.blockLen,e.create=(r,o)=>n(r,o),e}const ua=Va(((n,e)=>new Za(n,e))),bf=Va(((n,e)=>new mf(n,e))),ht=16,Tr=new Uint8Array(ht);function yo(n){return n<<1^283&-(n>>7)}function Ln(n,e){let t=0;for(;e>0;e>>=1)t^=n&-(1&e),n=yo(n);return t}const no=(()=>{let n=new Uint8Array(256);for(let t=0,r=1;t<256;t++,r^=yo(r))n[t]=r;const e=new Uint8Array(256);e[0]=99;for(let t=0;t<255;t++){let r=n[255-t];r|=r<<8,e[n[t]]=255&(r^r>>4^r>>5^r>>6^r>>7^99)}return e})(),wf=no.map(((n,e)=>no.indexOf(e))),Pi=n=>n<<8|n>>>24;function Ga(n,e){if(n.length!==256)throw new Error("Wrong sbox length");const t=new Uint32Array(256).map(((g,w)=>e(n[w]))),r=t.map(Pi),o=r.map(Pi),c=o.map(Pi),l=new Uint32Array(65536),h=new Uint32Array(65536),d=new Uint16Array(65536);for(let g=0;g<256;g++)for(let w=0;w<256;w++){const m=256*g+w;l[m]=t[g]^r[w],h[m]=o[g]^c[w],d[m]=n[g]<<8|n[w]}return{sbox:n,sbox2:d,T0:t,T1:r,T2:o,T3:c,T01:l,T23:h}}const mo=Ga(no,(n=>Ln(n,3)<<24|n<<16|n<<8|Ln(n,2))),Ka=Ga(wf,(n=>Ln(n,11)<<24|Ln(n,13)<<16|Ln(n,9)<<8|Ln(n,14))),vf=(()=>{const n=new Uint8Array(16);for(let e=0,t=1;e<16;e++,t=yo(t))n[e]=t;return n})();function un(n){Ne(n);const e=n.length;if(![16,24,32].includes(e))throw new Error(`aes: wrong key size: should be 16, 24 or 32, got: ${e}`);const{sbox2:t}=mo,r=Ce(n),o=r.length,c=d=>Lt(t,d,d,d,d),l=new Uint32Array(e+28);l.set(r);for(let d=o;d<l.length;d++){let g=l[d-1];d%o==0?g=c((h=g)<<24|h>>>8)^vf[d/o-1]:o>6&&d%o==4&&(g=c(g)),l[d]=l[d-o]^g}var h;return l}function Wa(n){const e=un(n),t=e.slice(),r=e.length,{sbox2:o}=mo,{T0:c,T1:l,T2:h,T3:d}=Ka;for(let g=0;g<r;g+=4)for(let w=0;w<4;w++)t[g+w]=e[r-g-4+w];e.fill(0);for(let g=4;g<r-4;g++){const w=t[g],m=Lt(o,w,w,w,w);t[g]=c[255&m]^l[m>>>8&255]^h[m>>>16&255]^d[m>>>24]}return t}function on(n,e,t,r,o,c){return n[t<<8&65280|r>>>8&255]^e[o>>>8&65280|c>>>24&255]}function Lt(n,e,t,r,o){return n[255&e|65280&t]|n[r>>>16&255|o>>>16&65280]<<16}function mt(n,e,t,r,o){const{sbox2:c,T01:l,T23:h}=mo;let d=0;e^=n[d++],t^=n[d++],r^=n[d++],o^=n[d++];const g=n.length/4-2;for(let w=0;w<g;w++){const m=n[d++]^on(l,h,e,t,r,o),v=n[d++]^on(l,h,t,r,o,e),L=n[d++]^on(l,h,r,o,e,t),C=n[d++]^on(l,h,o,e,t,r);e=m,t=v,r=L,o=C}return{s0:n[d++]^Lt(c,e,t,r,o),s1:n[d++]^Lt(c,t,r,o,e),s2:n[d++]^Lt(c,r,o,e,t),s3:n[d++]^Lt(c,o,e,t,r)}}function Qa(n,e,t,r,o){const{sbox2:c,T01:l,T23:h}=Ka;let d=0;e^=n[d++],t^=n[d++],r^=n[d++],o^=n[d++];const g=n.length/4-2;for(let w=0;w<g;w++){const m=n[d++]^on(l,h,e,o,r,t),v=n[d++]^on(l,h,t,e,o,r),L=n[d++]^on(l,h,r,t,e,o),C=n[d++]^on(l,h,o,r,t,e);e=m,t=v,r=L,o=C}return{s0:n[d++]^Lt(c,e,o,r,t),s1:n[d++]^Lt(c,t,e,o,r),s2:n[d++]^Lt(c,r,t,e,o),s3:n[d++]^Lt(c,o,r,t,e)}}function jn(n,e){if(!e)return new Uint8Array(n);if(Ne(e),e.length<n)throw new Error(`aes: wrong destination length, expected at least ${n}, got: ${e.length}`);return e}function Ef(n,e,t,r){Ne(e,ht),Ne(t);const o=t.length;r=jn(o,r);const c=e,l=Ce(c);let{s0:h,s1:d,s2:g,s3:w}=mt(n,l[0],l[1],l[2],l[3]);const m=Ce(t),v=Ce(r);for(let C=0;C+4<=m.length;C+=4){v[C+0]=m[C+0]^h,v[C+1]=m[C+1]^d,v[C+2]=m[C+2]^g,v[C+3]=m[C+3]^w;let S=1;for(let z=c.length-1;z>=0;z--)S=S+(255&c[z])|0,c[z]=255&S,S>>>=8;({s0:h,s1:d,s2:g,s3:w}=mt(n,l[0],l[1],l[2],l[3]))}const L=ht*Math.floor(m.length/4);if(L<o){const C=new Uint32Array([h,d,g,w]),S=fo(C);for(let z=L,F=0;z<o;z++,F++)r[z]=t[z]^S[F]}return r}function er(n,e,t,r,o){Ne(t,ht),Ne(r),o=jn(r.length,o);const c=t,l=Ce(c),h=Zr(c),d=Ce(r),g=Ce(o),w=e?0:12,m=r.length;let v=h.getUint32(w,e),{s0:L,s1:C,s2:S,s3:z}=mt(n,l[0],l[1],l[2],l[3]);for(let H=0;H+4<=d.length;H+=4)g[H+0]=d[H+0]^L,g[H+1]=d[H+1]^C,g[H+2]=d[H+2]^S,g[H+3]=d[H+3]^z,v=v+1>>>0,h.setUint32(w,v,e),{s0:L,s1:C,s2:S,s3:z}=mt(n,l[0],l[1],l[2],l[3]);const F=ht*Math.floor(d.length/4);if(F<m){const H=new Uint32Array([L,C,S,z]),ee=fo(H);for(let oe=F,W=0;oe<m;oe++,W++)o[oe]=r[oe]^ee[W]}return o}Hn({blockSize:16,nonceLength:16},(function(n,e){function t(r,o){const c=un(n),l=e.slice(),h=Ef(c,l,r,o);return c.fill(0),l.fill(0),h}return Ne(n),Ne(e,ht),{encrypt:(r,o)=>t(r,o),decrypt:(r,o)=>t(r,o)}}));function Ya(n){if(Ne(n),n.length%ht!=0)throw new Error("aes/(cbc-ecb).decrypt ciphertext should consist of blocks with size 16")}function Xa(n,e,t){let r=n.length;const o=r%ht;if(!e&&o!==0)throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");const c=Ce(n);if(e){let h=ht-o;h||(h=ht),r+=h}const l=jn(r,t);return{b:c,o:Ce(l),out:l}}function Ja(n,e){if(!e)return n;const t=n.length;if(!t)throw new Error("aes/pcks5: empty ciphertext not allowed");const r=n[t-1];if(r<=0||r>16)throw new Error(`aes/pcks5: wrong padding byte: ${r}`);const o=n.subarray(0,-r);for(let c=0;c<r;c++)if(n[t-c-1]!==r)throw new Error("aes/pcks5: wrong padding");return o}function ec(n){const e=new Uint8Array(16),t=Ce(e);e.set(n);const r=ht-n.length;for(let o=ht-r;o<ht;o++)e[o]=r;return t}Hn({blockSize:16},(function(n,e={}){Ne(n);const t=!e.disablePadding;return{encrypt:(r,o)=>{Ne(r);const{b:c,o:l,out:h}=Xa(r,t,o),d=un(n);let g=0;for(;g+4<=c.length;){const{s0:w,s1:m,s2:v,s3:L}=mt(d,c[g+0],c[g+1],c[g+2],c[g+3]);l[g++]=w,l[g++]=m,l[g++]=v,l[g++]=L}if(t){const w=ec(r.subarray(4*g)),{s0:m,s1:v,s2:L,s3:C}=mt(d,w[0],w[1],w[2],w[3]);l[g++]=m,l[g++]=v,l[g++]=L,l[g++]=C}return d.fill(0),h},decrypt:(r,o)=>{Ya(r);const c=Wa(n),l=jn(r.length,o),h=Ce(r),d=Ce(l);for(let g=0;g+4<=h.length;){const{s0:w,s1:m,s2:v,s3:L}=Qa(c,h[g+0],h[g+1],h[g+2],h[g+3]);d[g++]=w,d[g++]=m,d[g++]=v,d[g++]=L}return c.fill(0),Ja(l,t)}}}));const tc=Hn({blockSize:16,nonceLength:16},(function(n,e,t={}){Ne(n),Ne(e,16);const r=!t.disablePadding;return{encrypt:(o,c)=>{const l=un(n),{b:h,o:d,out:g}=Xa(o,r,c),w=Ce(e);let m=w[0],v=w[1],L=w[2],C=w[3],S=0;for(;S+4<=h.length;)m^=h[S+0],v^=h[S+1],L^=h[S+2],C^=h[S+3],{s0:m,s1:v,s2:L,s3:C}=mt(l,m,v,L,C),d[S++]=m,d[S++]=v,d[S++]=L,d[S++]=C;if(r){const z=ec(o.subarray(4*S));m^=z[0],v^=z[1],L^=z[2],C^=z[3],{s0:m,s1:v,s2:L,s3:C}=mt(l,m,v,L,C),d[S++]=m,d[S++]=v,d[S++]=L,d[S++]=C}return l.fill(0),g},decrypt:(o,c)=>{Ya(o);const l=Wa(n),h=Ce(e),d=jn(o.length,c),g=Ce(o),w=Ce(d);let m=h[0],v=h[1],L=h[2],C=h[3];for(let S=0;S+4<=g.length;){const z=m,F=v,H=L,ee=C;m=g[S+0],v=g[S+1],L=g[S+2],C=g[S+3];const{s0:oe,s1:W,s2:K,s3:Q}=Qa(l,m,v,L,C);w[S++]=oe^z,w[S++]=W^F,w[S++]=K^H,w[S++]=Q^ee}return l.fill(0),Ja(d,r)}}}));Hn({blockSize:16,nonceLength:16},(function(n,e){function t(r,o,c){const l=un(n),h=r.length;c=jn(h,c);const d=Ce(r),g=Ce(c),w=o?g:d,m=Ce(e);let v=m[0],L=m[1],C=m[2],S=m[3];for(let F=0;F+4<=d.length;){const{s0:H,s1:ee,s2:oe,s3:W}=mt(l,v,L,C,S);g[F+0]=d[F+0]^H,g[F+1]=d[F+1]^ee,g[F+2]=d[F+2]^oe,g[F+3]=d[F+3]^W,v=w[F++],L=w[F++],C=w[F++],S=w[F++]}const z=ht*Math.floor(d.length/4);if(z<h){({s0:v,s1:L,s2:C,s3:S}=mt(l,v,L,C,S));const F=fo(new Uint32Array([v,L,C,S]));for(let H=z,ee=0;H<h;H++,ee++)c[H]=r[H]^F[ee];F.fill(0)}return l.fill(0),c}return Ne(n),Ne(e,16),{encrypt:(r,o)=>t(r,!0,o),decrypt:(r,o)=>t(r,!1,o)}}));function nc(n,e,t,r,o){const c=n.create(t,r.length+(o?.length||0));o&&c.update(o),c.update(r);const l=new Uint8Array(16),h=Zr(l);return o&&to(h,0,BigInt(8*o.length),e),to(h,8,BigInt(8*r.length),e),c.update(l),c.digest()}Hn({blockSize:16,nonceLength:12,tagLength:16},(function(n,e,t){if(Ne(e),e.length===0)throw new Error("aes/gcm: empty nonce");const r=16;function o(l,h,d){const g=nc(ua,!1,l,d,t);for(let w=0;w<h.length;w++)g[w]^=h[w];return g}function c(){const l=un(n),h=Tr.slice(),d=Tr.slice();if(er(l,!1,d,d,h),e.length===12)d.set(e);else{const g=Tr.slice();to(Zr(g),8,BigInt(8*e.length),!1),ua.create(h).update(e).update(g).digestInto(d)}return{xk:l,authKey:h,counter:d,tagMask:er(l,!1,d,Tr)}}return{encrypt:l=>{Ne(l);const{xk:h,authKey:d,counter:g,tagMask:w}=c(),m=new Uint8Array(l.length+r);er(h,!1,g,l,m);const v=o(d,w,m.subarray(0,m.length-r));return m.set(v,l.length),h.fill(0),m},decrypt:l=>{if(Ne(l),l.length<r)throw new Error("aes/gcm: ciphertext less than tagLen (16)");const{xk:h,authKey:d,counter:g,tagMask:w}=c(),m=l.subarray(0,-16),v=l.subarray(-16);if(!po(o(d,w,m),v))throw new Error("aes/gcm: invalid ghash tag");const L=er(h,!1,g,m);return d.fill(0),w.fill(0),h.fill(0),L}}}));const Lr=(n,e,t)=>r=>{if(!Number.isSafeInteger(r)||e>r||r>t)throw new Error(`${n}: invalid value=${r}, must be [${e}..${t}]`)};Hn({blockSize:16,nonceLength:12,tagLength:16},(function(n,e,t){const r=Lr("AAD",0,68719476736),o=Lr("plaintext",0,2**36),c=Lr("nonce",12,12),l=Lr("ciphertext",16,2**36+16);function h(){const w=n.length;if(w!==16&&w!==24&&w!==32)throw new Error(`key length must be 16, 24 or 32 bytes, got: ${w} bytes`);const m=un(n),v=new Uint8Array(w),L=new Uint8Array(16),C=Ce(e);let S=0,z=C[0],F=C[1],H=C[2],ee=0;for(const oe of[L,v].map(Ce)){const W=Ce(oe);for(let K=0;K<W.length;K+=2){const{s0:Q,s1:G}=mt(m,S,z,F,H);W[K+0]=Q,W[K+1]=G,S=++ee}}return m.fill(0),{authKey:L,encKey:un(v)}}function d(w,m,v){const L=nc(bf,!0,m,v,t);for(let ee=0;ee<12;ee++)L[ee]^=e[ee];L[15]&=127;const C=Ce(L);let S=C[0],z=C[1],F=C[2],H=C[3];return{s0:S,s1:z,s2:F,s3:H}=mt(w,S,z,F,H),C[0]=S,C[1]=z,C[2]=F,C[3]=H,L}function g(w,m,v){let L=m.slice();return L[15]|=128,er(w,!0,L,v)}return Ne(e),c(e.length),t&&(Ne(t),r(t.length)),{encrypt:w=>{Ne(w),o(w.length);const{encKey:m,authKey:v}=h(),L=d(m,v,w),C=new Uint8Array(w.length+16);return C.set(L,w.length),C.set(g(m,L,w)),m.fill(0),v.fill(0),C},decrypt:w=>{Ne(w),l(w.length);const m=w.subarray(-16),{encKey:v,authKey:L}=h(),C=g(v,m,w.subarray(0,-16)),S=d(v,L,C);if(v.fill(0),L.fill(0),!po(m,S))throw new Error("invalid polyval tag");return C}}}));const Ge=(n,e)=>255&n[e++]|(255&n[e++])<<8;class xf{constructor(e){this.blockLen=16,this.outputLen=16,this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.pos=0,this.finished=!1,Ne(e=ln(e),32);const t=Ge(e,0),r=Ge(e,2),o=Ge(e,4),c=Ge(e,6),l=Ge(e,8),h=Ge(e,10),d=Ge(e,12),g=Ge(e,14);this.r[0]=8191&t,this.r[1]=8191&(t>>>13|r<<3),this.r[2]=7939&(r>>>10|o<<6),this.r[3]=8191&(o>>>7|c<<9),this.r[4]=255&(c>>>4|l<<12),this.r[5]=l>>>1&8190,this.r[6]=8191&(l>>>14|h<<2),this.r[7]=8065&(h>>>11|d<<5),this.r[8]=8191&(d>>>8|g<<8),this.r[9]=g>>>5&127;for(let w=0;w<8;w++)this.pad[w]=Ge(e,16+2*w)}process(e,t,r=!1){const o=r?0:2048,{h:c,r:l}=this,h=l[0],d=l[1],g=l[2],w=l[3],m=l[4],v=l[5],L=l[6],C=l[7],S=l[8],z=l[9],F=Ge(e,t+0),H=Ge(e,t+2),ee=Ge(e,t+4),oe=Ge(e,t+6),W=Ge(e,t+8),K=Ge(e,t+10),Q=Ge(e,t+12),G=Ge(e,t+14);let k=c[0]+(8191&F),$=c[1]+(8191&(F>>>13|H<<3)),A=c[2]+(8191&(H>>>10|ee<<6)),V=c[3]+(8191&(ee>>>7|oe<<9)),Z=c[4]+(8191&(oe>>>4|W<<12)),X=c[5]+(W>>>1&8191),Y=c[6]+(8191&(W>>>14|K<<2)),re=c[7]+(8191&(K>>>11|Q<<5)),pe=c[8]+(8191&(Q>>>8|G<<8)),ye=c[9]+(G>>>5|o),le=0,$e=le+k*h+$*(5*z)+A*(5*S)+V*(5*C)+Z*(5*L);le=$e>>>13,$e&=8191,$e+=X*(5*v)+Y*(5*m)+re*(5*w)+pe*(5*g)+ye*(5*d),le+=$e>>>13,$e&=8191;let ve=le+k*d+$*h+A*(5*z)+V*(5*S)+Z*(5*C);le=ve>>>13,ve&=8191,ve+=X*(5*L)+Y*(5*v)+re*(5*m)+pe*(5*w)+ye*(5*g),le+=ve>>>13,ve&=8191;let _e=le+k*g+$*d+A*h+V*(5*z)+Z*(5*S);le=_e>>>13,_e&=8191,_e+=X*(5*C)+Y*(5*L)+re*(5*v)+pe*(5*m)+ye*(5*w),le+=_e>>>13,_e&=8191;let Be=le+k*w+$*g+A*d+V*h+Z*(5*z);le=Be>>>13,Be&=8191,Be+=X*(5*S)+Y*(5*C)+re*(5*L)+pe*(5*v)+ye*(5*m),le+=Be>>>13,Be&=8191;let Re=le+k*m+$*w+A*g+V*d+Z*h;le=Re>>>13,Re&=8191,Re+=X*(5*z)+Y*(5*S)+re*(5*C)+pe*(5*L)+ye*(5*v),le+=Re>>>13,Re&=8191;let ke=le+k*v+$*m+A*w+V*g+Z*d;le=ke>>>13,ke&=8191,ke+=X*h+Y*(5*z)+re*(5*S)+pe*(5*C)+ye*(5*L),le+=ke>>>13,ke&=8191;let Oe=le+k*L+$*v+A*m+V*w+Z*g;le=Oe>>>13,Oe&=8191,Oe+=X*d+Y*h+re*(5*z)+pe*(5*S)+ye*(5*C),le+=Oe>>>13,Oe&=8191;let We=le+k*C+$*L+A*v+V*m+Z*w;le=We>>>13,We&=8191,We+=X*g+Y*d+re*h+pe*(5*z)+ye*(5*S),le+=We>>>13,We&=8191;let ae=le+k*S+$*C+A*L+V*v+Z*m;le=ae>>>13,ae&=8191,ae+=X*w+Y*g+re*d+pe*h+ye*(5*z),le+=ae>>>13,ae&=8191;let ze=le+k*z+$*S+A*C+V*L+Z*v;le=ze>>>13,ze&=8191,ze+=X*m+Y*w+re*g+pe*d+ye*h,le+=ze>>>13,ze&=8191,le=(le<<2)+le|0,le=le+$e|0,$e=8191&le,le>>>=13,ve+=le,c[0]=$e,c[1]=ve,c[2]=_e,c[3]=Be,c[4]=Re,c[5]=ke,c[6]=Oe,c[7]=We,c[8]=ae,c[9]=ze}finalize(){const{h:e,pad:t}=this,r=new Uint16Array(10);let o=e[1]>>>13;e[1]&=8191;for(let h=2;h<10;h++)e[h]+=o,o=e[h]>>>13,e[h]&=8191;e[0]+=5*o,o=e[0]>>>13,e[0]&=8191,e[1]+=o,o=e[1]>>>13,e[1]&=8191,e[2]+=o,r[0]=e[0]+5,o=r[0]>>>13,r[0]&=8191;for(let h=1;h<10;h++)r[h]=e[h]+o,o=r[h]>>>13,r[h]&=8191;r[9]-=8192;let c=(1^o)-1;for(let h=0;h<10;h++)r[h]&=c;c=~c;for(let h=0;h<10;h++)e[h]=e[h]&c|r[h];e[0]=65535&(e[0]|e[1]<<13),e[1]=65535&(e[1]>>>3|e[2]<<10),e[2]=65535&(e[2]>>>6|e[3]<<7),e[3]=65535&(e[3]>>>9|e[4]<<4),e[4]=65535&(e[4]>>>12|e[5]<<1|e[6]<<14),e[5]=65535&(e[6]>>>2|e[7]<<11),e[6]=65535&(e[7]>>>5|e[8]<<8),e[7]=65535&(e[8]>>>8|e[9]<<5);let l=e[0]+t[0];e[0]=65535&l;for(let h=1;h<8;h++)l=(e[h]+t[h]|0)+(l>>>16)|0,e[h]=65535&l}update(e){zn(this);const{buffer:t,blockLen:r}=this,o=(e=ln(e)).length;for(let c=0;c<o;){const l=Math.min(r-this.pos,o-c);if(l!==r)t.set(e.subarray(c,c+l),this.pos),this.pos+=l,c+=l,this.pos===r&&(this.process(t,0,!1),this.pos=0);else for(;r<=o-c;c+=r)this.process(e,c)}return this}destroy(){this.h.fill(0),this.r.fill(0),this.buffer.fill(0),this.pad.fill(0)}digestInto(e){zn(this),ho(e,this),this.finished=!0;const{buffer:t,h:r}=this;let{pos:o}=this;if(o){for(t[o++]=1;o<16;o++)t[o]=0;this.process(t,0,!0)}this.finalize();let c=0;for(let l=0;l<8;l++)e[c++]=r[l]>>>0,e[c++]=r[l]>>>8;return e}digest(){const{buffer:e,outputLen:t}=this;this.digestInto(e);const r=e.slice(0,t);return this.destroy(),r}}(function(n){const e=(r,o)=>n(o).update(ln(r)).digest(),t=n(new Uint8Array(32));return e.outputLen=t.outputLen,e.blockLen=t.blockLen,e.create=r=>n(r),e})((n=>new xf(n)));const rc=n=>Uint8Array.from(n.split("").map((e=>e.charCodeAt(0)))),$f=rc("expand 16-byte k"),Af=rc("expand 32-byte k"),_f=Ce($f),ic=Ce(Af);ic.slice();function me(n,e){return n<<e|n>>>32-e}function Hi(n){return n.byteOffset%4==0}const ha=2**32-1,da=new Uint32Array;function oc(n,e){const{allowShortKeys:t,extendNonceFn:r,counterLength:o,counterRight:c,rounds:l}=(function(h,d){if(d==null||typeof d!="object")throw new Error("options must be defined");return Object.assign(h,d)})({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},e);if(typeof n!="function")throw new Error("core must be a function");return Di(o),Di(l),la(c),la(t),(h,d,g,w,m=0)=>{Ne(h),Ne(d),Ne(g);const v=g.length;if(w||(w=new Uint8Array(v)),Ne(w),Di(m),m<0||m>=ha)throw new Error("arx: counter overflow");if(w.length<v)throw new Error(`arx: output (${w.length}) is shorter than data (${v})`);const L=[];let C,S,z=h.length;if(z===32)C=h.slice(),L.push(C),S=ic;else{if(z!==16||!t)throw new Error(`arx: invalid 32-byte key, got length=${z}`);C=new Uint8Array(32),C.set(h),C.set(h,16),S=_f,L.push(C)}Hi(d)||(d=d.slice(),L.push(d));const F=Ce(C);if(r){if(d.length!==24)throw new Error("arx: extended nonce must be 24 bytes");r(S,F,Ce(d.subarray(0,16)),F),d=d.subarray(16)}const H=16-o;if(H!==d.length)throw new Error(`arx: nonce must be ${H} or 16 bytes`);if(H!==12){const oe=new Uint8Array(12);oe.set(d,c?0:12-d.length),d=oe,L.push(d)}const ee=Ce(d);for(!(function(oe,W,K,Q,G,k,$,A){const V=G.length,Z=new Uint8Array(64),X=Ce(Z),Y=Hi(G)&&Hi(k),re=Y?Ce(G):da,pe=Y?Ce(k):da;for(let ye=0;ye<V;$++){if(oe(W,K,Q,X,$,A),$>=ha)throw new Error("arx: counter overflow");const le=Math.min(64,V-ye);if(Y&&le===64){const $e=ye/4;if(ye%4!=0)throw new Error("arx: invalid block position");for(let ve,_e=0;_e<16;_e++)ve=$e+_e,pe[ve]=re[ve]^X[_e];ye+=64}else{for(let $e,ve=0;ve<le;ve++)$e=ye+ve,k[$e]=G[$e]^Z[ve];ye+=le}}})(n,S,F,ee,g,w,m,l);L.length>0;)L.pop().fill(0);return w}}function sc(n,e,t,r,o,c=20){let l=n[0],h=n[1],d=n[2],g=n[3],w=e[0],m=e[1],v=e[2],L=e[3],C=e[4],S=e[5],z=e[6],F=e[7],H=o,ee=t[0],oe=t[1],W=t[2],K=l,Q=h,G=d,k=g,$=w,A=m,V=v,Z=L,X=C,Y=S,re=z,pe=F,ye=H,le=ee,$e=oe,ve=W;for(let Be=0;Be<c;Be+=2)K=K+$|0,ye=me(ye^K,16),X=X+ye|0,$=me($^X,12),K=K+$|0,ye=me(ye^K,8),X=X+ye|0,$=me($^X,7),Q=Q+A|0,le=me(le^Q,16),Y=Y+le|0,A=me(A^Y,12),Q=Q+A|0,le=me(le^Q,8),Y=Y+le|0,A=me(A^Y,7),G=G+V|0,$e=me($e^G,16),re=re+$e|0,V=me(V^re,12),G=G+V|0,$e=me($e^G,8),re=re+$e|0,V=me(V^re,7),k=k+Z|0,ve=me(ve^k,16),pe=pe+ve|0,Z=me(Z^pe,12),k=k+Z|0,ve=me(ve^k,8),pe=pe+ve|0,Z=me(Z^pe,7),K=K+A|0,ve=me(ve^K,16),re=re+ve|0,A=me(A^re,12),K=K+A|0,ve=me(ve^K,8),re=re+ve|0,A=me(A^re,7),Q=Q+V|0,ye=me(ye^Q,16),pe=pe+ye|0,V=me(V^pe,12),Q=Q+V|0,ye=me(ye^Q,8),pe=pe+ye|0,V=me(V^pe,7),G=G+Z|0,le=me(le^G,16),X=X+le|0,Z=me(Z^X,12),G=G+Z|0,le=me(le^G,8),X=X+le|0,Z=me(Z^X,7),k=k+$|0,$e=me($e^k,16),Y=Y+$e|0,$=me($^Y,12),k=k+$|0,$e=me($e^k,8),Y=Y+$e|0,$=me($^Y,7);let _e=0;r[_e++]=l+K|0,r[_e++]=h+Q|0,r[_e++]=d+G|0,r[_e++]=g+k|0,r[_e++]=w+$|0,r[_e++]=m+A|0,r[_e++]=v+V|0,r[_e++]=L+Z|0,r[_e++]=C+X|0,r[_e++]=S+Y|0,r[_e++]=z+re|0,r[_e++]=F+pe|0,r[_e++]=H+ye|0,r[_e++]=ee+le|0,r[_e++]=oe+$e|0,r[_e++]=W+ve|0}const ac=oc(sc,{counterRight:!1,counterLength:4,allowShortKeys:!1});oc(sc,{counterRight:!1,counterLength:8,extendNonceFn:function(n,e,t,r){let o=n[0],c=n[1],l=n[2],h=n[3],d=e[0],g=e[1],w=e[2],m=e[3],v=e[4],L=e[5],C=e[6],S=e[7],z=t[0],F=t[1],H=t[2],ee=t[3];for(let W=0;W<20;W+=2)o=o+d|0,z=me(z^o,16),v=v+z|0,d=me(d^v,12),o=o+d|0,z=me(z^o,8),v=v+z|0,d=me(d^v,7),c=c+g|0,F=me(F^c,16),L=L+F|0,g=me(g^L,12),c=c+g|0,F=me(F^c,8),L=L+F|0,g=me(g^L,7),l=l+w|0,H=me(H^l,16),C=C+H|0,w=me(w^C,12),l=l+w|0,H=me(H^l,8),C=C+H|0,w=me(w^C,7),h=h+m|0,ee=me(ee^h,16),S=S+ee|0,m=me(m^S,12),h=h+m|0,ee=me(ee^h,8),S=S+ee|0,m=me(m^S,7),o=o+g|0,ee=me(ee^o,16),C=C+ee|0,g=me(g^C,12),o=o+g|0,ee=me(ee^o,8),C=C+ee|0,g=me(g^C,7),c=c+w|0,z=me(z^c,16),S=S+z|0,w=me(w^S,12),c=c+w|0,z=me(z^c,8),S=S+z|0,w=me(w^S,7),l=l+m|0,F=me(F^l,16),v=v+F|0,m=me(m^v,12),l=l+m|0,F=me(F^l,8),v=v+F|0,m=me(m^v,7),h=h+d|0,H=me(H^h,16),L=L+H|0,d=me(d^L,12),h=h+d|0,H=me(H^h,8),L=L+H|0,d=me(d^L,7);let oe=0;r[oe++]=o,r[oe++]=c,r[oe++]=l,r[oe++]=h,r[oe++]=z,r[oe++]=F,r[oe++]=H,r[oe++]=ee},allowShortKeys:!1});class cc extends za{constructor(e,t){super(),this.finished=!1,this.destroyed=!1,Tt.hash(e);const r=cr(t);if(this.iHash=e.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const o=this.blockLen,c=new Uint8Array(o);c.set(r.length>o?e.create().update(r).digest():r);for(let l=0;l<c.length;l++)c[l]^=54;this.iHash.update(c),this.oHash=e.create();for(let l=0;l<c.length;l++)c[l]^=106;this.oHash.update(c),c.fill(0)}update(e){return Tt.exists(this),this.iHash.update(e),this}digestInto(e){Tt.exists(this),Tt.bytes(e,this.outputLen),this.finished=!0,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy()}digest(){const e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||(e=Object.create(Object.getPrototypeOf(this),{}));const{oHash:t,iHash:r,finished:o,destroyed:c,blockLen:l,outputLen:h}=this;return e.finished=o,e.destroyed=c,e.blockLen=l,e.outputLen=h,e.oHash=t._cloneInto(e.oHash),e.iHash=r._cloneInto(e.iHash),e}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}}const Vr=(n,e,t)=>new cc(n,e).update(t).digest();function kf(n,e,t){return Tt.hash(n),Vr(n,cr(t),cr(e))}Vr.create=(n,e)=>new cc(n,e);const ji=new Uint8Array([0]),fa=new Uint8Array;function Sf(n,e,t,r=32){if(Tt.hash(n),Tt.number(r),r>255*n.outputLen)throw new Error("Length should be <= 255*HashLen");const o=Math.ceil(r/n.outputLen);t===void 0&&(t=fa);const c=new Uint8Array(o*n.outputLen),l=Vr.create(n,e),h=l._cloneInto(),d=new Uint8Array(l.outputLen);for(let g=0;g<o;g++)ji[0]=g+1,h.update(g===0?fa:d).update(t).update(ji).digestInto(d),c.set(d,n.outputLen*g),l._cloneInto(h);return l.destroy(),h.destroy(),d.fill(0),ji.fill(0),c.slice(0,r)}var If=Object.defineProperty,De=(n,e)=>{for(var t in e)If(n,t,{get:e[t],enumerable:!0})},rn=Symbol("verified"),Cf=n=>n instanceof Object;function Gr(n){if(!Cf(n)||typeof n.kind!="number"||typeof n.content!="string"||typeof n.created_at!="number"||typeof n.pubkey!="string"||!n.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(n.tags))return!1;for(let e=0;e<n.tags.length;e++){let t=n.tags[e];if(!Array.isArray(t))return!1;for(let r=0;r<t.length;r++)if(typeof t[r]=="object")return!1}return!0}function Tf(n){return n.sort(((e,t)=>e.created_at!==t.created_at?t.created_at-e.created_at:e.id.localeCompare(t.id)))}var lc={};De(lc,{Queue:()=>hc,QueueNode:()=>uc,binarySearch:()=>bo,insertEventIntoAscendingList:()=>Of,insertEventIntoDescendingList:()=>Lf,normalizeURL:()=>On,utf8Decoder:()=>Dt,utf8Encoder:()=>vt});var Dt=new TextDecoder("utf-8"),vt=new TextEncoder;function On(n){n.indexOf("://")===-1&&(n="wss://"+n);let e=new URL(n);return e.pathname=e.pathname.replace(/\/+/g,"/"),e.pathname.endsWith("/")&&(e.pathname=e.pathname.slice(0,-1)),(e.port==="80"&&e.protocol==="ws:"||e.port==="443"&&e.protocol==="wss:")&&(e.port=""),e.searchParams.sort(),e.hash="",e.toString()}function Lf(n,e){const[t,r]=bo(n,(o=>e.id===o.id?0:e.created_at===o.created_at?-1:o.created_at-e.created_at));return r||n.splice(t,0,e),n}function Of(n,e){const[t,r]=bo(n,(o=>e.id===o.id?0:e.created_at===o.created_at?-1:e.created_at-o.created_at));return r||n.splice(t,0,e),n}function bo(n,e){let t=0,r=n.length-1;for(;t<=r;){const o=Math.floor((t+r)/2),c=e(n[o]);if(c===0)return[o,!0];c<0?r=o-1:t=o+1}return[t,!1]}var uc=class{value;next=null;prev=null;constructor(n){this.value=n}},hc=class{first;last;constructor(){this.first=null,this.last=null}enqueue(n){const e=new uc(n);return this.last?this.last===this.first?(this.last=e,this.last.prev=this.first,this.first.next=e):(e.prev=this.last,this.last.next=e,this.last=e):(this.first=e,this.last=e),!0}dequeue(){if(!this.first)return null;if(this.first===this.last){const e=this.first;return this.first=null,this.last=null,e.value}const n=this.first;return this.first=n.next,n.value}};function dc(n){if(!Gr(n))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,n.pubkey,n.created_at,n.kind,n.tags,n.content])}function nr(n){return Fe(xn(vt.encode(dc(n))))}var Kr=new class{generateSecretKey(){return St.utils.randomPrivateKey()}getPublicKey(n){return Fe(St.getPublicKey(n))}finalizeEvent(n,e){const t=n;return t.pubkey=Fe(St.getPublicKey(e)),t.id=nr(t),t.sig=Fe(St.sign(nr(t),e)),t[rn]=!0,t}verifyEvent(n){if(typeof n[rn]=="boolean")return n[rn];const e=nr(n);if(e!==n.id)return n[rn]=!1,!1;try{const t=St.verify(n.sig,e,n.pubkey);return n[rn]=t,t}catch{return n[rn]=!1,!1}}},fc=Kr.generateSecretKey,wo=Kr.getPublicKey,Et=Kr.finalizeEvent,Fn=Kr.verifyEvent,pc={};function gc(n){return 1e3<=n&&n<1e4||[1,2,4,5,6,7,8,16,40,41,42,43,44].includes(n)}function vo(n){return[0,3].includes(n)||1e4<=n&&n<2e4}function yc(n){return 2e4<=n&&n<3e4}function Eo(n){return 3e4<=n&&n<4e4}function Mf(n){return gc(n)?"regular":vo(n)?"replaceable":yc(n)?"ephemeral":Eo(n)?"parameterized":"unknown"}function Nf(n,e){const t=e instanceof Array?e:[e];return Gr(n)&&t.includes(n.kind)||!1}De(pc,{Application:()=>Np,BadgeAward:()=>Hf,BadgeDefinition:()=>Sp,BlockedRelaysList:()=>hp,BookmarkList:()=>cp,Bookmarksets:()=>Ap,Calendar:()=>Hp,CalendarEventRSVP:()=>jp,ChannelCreation:()=>bc,ChannelHideMessage:()=>Ec,ChannelMessage:()=>vc,ChannelMetadata:()=>wc,ChannelMuteUser:()=>xc,ClassifiedListing:()=>zp,ClientAuth:()=>Ac,CommunitiesList:()=>lp,CommunityDefinition:()=>Zp,CommunityPostApproval:()=>Yf,Contacts:()=>Uf,CreateOrUpdateProduct:()=>Tp,CreateOrUpdateStall:()=>Cp,Curationsets:()=>_p,Date:()=>Dp,DirectMessageRelaysList:()=>gp,DraftClassifiedListing:()=>Up,DraftLong:()=>Op,Emojisets:()=>Mp,EncryptedDirectMessage:()=>Df,EventDeletion:()=>Pf,FileMetadata:()=>Zf,FileServerPreference:()=>yp,Followsets:()=>Ep,GenericRepost:()=>Ff,Genericlists:()=>xp,GiftWrap:()=>$c,HTTPAuth:()=>Ao,Handlerinformation:()=>qp,Handlerrecommendation:()=>Fp,Highlights:()=>ip,InterestsList:()=>fp,Interestsets:()=>Ip,JobFeedback:()=>ep,JobRequest:()=>Xf,JobResult:()=>Jf,Label:()=>Qf,LightningPubRPC:()=>bp,LiveChatMessage:()=>Vf,LiveEvent:()=>Bp,LongFormArticle:()=>Lp,Metadata:()=>Bf,Mutelist:()=>op,NWCWalletInfo:()=>mp,NWCWalletRequest:()=>_c,NWCWalletResponse:()=>wp,NostrConnect:()=>vp,OpenTimestamps:()=>qf,Pinlist:()=>sp,PrivateDirectMessage:()=>jf,ProblemTracker:()=>Gf,ProfileBadges:()=>kp,PublicChatsList:()=>up,Reaction:()=>$o,RecommendRelay:()=>zf,RelayList:()=>ap,Relaysets:()=>$p,Report:()=>Kf,Reporting:()=>Wf,Repost:()=>xo,Seal:()=>mc,SearchRelaysList:()=>dp,ShortTextNote:()=>Rf,Time:()=>Pp,UserEmojiList:()=>pp,UserStatuses:()=>Rp,Zap:()=>rp,ZapGoal:()=>tp,ZapRequest:()=>np,classifyKind:()=>Mf,isEphemeralKind:()=>yc,isKind:()=>Nf,isParameterizedReplaceableKind:()=>Eo,isRegularKind:()=>gc,isReplaceableKind:()=>vo});var Bf=0,Rf=1,zf=2,Uf=3,Df=4,Pf=5,xo=6,$o=7,Hf=8,mc=13,jf=14,Ff=16,bc=40,wc=41,vc=42,Ec=43,xc=44,qf=1040,$c=1059,Zf=1063,Vf=1311,Gf=1971,Kf=1984,Wf=1984,Qf=1985,Yf=4550,Xf=5999,Jf=6999,ep=7e3,tp=9041,np=9734,rp=9735,ip=9802,op=1e4,sp=10001,ap=10002,cp=10003,lp=10004,up=10005,hp=10006,dp=10007,fp=10015,pp=10030,gp=10050,yp=10096,mp=13194,bp=21e3,Ac=22242,_c=23194,wp=23195,vp=24133,Ao=27235,Ep=3e4,xp=30001,$p=30002,Ap=30003,_p=30004,kp=30008,Sp=30009,Ip=30015,Cp=30017,Tp=30018,Lp=30023,Op=30024,Mp=30030,Np=30078,Bp=30311,Rp=30315,zp=30402,Up=30403,Dp=31922,Pp=31923,Hp=31924,jp=31925,Fp=31989,qp=31990,Zp=34550;function kc(n,e){if(n.ids&&n.ids.indexOf(e.id)===-1||n.kinds&&n.kinds.indexOf(e.kind)===-1||n.authors&&n.authors.indexOf(e.pubkey)===-1)return!1;for(let t in n)if(t[0]==="#"){let r=n[`#${t.slice(1)}`];if(r&&!e.tags.find((([o,c])=>o===t.slice(1)&&r.indexOf(c)!==-1)))return!1}return!(n.since&&e.created_at<n.since)&&!(n.until&&e.created_at>n.until)}function Sc(n,e){for(let t=0;t<n.length;t++)if(kc(n[t],e))return!0;return!1}function Vp(...n){let e={};for(let t=0;t<n.length;t++){let r=n[t];Object.entries(r).forEach((([o,c])=>{if(o==="kinds"||o==="ids"||o==="authors"||o[0]==="#"){e[o]=e[o]||[];for(let l=0;l<c.length;l++){let h=c[l];e[o].includes(h)||e[o].push(h)}}})),r.limit&&(!e.limit||r.limit>e.limit)&&(e.limit=r.limit),r.until&&(!e.until||r.until>e.until)&&(e.until=r.until),r.since&&(!e.since||r.since<e.since)&&(e.since=r.since)}return e}function Gp(n){if(n.ids&&!n.ids.length||n.kinds&&!n.kinds.length||n.authors&&!n.authors.length)return 0;for(const[e,t]of Object.entries(n))if(e[0]==="#"&&Array.isArray(t)&&!t.length)return 0;return Math.min(Math.max(0,n.limit??1/0),n.ids?.length??1/0,n.authors?.length&&n.kinds?.every((e=>vo(e)))?n.authors.length*n.kinds.length:1/0,n.authors?.length&&n.kinds?.every((e=>Eo(e)))&&n["#d"]?.length?n.authors.length*n.kinds.length*n["#d"].length:1/0)}var Ic={};function Wr(n,e){let t=e.length+3,r=n.indexOf(`"${e}":`)+t,o=n.slice(r).indexOf('"')+r+1;return n.slice(o,o+64)}function Cc(n,e){let t=e.length,r=n.indexOf(`"${e}":`)+t+3,o=n.slice(r),c=Math.min(o.indexOf(","),o.indexOf("}"));return parseInt(o.slice(0,c),10)}function Tc(n){let e=n.slice(0,22).indexOf('"EVENT"');if(e===-1)return null;let t=n.slice(e+7+1).indexOf('"');if(t===-1)return null;let r=e+7+1+t,o=n.slice(r+1,80).indexOf('"');if(o===-1)return null;let c=r+1+o;return n.slice(r+1,c)}function Kp(n,e){return e===Wr(n,"id")}function Wp(n,e){return e===Wr(n,"pubkey")}function Qp(n,e){return e===Cc(n,"kind")}De(Ic,{getHex64:()=>Wr,getInt:()=>Cc,getSubscriptionId:()=>Tc,matchEventId:()=>Kp,matchEventKind:()=>Qp,matchEventPubkey:()=>Wp});var Lc={};function Oc(n,e){return{kind:Ac,created_at:Math.floor(Date.now()/1e3),tags:[["relay",n],["challenge",e]],content:""}}async function Yp(){return new Promise((n=>{const e=new MessageChannel,t=()=>{e.port1.removeEventListener("message",t),n()};e.port1.addEventListener("message",t),e.port2.postMessage(0),e.port1.start()}))}De(Lc,{makeAuthEvent:()=>Oc});var Mc,Xp=n=>(n[rn]=!0,!0),_o=class{url;_connected=!1;onclose=null;onnotice=n=>{};_onauth=null;baseEoseTimeout=4400;connectionTimeout=4400;publishTimeout=4400;openSubs=new Map;connectionTimeoutHandle;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;incomingMessageQueue=new hc;queueRunning=!1;challenge;serial=0;verifyEvent;_WebSocket;constructor(n,e){this.url=On(n),this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation||WebSocket}static async connect(n,e){const t=new _o(n,e);return await t.connect(),t}closeAllSubscriptions(n){for(let[e,t]of this.openSubs)t.close(n);this.openSubs.clear();for(let[e,t]of this.openEventPublishes)t.reject(new Error(n));this.openEventPublishes.clear();for(let[e,t]of this.openCountRequests)t.reject(new Error(n));this.openCountRequests.clear()}get connected(){return this._connected}async connect(){return this.connectionPromise||(this.challenge=void 0,this.connectionPromise=new Promise(((n,e)=>{this.connectionTimeoutHandle=setTimeout((()=>{e("connection timed out"),this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions("relay connection timed out")}),this.connectionTimeout);try{this.ws=new this._WebSocket(this.url)}catch(t){return void e(t)}this.ws.onopen=()=>{clearTimeout(this.connectionTimeoutHandle),this._connected=!0,n()},this.ws.onerror=t=>{e(t.message||"websocket error"),this._connected&&(this._connected=!1,this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions("relay connection errored"))},this.ws.onclose=async()=>{this._connected&&(this._connected=!1,this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions("relay connection closed"))},this.ws.onmessage=this._onmessage.bind(this)}))),this.connectionPromise}async runQueue(){for(this.queueRunning=!0;this.handleNext()!==!1;)await Yp();this.queueRunning=!1}handleNext(){const n=this.incomingMessageQueue.dequeue();if(!n)return!1;const e=Tc(n);if(e){const t=this.openSubs.get(e);if(!t)return;const r=Wr(n,"id"),o=t.alreadyHaveEvent?.(r);if(t.receivedEvent?.(this,r),o)return}try{let t=JSON.parse(n);switch(t[0]){case"EVENT":{const r=this.openSubs.get(t[1]),o=t[2];return void(this.verifyEvent(o)&&Sc(r.filters,o)&&r.onevent(o))}case"COUNT":{const r=t[1],o=t[2],c=this.openCountRequests.get(r);return void(c&&(c.resolve(o.count),this.openCountRequests.delete(r)))}case"EOSE":{const r=this.openSubs.get(t[1]);return r?void r.receivedEose():void 0}case"OK":{const r=t[1],o=t[2],c=t[3],l=this.openEventPublishes.get(r);return void(l&&(o?l.resolve(c):l.reject(new Error(c)),this.openEventPublishes.delete(r)))}case"CLOSED":{const r=t[1],o=this.openSubs.get(r);return o?(o.closed=!0,void o.close(t[2])):void 0}case"NOTICE":return void this.onnotice(t[1]);case"AUTH":return this.challenge=t[1],void this._onauth?.(t[1])}}catch{return}}async send(n){if(!this.connectionPromise)throw new Error("sending on closed connection");this.connectionPromise.then((()=>{this.ws?.send(n)}))}async auth(n){if(!this.challenge)throw new Error("can't perform auth, no challenge was received");const e=await n(Oc(this.url,this.challenge)),t=new Promise(((r,o)=>{this.openEventPublishes.set(e.id,{resolve:r,reject:o})}));return this.send('["AUTH",'+JSON.stringify(e)+"]"),t}async publish(n){const e=new Promise(((t,r)=>{this.openEventPublishes.set(n.id,{resolve:t,reject:r})}));return this.send('["EVENT",'+JSON.stringify(n)+"]"),setTimeout((()=>{const t=this.openEventPublishes.get(n.id);t&&(t.reject(new Error("publish timed out")),this.openEventPublishes.delete(n.id))}),this.publishTimeout),e}async count(n,e){this.serial++;const t=e?.id||"count:"+this.serial,r=new Promise(((o,c)=>{this.openCountRequests.set(t,{resolve:o,reject:c})}));return this.send('["COUNT","'+t+'",'+JSON.stringify(n).substring(1)),r}subscribe(n,e){const t=this.prepareSubscription(n,e);return t.fire(),t}prepareSubscription(n,e){this.serial++;const t=e.id||"sub:"+this.serial,r=new Jp(this,t,n,e);return this.openSubs.set(t,r),r}close(){this.closeAllSubscriptions("relay connection closed by us"),this._connected=!1,this.ws?.close()}_onmessage(n){this.incomingMessageQueue.enqueue(n.data),this.queueRunning||this.runQueue()}},Jp=class{relay;id;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oneose;onclose;eoseTimeout;eoseTimeoutHandle;constructor(n,e,t,r){this.relay=n,this.filters=t,this.id=e,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||n.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.onevent=r.onevent||(o=>{})}fire(){this.relay.send('["REQ","'+this.id+'",'+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(n="closed by caller"){!this.closed&&this.relay.connected&&(this.relay.send('["CLOSE",'+JSON.stringify(this.id)+"]"),this.closed=!0),this.relay.openSubs.delete(this.id),this.onclose?.(n)}};try{Mc=WebSocket}catch{}var Nc,Bc=class extends _o{constructor(n){super(n,{verifyEvent:Fn,websocketImplementation:Mc})}static async connect(n){const e=new Bc(n);return await e.connect(),e}},e0=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;trustedRelayURLs=new Set;_WebSocket;constructor(n){this.verifyEvent=n.verifyEvent,this._WebSocket=n.websocketImplementation}async ensureRelay(n,e){n=On(n);let t=this.relays.get(n);return t||(t=new _o(n,{verifyEvent:this.trustedRelayURLs.has(n)?Xp:this.verifyEvent,websocketImplementation:this._WebSocket}),e?.connectionTimeout&&(t.connectionTimeout=e.connectionTimeout),this.relays.set(n,t)),await t.connect(),t}close(n){n.map(On).forEach((e=>{this.relays.get(e)?.close()}))}subscribeMany(n,e,t){return this.subscribeManyMap(Object.fromEntries(n.map((r=>[r,e]))),t)}subscribeManyMap(n,e){this.trackRelays&&(e.receivedEvent=(m,v)=>{let L=this.seenOn.get(v);L||(L=new Set,this.seenOn.set(v,L)),L.add(m)});const t=new Set,r=[],o=Object.keys(n).length,c=[];let l=m=>{c[m]=!0,c.filter((v=>v)).length===o&&(e.oneose?.(),l=()=>{})};const h=[];let d=(m,v)=>{l(m),h[m]=v,h.filter((L=>L)).length===o&&(e.onclose?.(h),d=()=>{})};const g=m=>{if(e.alreadyHaveEvent?.(m))return!0;const v=t.has(m);return t.add(m),v},w=Promise.all(Object.entries(n).map((async(m,v,L)=>{if(L.indexOf(m)!==v)return void d(v,"duplicate url");let C,[S,z]=m;S=On(S);try{C=await this.ensureRelay(S,{connectionTimeout:e.maxWait?Math.max(.8*e.maxWait,e.maxWait-1e3):void 0})}catch(H){return void d(v,H?.message||String(H))}let F=C.subscribe(z,{...e,oneose:()=>l(v),onclose:H=>d(v,H),alreadyHaveEvent:g,eoseTimeout:e.maxWait});r.push(F)})));return{async close(){await w,r.forEach((m=>{m.close()}))}}}subscribeManyEose(n,e,t){const r=this.subscribeMany(n,e,{...t,oneose(){r.close()}});return r}async querySync(n,e,t){return new Promise((async r=>{const o=[];this.subscribeManyEose(n,[e],{...t,onevent(c){o.push(c)},onclose(c){r(o)}})}))}async get(n,e,t){e.limit=1;const r=await this.querySync(n,e,t);return r.sort(((o,c)=>c.created_at-o.created_at)),r[0]||null}publish(n,e){return n.map(On).map((async(t,r,o)=>{if(o.indexOf(t)!==r)return Promise.reject("duplicate url");let c=await this.ensureRelay(t);return c.publish(e).then((l=>{if(this.trackRelays){let h=this.seenOn.get(e.id);h||(h=new Set,this.seenOn.set(e.id,h)),h.add(c)}return l}))}))}listConnectionStatus(){const n=new Map;return this.relays.forEach(((e,t)=>n.set(t,e.connected))),n}destroy(){this.relays.forEach((n=>n.close())),this.relays=new Map}};try{Nc=WebSocket}catch{}var t0=class extends e0{constructor(){super({verifyEvent:Fn,websocketImplementation:Nc})}},Rc={};De(Rc,{BECH32_REGEX:()=>zc,Bech32MaxSize:()=>ko,NostrTypeGuard:()=>n0,decode:()=>dr,encodeBytes:()=>Yr,naddrEncode:()=>c0,neventEncode:()=>a0,noteEncode:()=>o0,nprofileEncode:()=>s0,npubEncode:()=>i0,nsecEncode:()=>r0});var n0={isNProfile:n=>/^nprofile1[a-z\d]+$/.test(n||""),isNEvent:n=>/^nevent1[a-z\d]+$/.test(n||""),isNAddr:n=>/^naddr1[a-z\d]+$/.test(n||""),isNSec:n=>/^nsec1[a-z\d]{58}$/.test(n||""),isNPub:n=>/^npub1[a-z\d]{58}$/.test(n||""),isNote:n=>/^note1[a-z\d]+$/.test(n||""),isNcryptsec:n=>/^ncryptsec1[a-z\d]+$/.test(n||"")},ko=5e3,zc=/[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;function dr(n){let{prefix:e,words:t}=Rn.decode(n,ko),r=new Uint8Array(Rn.fromWords(t));switch(e){case"nprofile":{let o=Fi(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:Fe(o[0][0]),relays:o[1]?o[1].map((c=>Dt.decode(c))):[]}}}case"nevent":{let o=Fi(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for nevent");if(o[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(o[2]&&o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(o[3]&&o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"nevent",data:{id:Fe(o[0][0]),relays:o[1]?o[1].map((c=>Dt.decode(c))):[],author:o[2]?.[0]?Fe(o[2][0]):void 0,kind:o[3]?.[0]?parseInt(Fe(o[3][0]),16):void 0}}}case"naddr":{let o=Fi(r);if(!o[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!o[2]?.[0])throw new Error("missing TLV 2 for naddr");if(o[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!o[3]?.[0])throw new Error("missing TLV 3 for naddr");if(o[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:Dt.decode(o[0][0]),pubkey:Fe(o[2][0]),kind:parseInt(Fe(o[3][0]),16),relays:o[1]?o[1].map((c=>Dt.decode(c))):[]}}}case"nsec":return{type:e,data:r};case"npub":case"note":return{type:e,data:Fe(r)};default:throw new Error(`unknown prefix ${e}`)}}function Fi(n){let e={},t=n;for(;t.length>0;){let r=t[0],o=t[1],c=t.slice(2,2+o);if(t=t.slice(2+o),c.length<o)throw new Error(`not enough data to read on TLV ${r}`);e[r]=e[r]||[],e[r].push(c)}return e}function r0(n){return Yr("nsec",n)}function i0(n){return Yr("npub",Bn(n))}function o0(n){return Yr("note",Bn(n))}function Qr(n,e){let t=Rn.toWords(e);return Rn.encode(n,t,ko)}function Yr(n,e){return Qr(n,e)}function s0(n){return Qr("nprofile",So({0:[Bn(n.pubkey)],1:(n.relays||[]).map((e=>vt.encode(e)))}))}function a0(n){let e;return n.kind!==void 0&&(e=(function(t){const r=new Uint8Array(4);return r[0]=t>>24&255,r[1]=t>>16&255,r[2]=t>>8&255,r[3]=255&t,r})(n.kind)),Qr("nevent",So({0:[Bn(n.id)],1:(n.relays||[]).map((t=>vt.encode(t))),2:n.author?[Bn(n.author)]:[],3:e?[new Uint8Array(e)]:[]}))}function c0(n){let e=new ArrayBuffer(4);return new DataView(e).setUint32(0,n.kind,!1),Qr("naddr",So({0:[vt.encode(n.identifier)],1:(n.relays||[]).map((t=>vt.encode(t))),2:[Bn(n.pubkey)],3:[new Uint8Array(e)]}))}function So(n){let e=[];return Object.entries(n).reverse().forEach((([t,r])=>{r.forEach((o=>{let c=new Uint8Array(o.length+2);c.set([parseInt(t)],0),c.set([o.length],1),c.set(o,2),e.push(c)}))})),qr(...e)}var l0=/\bnostr:((note|npub|naddr|nevent|nprofile)1\w+)\b|#\[(\d+)\]/g;function u0(n){let e=[];for(let t of n.content.matchAll(l0))if(t[2])try{let{type:r,data:o}=dr(t[1]);switch(r){case"npub":e.push({text:t[0],profile:{pubkey:o,relays:[]}});break;case"nprofile":e.push({text:t[0],profile:o});break;case"note":e.push({text:t[0],event:{id:o,relays:[]}});break;case"nevent":e.push({text:t[0],event:o});break;case"naddr":e.push({text:t[0],address:o})}}catch{}else if(t[3]){let r=parseInt(t[3],10),o=n.tags[r];if(!o)continue;switch(o[0]){case"p":e.push({text:t[0],profile:{pubkey:o[1],relays:o[2]?[o[2]]:[]}});break;case"e":e.push({text:t[0],event:{id:o[1],relays:o[2]?[o[2]]:[]}});break;case"a":try{let[c,l,h]=o[1].split(":");e.push({text:t[0],address:{identifier:h,pubkey:l,kind:parseInt(c,10),relays:o[2]?[o[2]]:[]}})}catch{}}}return e}var Uc={};async function Dc(n,e,t){const r=n instanceof Uint8Array?Fe(n):n,o=Pc(Dn.getSharedSecret(r,"02"+e));let c=Uint8Array.from(Da(16)),l=vt.encode(t),h=tc(o,c).encrypt(l);return`${cn.encode(new Uint8Array(h))}?iv=${cn.encode(new Uint8Array(c.buffer))}`}async function h0(n,e,t){const r=n instanceof Uint8Array?Fe(n):n;let[o,c]=t.split("?iv="),l=Pc(Dn.getSharedSecret(r,"02"+e)),h=cn.decode(c),d=cn.decode(o),g=tc(l,h).decrypt(d);return Dt.decode(g)}function Pc(n){return n.slice(1,33)}De(Uc,{decrypt:()=>h0,encrypt:()=>Dc});var Hc={};De(Hc,{NIP05_REGEX:()=>Io,isNip05:()=>d0,isValid:()=>g0,queryProfile:()=>jc,searchDomain:()=>p0,useFetchImplementation:()=>f0});var Xr,Io=/^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/,d0=n=>Io.test(n||"");try{Xr=fetch}catch{}function f0(n){Xr=n}async function p0(n,e=""){try{const t=`https://${n}/.well-known/nostr.json?name=${e}`,r=await Xr(t,{redirect:"manual"});if(r.status!==200)throw Error("Wrong response code");return(await r.json()).names}catch{return{}}}async function jc(n){const e=n.match(Io);if(!e)return null;const[,t="_",r]=e;try{const o=`https://${r}/.well-known/nostr.json?name=${t}`,c=await Xr(o,{redirect:"manual"});if(c.status!==200)throw Error("Wrong response code");const l=await c.json(),h=l.names[t];return h?{pubkey:h,relays:l.relays?.[h]}:null}catch{return null}}async function g0(n,e){const t=await jc(e);return!!t&&t.pubkey===n}var Fc={};function y0(n){const e={reply:void 0,root:void 0,mentions:[],profiles:[],quotes:[]};let t,r;for(let o=n.tags.length-1;o>=0;o--){const c=n.tags[o];if(c[0]==="e"&&c[1]){const[l,h,d,g,w]=c,m={id:h,relays:d?[d]:[],author:w};if(g==="root"){e.root=m;continue}if(g==="reply"){e.reply=m;continue}if(g==="mention"){e.mentions.push(m);continue}t?r=m:t=m,e.mentions.push(m)}else{if(c[0]==="q"&&c[1]){const[l,h,d]=c;e.quotes.push({id:h,relays:d?[d]:[]})}c[0]==="p"&&c[1]&&e.profiles.push({pubkey:c[1],relays:c[2]?[c[2]]:[]})}}return e.root||(e.root=r||t||e.reply),e.reply||(e.reply=t||e.root),[e.reply,e.root].forEach((o=>{if(!o)return;let c=e.mentions.indexOf(o);if(c!==-1&&e.mentions.splice(c,1),o.author){let l=e.profiles.find((h=>h.pubkey===o.author));l&&l.relays&&(o.relays||(o.relays=[]),l.relays.forEach((h=>{o.relays?.indexOf(h)===-1&&o.relays.push(h)})),l.relays=o.relays)}})),e.mentions.forEach((o=>{if(o.author){let c=e.profiles.find((l=>l.pubkey===o.author));c&&c.relays&&(o.relays||(o.relays=[]),c.relays.forEach((l=>{o.relays.indexOf(l)===-1&&o.relays.push(l)})),c.relays=o.relays)}})),e}De(Fc,{parse:()=>y0});var qc={};De(qc,{fetchRelayInformation:()=>b0,useFetchImplementation:()=>m0});function m0(n){}async function b0(n){return await(await fetch(n.replace("ws://","http://").replace("wss://","https://"),{headers:{Accept:"application/nostr+json"}})).json()}var Zc={};function Vc(n){let e=0;for(let t=0;t<64;t+=8){const r=parseInt(n.substring(t,t+8),16);if(r!==0){e+=Math.clz32(r);break}e+=32}return e}function w0(n,e){let t=0;const r=n,o=["nonce",t.toString(),e.toString()];for(r.tags.push(o);;){const c=Math.floor(new Date().getTime()/1e3);if(c!==r.created_at&&(t=0,r.created_at=c),o[1]=(++t).toString(),r.id=Gc(r),Vc(r.id)>=e)break}return r}function Gc(n){return Fe(xn(vt.encode(JSON.stringify([0,n.pubkey,n.created_at,n.kind,n.tags,n.content]))))}De(Zc,{fastEventHash:()=>Gc,getPow:()=>Vc,minePow:()=>w0});var Kc={};function v0(n,e,t,r){return Et({kind:xo,tags:[...n.tags??[],["e",e.id,t],["p",e.pubkey]],content:n.content===""?"":JSON.stringify(e),created_at:n.created_at},r)}function Wc(n){if(n.kind!==xo)return;let e,t;for(let r=n.tags.length-1;r>=0&&(e===void 0||t===void 0);r--){const o=n.tags[r];o.length>=2&&(o[0]==="e"&&e===void 0?e=o:o[0]==="p"&&t===void 0&&(t=o))}return e!==void 0?{id:e[1],relays:[e[2],t?.[2]].filter((r=>typeof r=="string")),author:t?.[1]}:void 0}function E0(n,{skipVerification:e}={}){const t=Wc(n);if(t===void 0||n.content==="")return;let r;try{r=JSON.parse(n.content)}catch{return}return r.id===t.id&&(e||Fn(r))?r:void 0}De(Kc,{finishRepostEvent:()=>v0,getRepostedEvent:()=>E0,getRepostedEventPointer:()=>Wc});var Qc={};De(Qc,{NOSTR_URI_REGEX:()=>Jr,parse:()=>$0,test:()=>x0});var Jr=new RegExp(`nostr:(${zc.source})`);function x0(n){return typeof n=="string"&&new RegExp(`^${Jr.source}$`).test(n)}function $0(n){const e=n.match(new RegExp(`^${Jr.source}$`));if(!e)throw new Error(`Invalid Nostr URI: ${n}`);return{uri:e[0],value:e[1],decoded:dr(e[1])}}var Yc={};function A0(n,e,t){const r=e.tags.filter((o=>o.length>=2&&(o[0]==="e"||o[0]==="p")));return Et({...n,kind:$o,tags:[...n.tags??[],...r,["e",e.id],["p",e.pubkey]],content:n.content??"+"},t)}function _0(n){if(n.kind!==$o)return;let e,t;for(let r=n.tags.length-1;r>=0&&(e===void 0||t===void 0);r--){const o=n.tags[r];o.length>=2&&(o[0]==="e"&&e===void 0?e=o:o[0]==="p"&&t===void 0&&(t=o))}return e!==void 0&&t!==void 0?{id:e[1],relays:[e[2],t[2]].filter((r=>r!==void 0)),author:t[1]}:void 0}De(Yc,{finishReactionEvent:()=>A0,getReactedEventPointer:()=>_0});var Xc={};De(Xc,{matchAll:()=>k0,regex:()=>Co,replaceAll:()=>S0});var Co=()=>new RegExp(`\\b${Jr.source}\\b`,"g");function*k0(n){const e=n.matchAll(Co());for(const t of e)try{const[r,o]=t;yield{uri:r,value:o,decoded:dr(o),start:t.index,end:t.index+r.length}}catch{}}function S0(n,e){return n.replaceAll(Co(),((t,r)=>e({uri:t,value:r,decoded:dr(r)})))}var Jc={};De(Jc,{channelCreateEvent:()=>I0,channelHideMessageEvent:()=>L0,channelMessageEvent:()=>T0,channelMetadataEvent:()=>C0,channelMuteUserEvent:()=>O0});var I0=(n,e)=>{let t;if(typeof n.content=="object")t=JSON.stringify(n.content);else{if(typeof n.content!="string")return;t=n.content}return Et({kind:bc,tags:[...n.tags??[]],content:t,created_at:n.created_at},e)},C0=(n,e)=>{let t;if(typeof n.content=="object")t=JSON.stringify(n.content);else{if(typeof n.content!="string")return;t=n.content}return Et({kind:wc,tags:[["e",n.channel_create_event_id],...n.tags??[]],content:t,created_at:n.created_at},e)},T0=(n,e)=>{const t=[["e",n.channel_create_event_id,n.relay_url,"root"]];return n.reply_to_channel_message_event_id&&t.push(["e",n.reply_to_channel_message_event_id,n.relay_url,"reply"]),Et({kind:vc,tags:[...t,...n.tags??[]],content:n.content,created_at:n.created_at},e)},L0=(n,e)=>{let t;if(typeof n.content=="object")t=JSON.stringify(n.content);else{if(typeof n.content!="string")return;t=n.content}return Et({kind:Ec,tags:[["e",n.channel_message_event_id],...n.tags??[]],content:t,created_at:n.created_at},e)},O0=(n,e)=>{let t;if(typeof n.content=="object")t=JSON.stringify(n.content);else{if(typeof n.content!="string")return;t=n.content}return Et({kind:xc,tags:[["p",n.pubkey_to_mute],...n.tags??[]],content:t,created_at:n.created_at},e)},el={};De(el,{EMOJI_SHORTCODE_REGEX:()=>tl,matchAll:()=>M0,regex:()=>To,replaceAll:()=>N0});var tl=/:(\w+):/,To=()=>new RegExp(`\\B${tl.source}\\B`,"g");function*M0(n){const e=n.matchAll(To());for(const t of e)try{const[r,o]=t;yield{shortcode:r,name:o,start:t.index,end:t.index+r.length}}catch{}}function N0(n,e){return n.replaceAll(To(),((t,r)=>e({shortcode:t,name:r})))}var Lo,nl={};De(nl,{useFetchImplementation:()=>B0,validateGithub:()=>R0});try{Lo=fetch}catch{}function B0(n){Lo=n}async function R0(n,e,t){try{return await(await Lo(`https://gist.github.com/${e}/${t}/raw`)).text()===`Verifying that I control the following Nostr public key: ${n}`}catch{return!1}}var rl={};De(rl,{decrypt:()=>Bo,encrypt:()=>No,getConversationKey:()=>Oo,v2:()=>U0});var il=1,ol=65535;function Oo(n,e){const t=Dn.getSharedSecret(n,"02"+e).subarray(1,33);return kf(xn,t,"nip44-v2")}function sl(n,e){const t=Sf(xn,n,e,76);return{chacha_key:t.subarray(0,32),chacha_nonce:t.subarray(32,44),hmac_key:t.subarray(44,76)}}function Mo(n){if(!Number.isSafeInteger(n)||n<1)throw new Error("expected positive integer");if(n<=32)return 32;const e=1<<Math.floor(Math.log2(n-1))+1,t=e<=256?32:e/8;return t*(Math.floor((n-1)/t)+1)}function z0(n){const e=vt.encode(n),t=e.length;return qr((function(r){if(!Number.isSafeInteger(r)||r<il||r>ol)throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");const o=new Uint8Array(2);return new DataView(o.buffer).setUint16(0,r,!1),o})(t),e,new Uint8Array(Mo(t)-t))}function al(n,e,t){if(t.length!==32)throw new Error("AAD associated data must be 32 bytes");const r=qr(t,e);return Vr(xn,n,r)}function No(n,e,t=Da(32)){const{chacha_key:r,chacha_nonce:o,hmac_key:c}=sl(e,t),l=z0(n),h=ac(r,o,l),d=al(c,h,t);return cn.encode(qr(new Uint8Array([2]),t,h,d))}function Bo(n,e){const{nonce:t,ciphertext:r,mac:o}=(function(d){if(typeof d!="string")throw new Error("payload must be a valid string");const g=d.length;if(g<132||g>87472)throw new Error("invalid payload length: "+g);if(d[0]==="#")throw new Error("unknown encryption version");let w;try{w=cn.decode(d)}catch(L){throw new Error("invalid base64: "+L.message)}const m=w.length;if(m<99||m>65603)throw new Error("invalid data length: "+m);const v=w[0];if(v!==2)throw new Error("unknown encryption version "+v);return{nonce:w.subarray(1,33),ciphertext:w.subarray(33,-32),mac:w.subarray(-32)}})(n),{chacha_key:c,chacha_nonce:l,hmac_key:h}=sl(e,t);if(!po(al(h,r,t),o))throw new Error("invalid MAC");return(function(d){const g=new DataView(d.buffer).getUint16(0),w=d.subarray(2,2+g);if(g<il||g>ol||w.length!==g||d.length!==2+Mo(g))throw new Error("invalid padding");return Dt.decode(w)})(ac(c,l,r))}var U0={utils:{getConversationKey:Oo,calcPaddedLen:Mo},encrypt:No,decrypt:Bo},cl={};function D0(n){const{pathname:e,searchParams:t}=new URL(n),r=e,o=t.get("relay"),c=t.get("secret");if(!r||!o||!c)throw new Error("invalid connection string");return{pubkey:r,relay:o,secret:c}}async function P0(n,e,t){const r={method:"pay_invoice",params:{invoice:t}},o=await Dc(e,n,JSON.stringify(r)),c={kind:_c,created_at:Math.round(Date.now()/1e3),content:o,tags:[["p",n]]};return Et(c,e)}De(cl,{makeNwcRequestEvent:()=>P0,parseConnectionString:()=>D0});var Ro,ll={};De(ll,{getZapEndpoint:()=>j0,makeZapReceipt:()=>Z0,makeZapRequest:()=>F0,useFetchImplementation:()=>H0,validateZapRequest:()=>q0});try{Ro=fetch}catch{}function H0(n){Ro=n}async function j0(n){try{let e="",{lud06:t,lud16:r}=JSON.parse(n.content);if(t){let{words:l}=Rn.decode(t,1e3),h=Rn.fromWords(l);e=Dt.decode(h)}else{if(!r)return null;{let[l,h]=r.split("@");e=new URL(`/.well-known/lnurlp/${l}`,`https://${h}`).toString()}}let o=await Ro(e),c=await o.json();if(c.allowsNostr&&c.nostrPubkey)return c.callback}catch{}return null}function F0({profile:n,event:e,amount:t,relays:r,comment:o=""}){if(!t)throw new Error("amount not given");if(!n)throw new Error("profile not given");let c={kind:9734,created_at:Math.round(Date.now()/1e3),content:o,tags:[["p",n],["amount",t.toString()],["relays",...r]]};return e&&c.tags.push(["e",e]),c}function q0(n){let e;try{e=JSON.parse(n)}catch{return"Invalid zap request JSON."}if(!Gr(e))return"Zap request is not a valid Nostr event.";if(!Fn(e))return"Invalid signature on zap request.";let t=e.tags.find((([o,c])=>o==="p"&&c));if(!t)return"Zap request doesn't have a 'p' tag.";if(!t[1].match(/^[a-f0-9]{64}$/))return"Zap request 'p' tag is not valid hex.";let r=e.tags.find((([o,c])=>o==="e"&&c));return r&&!r[1].match(/^[a-f0-9]{64}$/)?"Zap request 'e' tag is not valid hex.":e.tags.find((([o,c])=>o==="relays"&&c))?null:"Zap request doesn't have a 'relays' tag."}function Z0({zapRequest:n,preimage:e,bolt11:t,paidAt:r}){let o=JSON.parse(n),c=o.tags.filter((([h])=>h==="e"||h==="p"||h==="a")),l={kind:9735,created_at:Math.round(r.getTime()/1e3),content:"",tags:[...c,["P",o.pubkey],["bolt11",t],["description",n]]};return e&&l.tags.push(["preimage",e]),l}var ul={};De(ul,{createRumor:()=>gl,createSeal:()=>yl,createWrap:()=>ml,unwrapEvent:()=>bl,unwrapManyEvents:()=>G0,wrapEvent:()=>ro,wrapManyEvents:()=>V0});var hl=()=>Math.round(Date.now()/1e3),dl=()=>Math.round(hl()-172800*Math.random()),fl=(n,e)=>Oo(n,e),pl=(n,e,t)=>No(JSON.stringify(n),fl(e,t)),pa=(n,e)=>JSON.parse(Bo(n.content,fl(e,n.pubkey)));function gl(n,e){const t={created_at:hl(),content:"",tags:[],...n,pubkey:wo(e)};return t.id=nr(t),t}function yl(n,e,t){return Et({kind:mc,content:pl(n,e,t),created_at:dl(),tags:[]},e)}function ml(n,e){const t=fc();return Et({kind:$c,content:pl(n,t,e),created_at:dl(),tags:[["p",e]]},t)}function ro(n,e,t){return ml(yl(gl(n,e),e,t),t)}function V0(n,e,t){if(!t||t.length===0)throw new Error("At least one recipient is required.");const r=wo(e),o=[ro(n,e,r)];return t.forEach((c=>{o.push(ro(n,e,c))})),o}function bl(n,e){const t=pa(n,e);return pa(t,e)}function G0(n,e){let t=[];return n.forEach((r=>{t.push(bl(r,e))})),t.sort(((r,o)=>r.created_at-o.created_at)),t}var wl={};De(wl,{getToken:()=>K0,hashPayload:()=>zo,unpackEventFromToken:()=>El,validateEvent:()=>Sl,validateEventKind:()=>$l,validateEventMethodTag:()=>_l,validateEventPayloadTag:()=>kl,validateEventTimestamp:()=>xl,validateEventUrlTag:()=>Al,validateToken:()=>W0});var vl="Nostr ";async function K0(n,e,t,r=!1,o){const c={kind:Ao,tags:[["u",n],["method",e]],created_at:Math.round(new Date().getTime()/1e3),content:""};o&&c.tags.push(["payload",zo(o)]);const l=await t(c);return(r?vl:"")+cn.encode(vt.encode(JSON.stringify(l)))}async function W0(n,e,t){const r=await El(n).catch((o=>{throw o}));return await Sl(r,e,t).catch((o=>{throw o}))}async function El(n){if(!n)throw new Error("Missing token");n=n.replace(vl,"");const e=Dt.decode(cn.decode(n));if(!e||e.length===0||!e.startsWith("{"))throw new Error("Invalid token");return JSON.parse(e)}function xl(n){return!!n.created_at&&Math.round(new Date().getTime()/1e3)-n.created_at<60}function $l(n){return n.kind===Ao}function Al(n,e){const t=n.tags.find((r=>r[0]==="u"));return!!t&&t.length>0&&t[1]===e}function _l(n,e){const t=n.tags.find((r=>r[0]==="method"));return!!t&&t.length>0&&t[1].toLowerCase()===e.toLowerCase()}function zo(n){return Fe(xn(vt.encode(JSON.stringify(n))))}function kl(n,e){const t=n.tags.find((o=>o[0]==="payload"));if(!t)return!1;const r=zo(e);return t.length>0&&t[1]===r}async function Sl(n,e,t,r){if(!Fn(n))throw new Error("Invalid nostr event, signature invalid");if(!$l(n))throw new Error("Invalid nostr event, kind invalid");if(!xl(n))throw new Error("Invalid nostr event, created_at timestamp invalid");if(!Al(n,e))throw new Error("Invalid nostr event, url tag invalid");if(!_l(n,t))throw new Error("Invalid nostr event, method tag invalid");if(r&&typeof r=="object"&&Object.keys(r).length>0&&!kl(n,r))throw new Error("Invalid nostr event, payload tag does not match request body hash");return!0}const Ae={LIBRARIES:{decodeBolt11:Dd.decode,NostrTools:Vi},DEFAULT_OPTIONS:{theme:"light",colorMode:!0},BATCH_SIZE:5,REQ_CONFIG:{INITIAL_LOAD_COUNT:15,ADDITIONAL_LOAD_COUNT:20},LOAD_TIMEOUT:1e4,BUFFER_INTERVAL:500,BUFFER_MIN_INTERVAL:100,INFINITE_SCROLL:{ROOT_MARGIN:"400px",THRESHOLD:.1,DEBOUNCE_TIME:500,RETRY_DELAY:500},ZAP_CONFIG:{DEFAULT_LIMIT:1,DEFAULT_COLOR_MODE:!0,ERRORS:{DIALOG_NOT_FOUND:"Zap dialog not found",BUTTON_NOT_FOUND:"Fetch button not found",DECODE_FAILED:"Failed to decode identifier"}},ZAP_AMOUNT_CONFIG:{DEFAULT_COLOR_MODE:!0,THRESHOLDS:[{value:1e4,className:"zap-amount-10k"},{value:5e3,className:"zap-amount-5k"},{value:2e3,className:"zap-amount-2k"},{value:1e3,className:"zap-amount-1k"},{value:500,className:"zap-amount-500"},{value:200,className:"zap-amount-200"},{value:100,className:"zap-amount-100"}],DEFAULT_CLASS:"default-color",DISABLED_CLASS:""},DIALOG_CONFIG:{DEFAULT_TITLE:"To ",NO_ZAPS_MESSAGE:"No Zaps yet!<br>Send the first Zap!",DEFAULT_NO_ZAPS_DELAY:1500,ZAP_LIST:{INITIAL_BATCH:30,REMAINING_BATCH:30,PROFILE_BATCH:30,MIN_HEIGHT:"100px"}},REQUEST_CONFIG:{METADATA_TIMEOUT:2e4,REQUEST_TIMEOUT:2e3,CACHE_DURATION:3e5},PROFILE_CONFIG:{BATCH_SIZE:20,BATCH_DELAY:100,RELAYS:["wss://relay.nostr.band","wss://purplepag.es","wss://relay.damus.io","wss://nostr.wine","wss://directory.yabu.me"]},BATCH_CONFIG:{REFERENCE_PROCESSOR:{BATCH_SIZE:20,BATCH_DELAY:100},SUPPORTED_EVENT_KINDS:[1,30023,30030,30009,40,42,31990]},BATCH_PROCESSOR_CONFIG:{DEFAULT_BATCH_SIZE:20,DEFAULT_BATCH_DELAY:100,DEFAULT_MAX_CACHE_AGE:18e5,DEFAULT_RELAY_URLS:[],TIMEOUT_DURATION:500}};class lr{constructor(e,t,r=null){this.identifier=e,this.relayUrls=t,this.isColorModeEnabled=r===null?Ae.ZAP_CONFIG.DEFAULT_COLOR_MODE:String(r).toLowerCase()==="true"}static determineColorMode(e){if(!e||!e.hasAttribute("data-zap-color-mode"))return Ae.ZAP_CONFIG.DEFAULT_COLOR_MODE;const t=e.getAttribute("data-zap-color-mode");return t.toLowerCase()!=="true"&&t.toLowerCase()!=="false"||t.toLowerCase()==="true"}static fromButton(e){if(!e)throw new Error(Ae.ZAP_CONFIG.ERRORS.BUTTON_NOT_FOUND);const t=lr.determineColorMode(e);return new lr(e.getAttribute("data-nzv-id"),e.getAttribute("data-relay-urls").split(","),t)}}class Ft{constructor(e=1e3){this.cache=new Map,this.maxSize=e,this.accessOrder=new Map}set(e,t){if(this.cache.size>=this.maxSize&&!this.cache.has(e)){const r=this.accessOrder.keys().next().value;this.cache.delete(r),this.accessOrder.delete(r)}return this.cache.set(e,t),this.accessOrder.delete(e),this.accessOrder.set(e,Date.now()),t}get(e){if(!this.cache.has(e))return;const t=this.cache.get(e);return this.accessOrder.set(e,Date.now()),t}has(e){return this.cache.has(e)}delete(e){this.cache.delete(e)}clear(){this.cache.clear()}}class Uo extends Ft{#e=new Map;setProfile(e,t){if(!e||!t)return;const r=this.get(e);r&&r._eventCreatedAt&&t._eventCreatedAt&&!(t._eventCreatedAt>r._eventCreatedAt)||(this.set(e,t),this.#t(e,t))}#t(e,t){this.#e.forEach((r=>{try{r(e,t)}catch{}}))}subscribe(e){if(typeof e!="function")return null;const t=Math.random().toString(36).substr(2,9);return this.#e.set(t,e),()=>this.#e.delete(t)}clearSubscriptions(){this.#e.clear()}}class Q0 extends Ft{#e=new Map;initializeView(e){this.#e.set(e,{isInitialFetchComplete:!1,lastEventTime:null,isLoading:!1,batchProcessing:!1})}getViewState(e){return this.#e.get(e)||this.initializeView(e)}updateViewState(e,t){const r=this.getViewState(e);return this.#e.set(e,{...r,...t}),this.#e.get(e)}getEvents(e){return this.get(e)||[]}setEvents(e,t,r=!1){const o=r?this.getEvents(e):[],c=new Map(t.map((h=>[h.id,h]))),l=[...o.filter((h=>!c.has(h.id))),...t];this.set(e,l)}addEvent(e,t){if(!t?.id)return!1;const r=this.getEvents(e);return!this.#t(r,t)&&(r.push(t),r.sort(((o,c)=>c.created_at-o.created_at)),this.setEvents(e,r,!0),!0)}#t(e,t){return e.some((r=>r.id===t.id||r.kind===t.kind&&r.pubkey===t.pubkey&&r.content===t.content&&r.created_at===t.created_at))}}class Y0 extends Ft{#e=new Map;#t=new Map;async getOrFetch(e,t){const r=this.get(e);if(r)return r;const o=this.#e.get(e);if(o)return o;const c=t().then((l=>(l&&this.set(e,l),this.#e.delete(e),l))).catch((l=>(this.#e.delete(e),null)));return this.#e.set(e,c),c}clearPendingFetches(){this.#e.clear()}setComponent(e,t){this.#t.set(e,t)}getComponent(e){return this.#t.get(e)}clearComponents(){this.#t.clear()}clear(){super.clear(),this.clearPendingFetches(),this.clearComponents()}}class X0 extends Ft{#e=new Map;#t=new Map;setCached(e,t,r){const o=`${e}:${t}`;this.set(o,{stats:r,timestamp:Date.now()}),this.updateViewStats(e,r)}getCached(e,t){const r=`${e}:${t}`;return this.get(r)}updateViewStats(e,t){t&&this.#e.set(e,{...t,lastUpdate:Date.now()})}getViewStats(e){return this.#e.get(e)}clearViewStats(e){this.#e.delete(e)}setNoZapsState(e,t){this.#t.set(e,t)}hasNoZaps(e){return this.#t.get(e)||!1}clearNoZapsState(e){this.#t.delete(e)}clear(){super.clear(),this.#e.clear(),this.#t.clear()}}class J0 extends Ft{hasDecoded(e){return this.has(e)}setDecoded(e,t){this.set(e,t)}getDecoded(e){return this.get(e)}}class eg extends Ft{initializeLoadState(e){const t={isInitialFetchComplete:!1,lastEventTime:null,isLoading:!1,currentCount:0};return this.set(e,t),t}getLoadState(e){return this.has(e)?this.get(e):this.initializeLoadState(e)}updateLoadState(e,t){const r={...this.getLoadState(e),...t};return this.set(e,r),r}canLoadMore(e){const t=this.getLoadState(e);return t&&!t.isLoading&&t.lastEventTime}updateLoadProgress(e,t){const r=this.getLoadState(e);return r.currentCount+=t,this.updateLoadState(e,{currentCount:r.currentCount}),r.currentCount}}class tg extends Ft{setZapInfo(e,t){this.set(e,t)}getZapInfo(e){return this.get(e)}clearZapInfo(e){this.delete(e)}}class ng extends Uo{setImage(e,t){e&&t&&this.set(e,{image:t,timestamp:Date.now()})}getImage(e){return this.get(e)?.image}hasImage(e){return this.has(e)}clearExpired(e=36e5){const t=Date.now();for(const[r,o]of this.cache.entries())t-o.timestamp>e&&this.delete(r)}}class rg extends Uo{#e=new Map;setNip05(e,t){e&&this.set(e,{value:t,timestamp:Date.now(),verified:!0})}getNip05(e){return this.get(e)?.value}setPendingVerification(e,t){this.#e.set(e,t)}getPendingVerification(e){return this.#e.get(e)}deletePendingVerification(e){this.#e.delete(e)}clearPendingVerifications(){this.#e.clear()}clear(){super.clear(),this.clearPendingVerifications()}}class rr{static#e=null;#t=null;#n={};constructor(){if(rr.#e)return rr.#e;this.profileCache=new Uo,this.zapEventCache=new Q0,this.referenceCache=new Y0,this.statsCache=new X0,this.decodedCache=new J0,this.loadStateCache=new eg,this.zapInfoCache=new tg,this.imageCache=new ng,this.nip05Cache=new rg,this.nip05PendingCache=new Ft,this.#n=["zapInfo","uiComponent","decoded","nip05","nip05PendingFetches","zapLoadStates","imageCache","isEventIdentifier"].reduce(((e,t)=>(e[t]=new Ft,e)),{}),this.viewStats=new Map,this.viewStates=new Map,rr.#e=this}setProfile(e,t){return this.profileCache.setProfile(e,t)}getProfile(e){return this.profileCache.get(e)}subscribeToProfileUpdates(e){return this.profileCache.subscribe(e)}initializeZapView(e){return this.zapEventCache.initializeView(e)}getZapEvents(e){return this.zapEventCache.getEvents(e)}setZapEvents(e,t,r){return this.zapEventCache.setEvents(e,t,r)}addZapEvent(e,t){return this.zapEventCache.addEvent(e,t)}getZapViewState(e){return this.zapEventCache.getViewState(e)}updateZapViewState(e,t){return this.zapEventCache.updateViewState(e,t)}setReference(e,t){return this.referenceCache.set(e,t)}getReference(e){return this.referenceCache.get(e)}getOrFetchReference(e,t){return this.referenceCache.getOrFetch(e,t)}getReferenceComponent(e){return this.referenceCache.getComponent(e)}setReferenceComponent(e,t){return this.referenceCache.setComponent(e,t)}getCachedStats(e,t){return this.statsCache.getCached(e,t)}updateStatsCache(e,t,r){this.statsCache.setCached(e,t,r),this.statsCache.updateViewStats(e,r)}getViewStats(e){return this.statsCache.getViewStats(e)}setNoZapsState(e,t){return this.statsCache.setNoZapsState(e,t)}hasNoZaps(e){return this.statsCache.hasNoZaps(e)}async processCachedData(e,t){this.setRelayUrls(t.relayUrls);const r=this.getZapEvents(e),o=r.some((c=>this.getReference(c.id)));return{stats:(await Promise.all([this.getCachedStats(e,t.identifier)]))[0],hasEnoughCachedEvents:r.length>=Ae.REQ_CONFIG.INITIAL_LOAD_COUNT,hasReferences:o}}hasDecoded(e){return this.decodedCache.hasDecoded(e)}setDecoded(e,t){return this.decodedCache.setDecoded(e,t)}getDecoded(e){return this.decodedCache.getDecoded(e)}initializeLoadState(e){return this.loadStateCache.initializeLoadState(e)}getLoadState(e){return this.loadStateCache.getLoadState(e)}updateLoadState(e,t){return this.loadStateCache.updateLoadState(e,t)}canLoadMore(e){return this.loadStateCache.canLoadMore(e)}updateLoadProgress(e,t){return this.loadStateCache.updateLoadProgress(e,t)}setZapInfo(e,t){return this.zapInfoCache.setZapInfo(e,t)}getZapInfo(e){return this.zapInfoCache.getZapInfo(e)}clearZapInfo(e){return this.zapInfoCache.clearZapInfo(e)}setImageCache(e,t){return this.imageCache.setImage(e,t)}getImageCache(e){return this.imageCache.getImage(e)}hasImageCache(e){return this.imageCache.hasImage(e)}setNip05(e,t){return this.nip05Cache.setNip05(e,t)}getNip05(e){return this.nip05Cache.getNip05(e)}setNip05PendingFetch(e,t){this.nip05Cache.setPendingVerification(e,t)}getNip05PendingFetch(e){return this.nip05Cache.getPendingVerification(e)}deleteNip05PendingFetch(e){this.nip05Cache.deletePendingVerification(e)}getOrCreateViewState(e,t={}){return this.viewStates.has(e)||this.viewStates.set(e,{currentStats:null,...t}),this.viewStates.get(e)}getViewState(e){return this.getOrCreateViewState(e)}updateViewState(e,t){const r=this.getOrCreateViewState(e);return this.viewStates.set(e,{...r,...t}),this.viewStates.get(e)}setCacheItem(e,t,r){const o=this.#n[e];return o&&t!==void 0?o.set(t,r):null}getCacheItem(e,t){const r=this.#n[e];return r&&t!==void 0?r.get(t):null}setRelayUrls(e){this.#t=e}getRelayUrls(){return this.#t}clearAll(){this.profileCache.clear(),this.profileCache.clearSubscriptions(),this.zapEventCache.clear(),this.referenceCache.clear(),this.referenceCache.clearPendingFetches(),this.referenceCache.clearComponents(),this.statsCache.clear(),this.decodedCache.clear(),this.loadStateCache.clear(),this.zapInfoCache.clear(),this.imageCache.clear(),this.nip05Cache.clear(),this.nip05Cache.clearPendingVerifications(),Object.values(this.#n).forEach((e=>e.clear())),this.viewStats.clear(),this.viewStates.clear()}}const we=new rr,ga="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMDYuMzMgMjA2LjMzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICA8ZGVmcz4KICAgICAgPHN0eWxlPgogICAgICAgICAuY2xzLTEgewogICAgICAgICAgICBmaWxsOiBub25lOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTIgewogICAgICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTMgewogICAgICAgICAgICBmaWxsOiAjNjY2OwogICAgICAgICB9CiAgICAgIDwvc3R5bGU+CiAgIDwvZGVmcz4KICAgPHBhdGggY2xhc3M9ImNscy0yIgogICAgICBkPSJtMjA2LjMzIDEzNC4zOWMwIDIwLjcxIDAgMzEuMDctMy41MyA0Mi4yMi00LjQzIDEyLjE3LTE0LjAyIDIxLjc2LTI2LjE5IDI2LjE5LTExLjE1IDMuNTMtMjEuNSAzLjUzLTQyLjIyIDMuNTNoLTYyLjQ2Yy0yMC43MSAwLTMxLjA2IDAtNDIuMjEtMy41My0xMi4xNy00LjQzLTIxLjc2LTE0LjAyLTI2LjE5LTI2LjE5LTMuNTMtMTEuMTUtMy41My0yMS41LTMuNTMtNDIuMjJ2LTYyLjQ2YzAtMjAuNzEgMC0zMS4wNyAzLjUzLTQyLjIyIDQuNDMtMTIuMTcgMTQuMDItMjEuNzYgMjYuMTktMjYuMTkgMTEuMTUtMy41MiAyMS41LTMuNTIgNDIuMjEtMy41Mmg2Mi40NmMyMC43MSAwIDMxLjA3IDAgNDIuMjIgMy41MiAxMi4xNyA0LjQzIDIxLjc2IDE0LjAyIDI2LjE5IDI2LjE5IDMuNTMgMTEuMTUgMy41MyAyMS41IDMuNTMgNDIuMjJ6IiAvPgogICA8cGF0aCBjbGFzcz0iY2xzLTMiCiAgICAgIGQ9Im0xODUuOTggOTEuMXY4My4yM2MwIDMuMTMtMi41NCA1LjY3LTUuNjcgNS42N2gtNjguMDRjLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNS41YzAuMzEtMTkgMi4zMi0zNy4yIDYuNTQtNDUuNDggMi41My00Ljk4IDYuNy03LjY5IDExLjQ5LTkuMTQgOS4wNS0yLjcyIDI0LjkzLTAuODYgMzEuNjctMS4xOCAwIDAgMjAuMzYgMC44MSAyMC4zNi0xMC43MiAwLTkuMjgtOS4xLTguNTUtOS4xLTguNTUtMTAuMDMgMC4yNi0xNy42Ny0wLjQyLTIyLjYyLTIuMzctOC4yOS0zLjI2LTguNTctOS4yNC04LjYtMTEuMjQtMC40MS0yMy4xLTM0LjQ3LTI1Ljg3LTY0LjQ4LTIwLjE0LTMyLjgxIDYuMjQgMC4zNiA1My4yNyAwLjM2IDExNi4wNXY4LjM4Yy0wLjA2IDMuMDgtMi41NSA1LjU3LTUuNjUgNS41N2gtMzMuNjljLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNDMuOTVjMC0zLjEzIDIuNTQtNS42NyA1LjY3LTUuNjdoMzEuNjdjMy4xMyAwIDUuNjcgMi41NCA1LjY3IDUuNjcgMCA0LjY1IDUuMjMgNy4yNCA5LjAxIDQuNTMgMTEuMzktOC4xNiAyNi4wMS0xMi41MSA0Mi4zNy0xMi41MSAzNi42NSAwIDY0LjM2IDIxLjM2IDY0LjM2IDY4LjY5em0tNjAuODQtMTYuODljMC02LjctNS40My0xMi4xMy0xMi4xMy0xMi4xM3MtMTIuMTMgNS40My0xMi4xMyAxMi4xMyA1LjQzIDEyLjEzIDEyLjEzIDEyLjEzIDEyLjEzLTUuNDMgMTIuMTMtMTIuMTN6IiAvPgo8L3N2Zz4=",ig=n=>typeof n=="string"&&n.length>0,og=n=>{try{return window.NostrTools.nip19.decode(n)}catch{return null}},sg=(n,e,t)=>{const r={npub:()=>({kinds:[9735],"#p":[e]}),note:()=>({kinds:[9735],"#e":[e]}),nprofile:()=>({kinds:[9735],"#p":[e.pubkey]}),nevent:()=>({kinds:[9735],"#e":[e.id]}),naddr:()=>({kinds:[9735],"#a":[`${e.kind}:${e.pubkey}:${e.identifier}`]})}[n];if(!r)return null;const o=r();return o.limit=t?Ae.REQ_CONFIG.ADDITIONAL_LOAD_COUNT:Ae.REQ_CONFIG.INITIAL_LOAD_COUNT,t&&(o.until=t),{req:o}};function ya(n,e=null){const t=`${n}:${e}`;if(we.hasDecoded(t))return we.getDecoded(t);if(!ig(n))throw new Error(Ae.ZAP_CONFIG.ERRORS.DECODE_FAILED);const r=og(n);if(!r)return null;const o=sg(r.type,r.data,e);return o&&we.setDecoded(t,o),o}function Il(n){return n?.display_name||n?.name||"nameless"}async function ag(n,e){if(!n||!e)return null;try{return(await window.NostrTools.nip05.queryProfile(n))?.pubkey===e?n:null}catch{return null}}function Mr(n){return new Intl.NumberFormat().format(n)}function Cl(n){if(!n||typeof n!="string")return"unknown";try{return`${window.NostrTools.nip19.decode(n).type.toLowerCase()}1${n.slice(5,11)}...${n.slice(-4)}`}catch{return"unknown"}}function Mn(n){const e=document.createElement("div");return e.textContent=n,e.innerHTML}function cg(n){try{return window.NostrTools.nip19.npubEncode(n)}catch{return null}}function Un(n){if(!n||typeof n!="string")return!1;const e=`isEventIdentifier:${n}`,t=we.getCacheItem("isEventIdentifier",e);if(t!==void 0)return t;const r=n.startsWith("note1")||n.startsWith("nevent1")||n.startsWith("naddr1");return we.setCacheItem("isEventIdentifier",e,r),r}async function lg(n){const{pubkey:e,content:t}=(function(o){const c=o.tags.find((l=>l[0]==="description"))?.[1];if(!c)return{pubkey:null,content:""};try{const l=ug(c);let h;try{h=JSON.parse(l)}catch{const g=l.match(/"pubkey"\s*:\s*"([^"]+)"|"content"\s*:\s*"([^"]+)"/g);if(!g)throw new Error("Invalid JSON structure");h={},g.forEach((w=>{const[m,v]=w.split(":").map((L=>L.trim().replace(/"/g,"")));h[m]=v}))}let d=null;return h.pubkey&&(d=typeof h.pubkey=="string"?h.pubkey:String(h.pubkey)),{pubkey:d,content:typeof h.content=="string"?h.content.trim():""}}catch{return{pubkey:null,content:""}}})(n),r=await(async function(o){const c=o.tags.find((l=>l[0].toLowerCase()==="bolt11"))?.[1];if(!c)return"Amount: Unknown";try{const l=window.decodeBolt11(c),h=l.sections.find((d=>d.name==="amount"))?.value;return h?`${Mr(Math.floor(h/1e3))} sats`:"Amount: Unknown"}catch{return"Amount: Unknown"}})(n);return{pubkey:e,content:t,satsText:r}}function ma(n){try{return window.NostrTools.nip19.decode(n)}catch{return null}}function ug(n){return n.replace(/[\u0000-\u001F\u007F-\u009F]/g,"").replace(/\\\\/g,"\\").replace(/\\(?!(["\\\/bfnrt]|u[0-9a-fA-F]{4}))/g,"").replace(/\\+(["\\/bfnrt])/g,"\\$1").replace(/\\u(?![0-9a-fA-F]{4})/g,"")}class hg{constructor(e){this.root=e}displayStats(e){requestAnimationFrame((()=>{const t=this.root?.querySelector(".zap-stats");if(t)try{let r;r=e?e.skeleton?this.#e():e.error?this.createTimeoutStats():this.createNormalStats(e):this.createTimeoutStats(),t.innerHTML=r}catch{t.innerHTML=this.createTimeoutStats()}}))}#e(){return`
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number skeleton">...</span></div>
      <div class="stats-item">sats</div>
    `}createTimeoutStats(){return`
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number text-muted">nostr.band</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number text-muted">Stats</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number text-muted">Unavailable</span></div>
      <div class="stats-item">sats</div>
    `}createNormalStats(e){return`
      <div class="stats-item">Total Count</div>
      <div class="stats-item"><span class="number">${Mr(e.count)}</span></div>
      <div class="stats-item">times</div>
      <div class="stats-item">Total Amount</div>
      <div class="stats-item"><span class="number">${Mr(Math.floor(e.msats/1e3))}</span></div>
      <div class="stats-item">sats</div>
      <div class="stats-item">Max Amount</div>
      <div class="stats-item"><span class="number">${Mr(Math.floor(e.maxMsats/1e3))}</span></div>
      <div class="stats-item">sats</div>
    `}}class Do{constructor(e={}){this._validateOptions(e),this._initializeProperties(e)}_validateOptions(e){if(!e.pool?.ensureRelay)throw new Error("Invalid pool object: ensureRelay method is required")}_initializeProperties(e){this.pool=e.pool,this.batchSize=e.batchSize||Ae.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_SIZE,this.batchDelay=e.batchDelay||Ae.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_DELAY,this.relayUrls=e.relayUrls||Ae.BATCH_PROCESSOR_CONFIG.DEFAULT_RELAY_URLS,this.batchQueue=new Set,this.pendingFetches=new Map,this.resolvers=new Map,this.processingItems=new Set,this.batchTimer=null,this.eventCache=new Map,this.maxCacheAge=e.maxCacheAge||Ae.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE}getOrCreateFetchPromise(e){if(this.pendingFetches.has(e))return this.pendingFetches.get(e);const t=new Promise((r=>{this.resolvers.set(e,r)}));return this.pendingFetches.set(e,t),this.batchQueue.add(e),this._scheduleBatchProcess(),t}_scheduleBatchProcess(){this.batchTimer||(this.batchTimer=setTimeout((()=>{this.batchTimer=null,this._processBatchQueue()}),this.batchDelay))}async _processBatchQueue(){if(this.batchQueue.size===0)return;const e=this._getBatchItems();await this._processBatch(e),this.batchQueue.size>0&&this._scheduleBatchProcess()}_getBatchItems(){const e=Array.from(this.batchQueue).slice(0,this.batchSize);return e.forEach((t=>{this.batchQueue.delete(t),this.processingItems.add(t)})),e}async _processBatch(e){try{await this.onBatchProcess(e)}catch(t){this._handleBatchError(e,t)}finally{this._cleanupBatchItems(e)}}_handleBatchError(e,t){e.forEach((r=>this.resolveItem(r,null)))}_cleanupBatchItems(e){e.forEach((t=>{this.processingItems.delete(t),this.pendingFetches.delete(t),this.resolvers.delete(t)}))}resolveItem(e,t){const r=this.resolvers.get(e);r&&(r(t),this.resolvers.delete(e))}async onBatchProcess(e){throw new Error("onBatchProcess must be implemented by derived class")}onBatchError(e,t){e.forEach((r=>this.resolveItem(r,null)))}_cleanup(e,t,r,o){clearTimeout(e),t&&t.close(),r.forEach((c=>{!o.has(c)&&this.resolvers.has(c)&&this.resolveItem(c,null)}))}_getSubscriptionPool(){return this.pool}async _createSubscriptionPromise(e,t,r,o){if(t?.length)return new Promise((c=>{const l=new Set,h=Ae.BATCH_PROCESSOR_CONFIG.TIMEOUT_DURATION;let d,g,w=!1;const m=()=>{w||(w=!0,d&&clearTimeout(d),g&&g.close(),e.forEach((v=>{l.has(v)||this.resolveItem(v,null)})),c())};g=this.pool.subscribeMany(t,r,{onevent:v=>{try{w||(o(v,l),l.size===e.length&&m())}catch{}},oneose:()=>{setTimeout(m,100)},onerror:v=>{}}),d=setTimeout((()=>{w||m()}),h)}));e.forEach((c=>this.resolveItem(c,null)))}setRelayUrls(e){this.relayUrls=Array.isArray(e)?e:[]}getCachedItem(e){const t=this.eventCache.get(e);return this._isValidCache(t)?t.event:(this.eventCache.delete(e),null)}_isValidCache(e){return!!e&&Date.now()-e.timestamp<=this.maxCacheAge}setCachedItem(e,t){this.eventCache.set(e,{event:t,timestamp:Date.now()})}}class dg extends Do{constructor(e={}){super(e)}async onBatchProcess(e){if(!e?.length)return;const t=[{ids:e.slice(0,this.batchSize)}];await this._createSubscriptionPromise(e,this.relayUrls,t,((r,o)=>{if(e.includes(r.id)){const c=this.getCachedItem(r.id);(!c||r.created_at>c.created_at)&&(this.setCachedItem(r.id,r),this.resolveItem(r.id,r),o.add(r.id))}}))}}class fg extends Do{constructor(e={}){super(e)}_parseAtagValue(e){const t=e.split(":");return t.length!==3?null:{kind:parseInt(t[0]),pubkey:t[1],identifier:t[2]}}async onBatchProcess(e){if(!e?.length)return;const t=[],r={kinds:[],authors:[],"#d":[]};if(e.slice(0,this.batchSize).forEach((c=>{const l=this._parseAtagValue(c);l?(r.kinds.push(l.kind),r.authors.push(l.pubkey),r["#d"].push(l.identifier),t.push(c)):this.resolveItem(c,null)})),t.length===0)return;const o=[r];await this._createSubscriptionPromise(t,this.relayUrls,o,((c,l)=>{const h=t.find((d=>{const g=this._parseAtagValue(d);return g&&c.kind===g.kind&&c.pubkey===g.pubkey&&c.tags.some((w=>w[0]==="d"&&w[1]===g.identifier))}));if(h){const d=this.getCachedItem(h);(!d||c.created_at>d.created_at)&&(this.setCachedItem(h,c),this.resolveItem(h,c),l.add(h))}}))}}class pg extends Do{constructor(e={}){const{simplePool:t,config:r}=e;super({pool:t,batchSize:r.BATCH_SIZE||Ae.PROFILE_CONFIG.BATCH_SIZE,batchDelay:r.BATCH_DELAY||Ae.PROFILE_CONFIG.BATCH_DELAY,relayUrls:r.RELAYS||Ae.PROFILE_CONFIG.RELAYS,maxCacheAge:Ae.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE}),this.config=r}async onBatchProcess(e){if(!this.config.RELAYS?.length)throw new Error("No relays configured for profile fetch");const t=e.filter((l=>{const h=this.getCachedItem(l);return!h||(this.resolveItem(l,h),!1)}));if(t.length===0)return;const r=[{kinds:[0],authors:t}],o=new Map,c=(l,h)=>{const d=o.get(l.pubkey);(!d||l.created_at>d.created_at)&&(o.set(l.pubkey,l),this.setCachedItem(l.pubkey,l)),h.add(l.pubkey)};try{await this._createSubscriptionPromise(t,this.config.RELAYS,r,c),t.forEach((l=>{const h=o.get(l);this.resolveItem(l,h||null)}))}catch(l){this.onBatchError(e,l)}}}var bn=Symbol("verified");function gg(n){if(!(n instanceof Object)||typeof n.kind!="number"||typeof n.content!="string"||typeof n.created_at!="number"||typeof n.pubkey!="string"||!n.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(n.tags))return!1;for(let e=0;e<n.tags.length;e++){let t=n.tags[e];if(!Array.isArray(t))return!1;for(let r=0;r<t.length;r++)if(typeof t[r]=="object")return!1}return!0}new TextDecoder("utf-8");var yg=new TextEncoder;function tr(n){n.indexOf("://")===-1&&(n="wss://"+n);let e=new URL(n);return e.pathname=e.pathname.replace(/\/+/g,"/"),e.pathname.endsWith("/")&&(e.pathname=e.pathname.slice(0,-1)),(e.port==="80"&&e.protocol==="ws:"||e.port==="443"&&e.protocol==="wss:")&&(e.port=""),e.searchParams.sort(),e.hash="",e.toString()}var mg=class{value;next=null;prev=null;constructor(n){this.value=n}},bg=class{first;last;constructor(){this.first=null,this.last=null}enqueue(n){const e=new mg(n);return this.last?this.last===this.first?(this.last=e,this.last.prev=this.first,this.first.next=e):(e.prev=this.last,this.last.next=e,this.last=e):(this.first=e,this.last=e),!0}dequeue(){if(!this.first)return null;if(this.first===this.last){const e=this.first;return this.first=null,this.last=null,e.value}const n=this.first;return this.first=n.next,n.value}};function qi(n){return Fe(xn(yg.encode((function(e){if(!gg(e))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])})(n))))}var Or=new class{generateSecretKey(){return St.utils.randomPrivateKey()}getPublicKey(n){return Fe(St.getPublicKey(n))}finalizeEvent(n,e){const t=n;return t.pubkey=Fe(St.getPublicKey(e)),t.id=qi(t),t.sig=Fe(St.sign(qi(t),e)),t[bn]=!0,t}verifyEvent(n){if(typeof n[bn]=="boolean")return n[bn];const e=qi(n);if(e!==n.id)return n[bn]=!1,!1;try{const t=St.verify(n.sig,e,n.pubkey);return n[bn]=t,t}catch{return n[bn]=!1,!1}}},wg=(Or.generateSecretKey,Or.getPublicKey,Or.finalizeEvent,Or.verifyEvent);function vg(n,e){if(n.ids&&n.ids.indexOf(e.id)===-1||n.kinds&&n.kinds.indexOf(e.kind)===-1||n.authors&&n.authors.indexOf(e.pubkey)===-1)return!1;for(let t in n)if(t[0]==="#"){let r=n[`#${t.slice(1)}`];if(r&&!e.tags.find((([o,c])=>o===t.slice(1)&&r.indexOf(c)!==-1)))return!1}return!(n.since&&e.created_at<n.since)&&!(n.until&&e.created_at>n.until)}async function Eg(){return new Promise((n=>{const e=new MessageChannel,t=()=>{e.port1.removeEventListener("message",t),n()};e.port1.addEventListener("message",t),e.port2.postMessage(0),e.port1.start()}))}var Tl,xg=n=>(n[bn]=!0,!0),Ll=class{url;_connected=!1;onclose=null;onnotice=n=>{};_onauth=null;baseEoseTimeout=4400;connectionTimeout=4400;publishTimeout=4400;openSubs=new Map;connectionTimeoutHandle;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;incomingMessageQueue=new bg;queueRunning=!1;challenge;serial=0;verifyEvent;_WebSocket;constructor(n,e){this.url=tr(n),this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation||WebSocket}static async connect(n,e){const t=new Ll(n,e);return await t.connect(),t}closeAllSubscriptions(n){for(let[e,t]of this.openSubs)t.close(n);this.openSubs.clear();for(let[e,t]of this.openEventPublishes)t.reject(new Error(n));this.openEventPublishes.clear();for(let[e,t]of this.openCountRequests)t.reject(new Error(n));this.openCountRequests.clear()}get connected(){return this._connected}async connect(){return this.connectionPromise||(this.challenge=void 0,this.connectionPromise=new Promise(((n,e)=>{this.connectionTimeoutHandle=setTimeout((()=>{e("connection timed out"),this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions("relay connection timed out")}),this.connectionTimeout);try{this.ws=new this._WebSocket(this.url)}catch(t){return void e(t)}this.ws.onopen=()=>{clearTimeout(this.connectionTimeoutHandle),this._connected=!0,n()},this.ws.onerror=t=>{e(t.message||"websocket error"),this._connected&&(this._connected=!1,this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions("relay connection errored"))},this.ws.onclose=async()=>{this._connected&&(this._connected=!1,this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions("relay connection closed"))},this.ws.onmessage=this._onmessage.bind(this)}))),this.connectionPromise}async runQueue(){for(this.queueRunning=!0;this.handleNext()!==!1;)await Eg();this.queueRunning=!1}handleNext(){const n=this.incomingMessageQueue.dequeue();if(!n)return!1;const e=(function(t){let r=t.slice(0,22).indexOf('"EVENT"');if(r===-1)return null;let o=t.slice(r+7+1).indexOf('"');if(o===-1)return null;let c=r+7+1+o,l=t.slice(c+1,80).indexOf('"');if(l===-1)return null;let h=c+1+l;return t.slice(c+1,h)})(n);if(e){const t=this.openSubs.get(e);if(!t)return;const r=(function(c,l){let h=l.length+3,d=c.indexOf(`"${l}":`)+h,g=c.slice(d).indexOf('"')+d+1;return c.slice(g,g+64)})(n,"id"),o=t.alreadyHaveEvent?.(r);if(t.receivedEvent?.(this,r),o)return}try{let t=JSON.parse(n);switch(t[0]){case"EVENT":{const r=this.openSubs.get(t[1]),o=t[2];return void(this.verifyEvent(o)&&(function(c,l){for(let h=0;h<c.length;h++)if(vg(c[h],l))return!0;return!1})(r.filters,o)&&r.onevent(o))}case"COUNT":{const r=t[1],o=t[2],c=this.openCountRequests.get(r);return void(c&&(c.resolve(o.count),this.openCountRequests.delete(r)))}case"EOSE":{const r=this.openSubs.get(t[1]);return r?void r.receivedEose():void 0}case"OK":{const r=t[1],o=t[2],c=t[3],l=this.openEventPublishes.get(r);return void(l&&(o?l.resolve(c):l.reject(new Error(c)),this.openEventPublishes.delete(r)))}case"CLOSED":{const r=t[1],o=this.openSubs.get(r);return o?(o.closed=!0,void o.close(t[2])):void 0}case"NOTICE":return void this.onnotice(t[1]);case"AUTH":return this.challenge=t[1],void this._onauth?.(t[1])}}catch{return}}async send(n){if(!this.connectionPromise)throw new Error("sending on closed connection");this.connectionPromise.then((()=>{this.ws?.send(n)}))}async auth(n){if(!this.challenge)throw new Error("can't perform auth, no challenge was received");const e=await n((function(r,o){return{kind:22242,created_at:Math.floor(Date.now()/1e3),tags:[["relay",r],["challenge",o]],content:""}})(this.url,this.challenge)),t=new Promise(((r,o)=>{this.openEventPublishes.set(e.id,{resolve:r,reject:o})}));return this.send('["AUTH",'+JSON.stringify(e)+"]"),t}async publish(n){const e=new Promise(((t,r)=>{this.openEventPublishes.set(n.id,{resolve:t,reject:r})}));return this.send('["EVENT",'+JSON.stringify(n)+"]"),setTimeout((()=>{const t=this.openEventPublishes.get(n.id);t&&(t.reject(new Error("publish timed out")),this.openEventPublishes.delete(n.id))}),this.publishTimeout),e}async count(n,e){this.serial++;const t=e?.id||"count:"+this.serial,r=new Promise(((o,c)=>{this.openCountRequests.set(t,{resolve:o,reject:c})}));return this.send('["COUNT","'+t+'",'+JSON.stringify(n).substring(1)),r}subscribe(n,e){const t=this.prepareSubscription(n,e);return t.fire(),t}prepareSubscription(n,e){this.serial++;const t=e.id||"sub:"+this.serial,r=new $g(this,t,n,e);return this.openSubs.set(t,r),r}close(){this.closeAllSubscriptions("relay connection closed by us"),this._connected=!1,this.ws?.close()}_onmessage(n){this.incomingMessageQueue.enqueue(n.data),this.queueRunning||this.runQueue()}},$g=class{relay;id;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oneose;onclose;eoseTimeout;eoseTimeoutHandle;constructor(n,e,t,r){this.relay=n,this.filters=t,this.id=e,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||n.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.onevent=r.onevent||(o=>{})}fire(){this.relay.send('["REQ","'+this.id+'",'+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(n="closed by caller"){!this.closed&&this.relay.connected&&(this.relay.send('["CLOSE",'+JSON.stringify(this.id)+"]"),this.closed=!0),this.relay.openSubs.delete(this.id),this.onclose?.(n)}},Ag=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;trustedRelayURLs=new Set;_WebSocket;constructor(n){this.verifyEvent=n.verifyEvent,this._WebSocket=n.websocketImplementation}async ensureRelay(n,e){n=tr(n);let t=this.relays.get(n);return t||(t=new Ll(n,{verifyEvent:this.trustedRelayURLs.has(n)?xg:this.verifyEvent,websocketImplementation:this._WebSocket}),e?.connectionTimeout&&(t.connectionTimeout=e.connectionTimeout),this.relays.set(n,t)),await t.connect(),t}close(n){n.map(tr).forEach((e=>{this.relays.get(e)?.close()}))}subscribeMany(n,e,t){return this.subscribeManyMap(Object.fromEntries(n.map((r=>[r,e]))),t)}subscribeManyMap(n,e){this.trackRelays&&(e.receivedEvent=(m,v)=>{let L=this.seenOn.get(v);L||(L=new Set,this.seenOn.set(v,L)),L.add(m)});const t=new Set,r=[],o=Object.keys(n).length,c=[];let l=m=>{c[m]=!0,c.filter((v=>v)).length===o&&(e.oneose?.(),l=()=>{})};const h=[];let d=(m,v)=>{l(m),h[m]=v,h.filter((L=>L)).length===o&&(e.onclose?.(h),d=()=>{})};const g=m=>{if(e.alreadyHaveEvent?.(m))return!0;const v=t.has(m);return t.add(m),v},w=Promise.all(Object.entries(n).map((async(m,v,L)=>{if(L.indexOf(m)!==v)return void d(v,"duplicate url");let C,[S,z]=m;S=tr(S);try{C=await this.ensureRelay(S,{connectionTimeout:e.maxWait?Math.max(.8*e.maxWait,e.maxWait-1e3):void 0})}catch(H){return void d(v,H?.message||String(H))}let F=C.subscribe(z,{...e,oneose:()=>l(v),onclose:H=>d(v,H),alreadyHaveEvent:g,eoseTimeout:e.maxWait});r.push(F)})));return{async close(){await w,r.forEach((m=>{m.close()}))}}}subscribeManyEose(n,e,t){const r=this.subscribeMany(n,e,{...t,oneose(){r.close()}});return r}async querySync(n,e,t){return new Promise((async r=>{const o=[];this.subscribeManyEose(n,[e],{...t,onevent(c){o.push(c)},onclose(c){r(o)}})}))}async get(n,e,t){e.limit=1;const r=await this.querySync(n,e,t);return r.sort(((o,c)=>c.created_at-o.created_at)),r[0]||null}publish(n,e){return n.map(tr).map((async(t,r,o)=>{if(o.indexOf(t)!==r)return Promise.reject("duplicate url");let c=await this.ensureRelay(t);return c.publish(e).then((l=>{if(this.trackRelays){let h=this.seenOn.get(e.id);h||(h=new Set,this.seenOn.set(e.id,h)),h.add(c)}return l}))}))}listConnectionStatus(){const n=new Map;return this.relays.forEach(((e,t)=>n.set(t,e.connected))),n}destroy(){this.relays.forEach((n=>n.close())),this.relays=new Map}};try{Tl=WebSocket}catch{}var Ol=class extends Ag{constructor(){super({verifyEvent:wg,websocketImplementation:Tl})}};class ir{static instance=null;#e;#t;#n=!0;#i;constructor(){return ir.instance?ir.instance:(this.#o(),ir.instance=this,this)}#o(){if(this.#e=Ae.PROFILE_CONFIG,this.#t=new Ol,!this.#t?.ensureRelay)throw new Error("Failed to initialize SimplePool");this.#i=new pg({simplePool:this.#t,config:{...this.#e,RELAYS:this.#e.RELAYS||[]}})}get isInitialized(){return this.#n}async fetchProfiles(e){if(!Array.isArray(e)||e.length===0)return[];const t=Date.now(),r=new Array(e.length),o=e.reduce(((c,l,h)=>{const d=we.getProfile(l);return this.#a(d,t)?r[h]=d:c.push({index:h,pubkey:l}),c}),[]);return o.length>0&&await this.#r(o,r,e),r}async processBatchProfiles(e){const t=this.#c(e);if(t.length!==0)try{await Promise.all([this.fetchProfiles(t),...t.map((r=>this.verifyNip05Async(r)))])}catch{}}async verifyNip05Async(e){const t=we.getNip05(e);if(t!==void 0)return t;const r=we.getNip05PendingFetch(e);if(r)return r;const o=this.#d(e);return we.setNip05PendingFetch(e,o),o}getNip05(e){return we.getNip05(e)}clearCache(){we.clearAll(),this.#i.clearPendingFetches()}#a(e,t){return e&&e._lastUpdated&&t-e._lastUpdated<18e5}#c(e){return[...new Set(e?.map((t=>t?.pubkey))?.filter((t=>t&&typeof t=="string"&&t.length===64)))]}async#r(e,t,r){if(!e.length)return;const o=Date.now(),c=e.filter((({pubkey:h})=>h&&typeof h=="string"&&h.length===64));if(c.length===0)return;const l=await Promise.all(c.map((({pubkey:h})=>this.#s(h,o))));c.forEach((({index:h},d)=>{h>=0&&h<t.length&&(t[h]=l[d],r[h]&&we.setProfile(r[h],l[d]))}))}async#s(e,t){if(!e||typeof e!="string"||e.length!==64)return this.#l();try{const r={kinds:[0],authors:[e],limit:1},o=await this.#i.getOrCreateFetchPromise(e,r);if(!o?.content)return this.#l();let c;try{c=JSON.parse(o.content)}catch{return this.#l()}return{...c,name:Il(c)||"nameless",_lastUpdated:t,_eventCreatedAt:o.created_at}}catch{return this.#l()}}async#d(e){try{const[t]=await this.fetchProfiles([e]);if(!t?.nip05)return we.setNip05(e,null),null;const r=await Promise.race([ag(t.nip05,e),new Promise(((c,l)=>setTimeout((()=>l(new Error("NIP-05 timeout"))),5e3)))]);if(!r)return we.setNip05(e,null),null;const o=Mn(r.startsWith("_@")?r.slice(1):r);return we.setNip05(e,o),o}catch{return we.setNip05(e,null),null}finally{we.deleteNip05PendingFetch(e)}}#l(){return{name:"anonymous",display_name:"anonymous"}}}const ur=new ir;class _g{async loadAndUpdate(e,t){if(e)try{const r=t.querySelector(".sender-name"),o=t.querySelector(".zap-placeholder-name"),c=t.querySelector(".sender-icon"),l=c?.querySelector(".zap-placeholder-icon"),h=t.querySelector(".sender-pubkey");let d=we.getProfile(e);const g=d?Il(d)||"nameless":"anonymous",w=d?.picture?(function(m){if(!m||typeof m!="string")return null;try{const v=new URL(m);return["http:","https:"].includes(v.protocol)?v.href:null}catch{return null}})(d.picture):null;this.#e(o,r,g),this.#n(l,c,w,g),this.#i(h,e)}catch{this.#o(t)}}#e(e,t,r){e?e.replaceWith(Object.assign(document.createElement("span"),{className:"sender-name",textContent:r})):t&&(t.textContent=r)}#t(e,t="anonymous user's icon"){const r=`https://robohash.org/${e}.png?set=set5&bgset=bg2&size=128x128`,o=we.getImageCache(r),c=Object.assign(document.createElement("img"),{alt:t,loading:"lazy",className:"profile-icon"});if(o)return c.src=r,c;const l=new Image;return l.onerror=()=>{c.src=ga,we.setImageCache(r,ga)},l.onload=()=>{we.setImageCache(r,l)},l.src=r,c.src=r,c}#n(e,t,r,o){if(e&&t){const c=l=>{e.remove();const h=t.querySelector("img"),d=t.querySelector("a");h&&h.remove(),d&&d.remove();const g=l==="robohash"?this.#t(t.closest("[data-pubkey]")?.dataset.pubkey,`${Mn(o)}'s icon`):Object.assign(document.createElement("img"),{src:l,alt:`${Mn(o)}'s icon`,loading:"lazy",className:"profile-icon"}),w=t.closest("[data-pubkey]")?.dataset.pubkey;if(w){const m=(function(L,C=[]){try{return window.NostrTools.nip19.nprofileEncode({pubkey:L,relays:C})}catch{return null}})(w),v=Object.assign(document.createElement("a"),{href:`https://njump.me/${m}`,target:"_blank",rel:"noopener noreferrer"});v.appendChild(g),t.appendChild(v)}else t.appendChild(g)};if(r){const l=new Image;l.onload=()=>{we.setImageCache(r,l),c(r)},l.onerror=()=>{c("robohash")},l.src=r}else c("robohash")}}#i(e,t){if(e&&!e.getAttribute("data-nip05-updated")){const r=ur.getNip05(t);r?(e.textContent=r,e.setAttribute("data-nip05-updated","true")):ur.verifyNip05Async(t).then((o=>{o&&(e.textContent=o,e.setAttribute("data-nip05-updated","true"))}))}}#o(e){const t=e.querySelector(".zap-placeholder-icon");if(t){const r=t.parentElement,o=e.closest("[data-pubkey]")?.dataset.pubkey;t.remove(),r.appendChild(this.#t(o))}}async updateProfileElement(e,t){if(!e||!t)return;const r=e.querySelector(".sender-icon img, .zap-placeholder-icon");if(r)if(t.picture){const c=document.createElement("img");c.alt=t.name||"Profile Picture",c.width=32,c.height=32,c.className="profile-icon",c.onerror=()=>{const l=e.getAttribute("data-pubkey");if(l){const h=this.#t(l,t.name||"anonymous user");c.parentElement&&c.parentElement.replaceChild(h,c)}},c.src=t.picture,r.parentElement&&r.parentElement.replaceChild(c,r)}else{const c=e.getAttribute("data-pubkey");if(c){const l=this.#t(c,t.name||"anonymous user");r.parentElement&&r.parentElement.replaceChild(l,r)}}const o=e.querySelector(".sender-name, .zap-placeholder-name");if(o&&(o.textContent=t.display_name||t.name||"anonymous",o.className="sender-name"),t.nip05){const c=e.getAttribute("data-pubkey");if(c){const l=e.querySelector('[data-nip05-target="true"]');l&&await this.updateNip05Display(c,l)}}}}class lt{static#e={1:"content",30023:"title",30030:"title",30009:"name",40:"content",42:"name",31990:"alt"};static#t={UI_COMPONENTS:"Failed to create UI components:",ZAP_ITEM:"Failed to create zap item HTML:",REFERENCE:"Reference component creation failed:"};static createUIComponents(e,t,r){try{const o=this.viewConfigs?.get(t),c=r||o?.identifier,l=Un(c)?null:this.#r(e);return{iconComponent:this.#n(),nameComponent:this.#d(e),pubkeyComponent:this.#l(e,c),referenceComponent:this.#f(l)}}catch{return this.#i()}}static#n(){return'<div class="zap-placeholder-icon skeleton"></div>'}static#i(){return{iconComponent:'<div class="zap-placeholder-icon skeleton"></div>',nameComponent:'<div class="zap-placeholder-name skeleton"></div>',pubkeyComponent:"",referenceComponent:""}}static createReferenceComponent(e){return this.#f(this.#r({reference:e}))}static addReferenceToElement(e,t){if(!this.#o(e,t))return;const r=e.querySelector(".zap-content");this.#a(r,t)}static#o(e,t){return e&&t&&e.querySelector(".zap-content")}static#a(e,t){e.querySelectorAll(".zap-reference").forEach((o=>o.remove()));const r=this.createReferenceComponent({reference:t});e.insertAdjacentHTML("beforeend",r)}static getDialogTemplate(){return`
      <dialog class="dialog">
        <h2 class="dialog-title"><a href="#" target="_blank"></a></h2>
        <button class="close-dialog-button">X</button>
        <div class="zap-stats"></div>
        <ul class="dialog-zap-list"></ul>
      </dialog>
    `}static createZapItemHTML(e,t,r,o){try{const c=this.createUIComponents(e,r,o);return this.#c(e,t,c)}catch{return""}}static createNoZapsMessageHTML(e){return`
      <div class="no-zaps-container">
        <div class="no-zaps-message">${e}</div>
      </div>
    `}static#c(e,t,r){const[o,c]=e.satsText.split(" "),l=(h=e.created_at,Math.floor(Date.now()/1e3)-h<86400);var h;return`
      <div class="zap-content">
        <div class="zap-sender${e.comment?" with-comment":""}" data-pubkey="${e.pubkey}">
          <div class="sender-icon${l?" is-new":""}">
            ${r.iconComponent}
          </div>
          <div class="sender-info">
            ${r.nameComponent}
            ${r.pubkeyComponent}
          </div>
          <div class="zap-amount ${t}"><span class="number">${o}</span> ${c}</div>
        </div>
        ${e.comment?`<div class="zap-details"><span class="zap-comment">${Mn(e.comment)}</span></div>`:""}
        ${r.referenceComponent}
      </div>
    `}static#r(e){if(!e)return null;if(this.#s(e))return e;if(e.reference&&typeof e.reference=="object"){if(e.reference.reference&&this.#s(e.reference.reference))return e.reference.reference;if(this.#s(e.reference))return e.reference}return null}static#s(e){return e&&typeof e=="object"&&"id"in e&&"tags"in e&&Array.isArray(e.tags)&&"content"in e&&"kind"in e}static#d({senderName:e}){return e?`<span class="sender-name">${Mn(e)}</span>`:'<div class="zap-placeholder-name skeleton"></div>'}static#l({pubkey:e,displayIdentifier:t,reference:r},o){const c=!Un(o),l=`class="sender-pubkey" data-pubkey="${e}"`;return r&&c?`<span ${l}>${t}</span>`:`<span ${l} data-nip05-target="true">${t}</span>`}static#f(e){if(!this.#s(e))return"";const t=e.id,r=we.getReferenceComponent(t);if(r)return r;try{const o=this.#g(e),c=this.#p(e),l=this.#u(o,c);return we.setReferenceComponent(t,l),l}catch{return""}}static#g(e){if(!e?.tags)return"";if(e.kind===31990)return this.#y(e)||"";const t=Array.isArray(e.tags)?e.tags.find((r=>Array.isArray(r)&&r[0]==="d")):null;return t?`https://njump.me/${(function(r,o,c,l=[]){try{return window.NostrTools.nip19.naddrEncode({kind:r,pubkey:o,identifier:c,relays:l})}catch{return null}})(e.kind,e.pubkey,t[1])}`:e.id?`https://njump.me/${(function(r,o,c,l=[]){try{return window.NostrTools.nip19.neventEncode({id:r,kind:o,pubkey:c,relays:l})}catch{return null}})(e.id,e.kind,e.pubkey)}`:""}static#y(e){const t=e.tags.filter((o=>o[0]==="r"));return(t.find((o=>!o.includes("source")))||t[0])?.[1]}static#p(e){if(!e)return"";const t=lt.#e[e.kind];if(t){const r=e.tags.find((o=>Array.isArray(o)&&o[0]===t));if(r&&r[1])return r[1]}if(e.kind===40)try{return JSON.parse(e.content).name||e.content}catch{}return e.content||""}static#u(e,t){return`
      <div class="zap-reference">
        <div class="reference-arrow">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aCBkPSJtNTYwLTEyMC01Ny01NyAxNDQtMTQzSDIwMHYtNDgwaDgwdjQwMGgzNjdMNTAzLTU0NGw1Ni01NyAyNDEgMjQxLTI0MCAyNDBaIiAvPg0KPC9zdmc+" alt="Reference" width="18" height="18" />
        </div>
        <div class="reference-text">${Mn(t)}</div>
        <a href="${e}" target="_blank" class="reference-link">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aA0KICAgICAgICBkPSJNNDQwLTI4MEgyODBxLTgzIDAtMTQxLjUtNTguNVQ4MC00ODBxMC04MyA1OC41LTE0MS41VDI4MC02ODBoMTYwdjgwSDI4MHEtNTAgMC04NSAzNXQtMzUgODVxMCA1MCAzNSA4NXQ4NSAzNWgxNjB2ODBaTTMyMC00NDB2LTgwaDMyMHY4MEgzMjBabTIwMCAxNjB2LTgwaDE2MHE1MCAwIDg1LTM1dDM1LTg1cTAtNTAtMzUtODV0LTg1LTM1SDUyMHYtODBoMTYwcTgzIDAgMTQxLjUgNTguNVQ4ODAtNDgwcTAgODMtNTguNSAxNDEuNVQ2ODAtMjgwSDUyMFoiIC8+DQo8L3N2Zz4=" alt="Quick Reference" width="16" height="16" />
        </a>
      </div>
    `}static ZapInfo=class{#h;constructor(e){this.#h=e}static async createFromEvent(e,t={}){return await new lt.ZapInfo(e).extractInfo(t)}static getAmountColorClass(e,t){return(t===void 0?Ae.ZAP_AMOUNT_CONFIG.DEFAULT_COLOR_MODE:t)?this.#m(e):Ae.ZAP_AMOUNT_CONFIG.DISABLED_CLASS}static#m(e){const{THRESHOLDS:t,DEFAULT_CLASS:r}=Ae.ZAP_AMOUNT_CONFIG;return t.find((o=>e>=o.value))?.className||r}async extractInfo(e={}){const t=this.#h.id,r=we.getZapInfo(t);if(r)return r.colorClass=lt.ZapInfo.getAmountColorClass(r.satsAmount,e.isColorModeEnabled),r;try{const{pubkey:c,content:l,satsText:h}=await lg(this.#h),d=parseInt(h.replace(/,/g,"").split(" ")[0],10),g=typeof c=="string"?c:null,w=this.#h.reference||null,m={satsText:h,satsAmount:d,comment:l||"",pubkey:g||"",created_at:this.#h.created_at,displayIdentifier:g?Cl(cg(g)):"anonymous",senderName:null,senderIcon:null,reference:w,colorClass:lt.ZapInfo.getAmountColorClass(d,e?.isColorModeEnabled)};return we.setZapInfo(t,m),m}catch{const l={satsText:"Amount: Unknown",satsAmount:0,comment:"",pubkey:"",created_at:this.#h.created_at,displayIdentifier:"anonymous",senderName:"anonymous",senderIcon:o,reference:null};return we.setZapInfo(t,l),l}var o}static async batchExtractInfo(e,t=!0){const r=new Map;return await Promise.all(e.map((async o=>{const c=new lt.ZapInfo(o),l=await c.extractInfo({isColorModeEnabled:t});r.set(o.id,l)}))),r}};static viewConfigs=new Map}class kg{constructor(e,t){this.viewId=e,this.config=t}async createListItem(e){const t=await lt.ZapInfo.createFromEvent(e,{isColorModeEnabled:this.config?.isColorModeEnabled}),r=document.createElement("li");return r.className=`zap-list-item ${t.colorClass}${t.comment?" with-comment":""}`,r.setAttribute("data-pubkey",t.pubkey),e?.id&&r.setAttribute("data-event-id",e.id),r.innerHTML=lt.createZapItemHTML(t,t.colorClass,this.viewId),r.setAttribute("data-timestamp",e.created_at.toString()),{li:r,zapInfo:t}}}class Sg{constructor(e,t,r,o){if(!e)throw new Error("shadowRoot is required");if(!o)throw new Error("config is required");this.shadowRoot=e,this.profileUI=t,this.viewId=r,this.config=o,this.itemBuilder=new kg(r,this.config),this.profileUpdateUnsubscribe=null,this.#g()}destroy(){this.profileUpdateUnsubscribe&&(this.profileUpdateUnsubscribe(),this.profileUpdateUnsubscribe=null);const e=this.#e(".dialog-zap-list");e&&(e.innerHTML="")}#e(e){return this.shadowRoot.querySelector(e)}getElementByEventId(e){return this.#e(`.zap-list-item[data-event-id="${e}"]`)}async#t(e){const t=this.#e(".dialog-zap-list");if(t)try{return this.#i(t),await e(t)}catch{t.children.length===0&&this.showNoZapsMessage()}}#n(e,t){const r=e.querySelector(".load-more-trigger");r&&r.remove(),Array.from(t.children).forEach((o=>{const c=o.getAttribute("data-event-id"),l=parseInt(o.getAttribute("data-timestamp"));let h=null;const d=Array.from(e.children);for(let g=0;g<d.length;g++)if(l>parseInt(d[g].getAttribute("data-timestamp"))){h=d[g];break}e.querySelector(`.zap-list-item[data-event-id="${c}"]`)||(h?e.insertBefore(o,h):e.appendChild(o))})),r&&e.appendChild(r)}#i(e){const t=e.querySelector(".no-zaps-message");t&&t.remove()}async#o(e,t){return this.#t((async r=>{const{li:o,zapInfo:c}=await this.itemBuilder.createListItem(e);return t(r,o),await this.#u(c.pubkey,o),{li:o,zapInfo:c}}))}async renderZapListFromCache(e){if(!e?.length)return we.setNoZapsState(this.viewId,!1),this.showNoZapsMessage();await this.#t((async t=>{const{initialBatch:r,remainingBatch:o}=this.#a(e),{fragment:c,profileUpdates:l}=await this.#c(r);this.#n(t,c),o.length>0?this.#r(o,t,l):await this.#p(l)}))}#a(e){const t=this.#m(e),r=Ae.DIALOG_CONFIG.ZAP_LIST.INITIAL_BATCH;return{initialBatch:t.slice(0,r),remainingBatch:t.slice(r)}}async#c(e){const t=document.createDocumentFragment(),r=[];for(const o of e){const{li:c,zapInfo:l}=await this.itemBuilder.createListItem(o);this.#b(o.id,c),t.appendChild(c),l.pubkey&&r.push({pubkey:l.pubkey,element:c})}return{fragment:t,profileUpdates:r}}#r(e,t,r){if(!e.length)return;const o=Ae.DIALOG_CONFIG.ZAP_LIST.REMAINING_BATCH;let c=0;const l=async()=>{if(c>=e.length)return void await this.#p(r);const h=e.slice(c,c+o);await this.#s(h,t,r),c+=o,setTimeout((()=>l()),0)};requestIdleCallback((()=>l()))}async#s(e,t,r){const o=document.createDocumentFragment();await Promise.all(e.map((async l=>{const{li:h,zapInfo:d}=await this.itemBuilder.createListItem(l);this.#b(l.id,h),o.appendChild(h),d.pubkey&&r.push({pubkey:d.pubkey,element:h})})));const c=t.querySelector(".load-more-trigger");c&&c.remove(),t.appendChild(o),c&&t.appendChild(c),await new Promise((l=>requestAnimationFrame(l)))}async prependZap(e){return this.#o(e,((t,r)=>t.prepend(r)))}async appendZap(e){return this.#o(e,((t,r)=>{const o=this.#f(t,e.created_at);o?t.insertBefore(r,o):t.appendChild(r)}))}async replacePlaceholderWithZap(e,t){const r=this.#e(`[data-index="${t}"]`);if(this.#w(r))try{const{zapInfo:o}=await this.itemBuilder.createListItem(e);this.#v(r,o,e.id),await this.#u(o.pubkey,r)}catch{r.remove()}}async showNoZapsMessage(){const e=this.#e(".dialog-zap-list");if(e){if(we.hasNoZaps(this.viewId))return void this.#l(e);await this.#d()||(this.#l(e),we.setNoZapsState(this.viewId,!0))}}async#d(){const e=this.config.noZapsDelay||Ae.DIALOG_CONFIG.DEFAULT_NO_ZAPS_DELAY;await new Promise((r=>setTimeout(r,e)));const t=we.getZapEvents(this.viewId);return!!t?.length&&(await this.renderZapListFromCache(t),!0)}#l(e){const t=this.config.noZapsMessage||Ae.DIALOG_CONFIG.NO_ZAPS_MESSAGE;e.innerHTML=lt.createNoZapsMessageHTML(t),e.style.minHeight=Ae.DIALOG_CONFIG.ZAP_LIST.MIN_HEIGHT}async batchUpdate(e,t={}){const r=this.#e(".dialog-zap-list");if(r)try{const o=new Map(Array.from(r.querySelectorAll(".zap-list-item")).map((g=>[g.getAttribute("data-event-id"),g]))),c=this.#m(e),l=Un(this.config.identifier),h=c.filter((g=>{const w=o.get(g.id);return l?!w:!w||g.reference&&!w.querySelector(".zap-reference")}));if(h.length===0&&!t.isFullUpdate)return;const d=document.createDocumentFragment();for(const g of h){const{li:w,zapInfo:m}=await this.itemBuilder.createListItem(g);!l&&g.reference&&this.updateZapReference(g),d.appendChild(w),m.pubkey&&await this.#u(m.pubkey,w)}this.#n(r,d)}catch{}}#f(e,t){return Array.from(e.children).find((r=>{const o=parseInt(r.getAttribute("data-timestamp")||"0");return t>o}))}updateZapReference(e){if(e?.id&&e?.reference)try{const t=this.getElementByEventId(e.id);if(!t)return;lt.addReferenceToElement(t,e.reference),we.setReference(e.id,e.reference)}catch{}}#g(){this.profileUpdateUnsubscribe=we.subscribeToProfileUpdates(this.#y.bind(this))}async#y(e,t){const r=this.shadowRoot.querySelectorAll(`[data-pubkey="${e}"]`);await Promise.allSettled(Array.from(r).map((o=>this.profileUI.updateProfileElement(o,t))))}async#p(e){const t=Ae.DIALOG_CONFIG.ZAP_LIST.PROFILE_BATCH;for(let r=0;r<e.length;r+=t){const o=e.slice(r,r+t);await Promise.all(o.map((({pubkey:c,element:l})=>this.#u(c,l)))),await new Promise((c=>requestAnimationFrame(c)))}}async#u(e,t){e&&await this.#h(e,t)}async#h(e,t){if(e&&t)try{await this.profileUI.loadAndUpdate(e,t)}catch{}}#m(e){return[...new Map(e.map((t=>[t.id,t]))).values()].sort(((t,r)=>r.created_at-t.created_at))}#b(e,t){if(Un(this.config.identifier))return;const r=we.getReference(e);r&&lt.addReferenceToElement(t,r)}#w(e){return e&&e.classList.contains("placeholder")}#v(e,t,r){const o=this.itemBuilder.getAmountColorClass(t.satsAmount);e.className=`zap-list-item ${o}${t.comment?" with-comment":""}`,e.setAttribute("data-pubkey",t.pubkey),e.setAttribute("data-event-id",r),e.innerHTML=lt.createZapItemHTML(t,o,this.viewId),e.removeAttribute("data-index")}}var Ig=et(0),Cg=et.n(Ig);const hr=new class{#e=new Map;#t=new Map;constructor(){}async getZapStats(n,e){const t=await this.#n(e,n);if(t)return t;const r=await this.fetchStats(n);return r&&we.updateStatsCache(e,n,r),r}async fetchStats(n){try{const e=await this._fetchFromApi(n);return this._formatStats(e)||this.createTimeoutError()}catch(e){return this.handleFetchError(e)}}createTimeoutError(){return{error:!0,timeout:!0}}handleFetchError(n){return{error:!0,timeout:n.message==="STATS_TIMEOUT"}}async _fetchFromApi(n){const e=ma(n);if(!e)return null;const t=`https://api.nostr.band/v0/stats/${e.type==="npub"||e.type==="nprofile"?"profile":"event"}/${n}`,r=new AbortController,o=setTimeout((()=>r.abort()),Ae.REQUEST_CONFIG.REQUEST_TIMEOUT);try{return await(await fetch(t,{signal:r.signal})).json()}catch(c){throw c.name==="AbortError"?new Error("STATS_TIMEOUT"):c}finally{clearTimeout(o)}}_formatStats(n){if(!n?.stats)return null;const e=Object.values(n.stats)[0];return e?{count:parseInt(e.zaps_received?.count||e.zaps?.count||0,10),msats:parseInt(e.zaps_received?.msats||e.zaps?.msats||0,10),maxMsats:parseInt(e.zaps_received?.max_msats||e.zaps?.max_msats||0,10)}:null}async initializeStats(n,e,t=!1){if(t&&this.displayStats({skeleton:!0},e),this.#t.has(e))return this.#t.get(e);if(ma(n)?.type==="naddr"){const c=this.createTimeoutError();return this.displayStats(c,e),this.#e.set(e,c),c}const o=(async()=>{try{const c=await this.getZapStats(n,e);return c&&(this.displayStats(c,e),this.#e.set(e,c)),c}catch{return null}finally{this.#t.delete(e)}})();return this.#t.set(e,o),o}async#n(n,e){const t=we.getCachedStats(n,e),r=Date.now();return t&&r-t.timestamp<Ae.REQUEST_CONFIG.CACHE_DURATION?t.stats:null}getCurrentStats(n){return this.#e.get(n)}async handleZapEvent(n,e,t){if(n?.isRealTimeEvent)try{const r=n.tags.find((d=>d[0].toLowerCase()==="bolt11"))?.[1],o=this.extractAmountFromBolt11(r);if(o<=0)return;const c=we.getViewStats(e),l={count:c?.count||0,msats:c?.msats||0,maxMsats:c?.maxMsats||0},h={count:l.count+1,msats:l.msats+o,maxMsats:Math.max(l.maxMsats,o)};we.updateStatsCache(e,t,h),this.#e.set(e,h),await this.displayStats(h,e),n.isStatsCalculated=!0,n.amountMsats=o}catch{}}extractAmountFromBolt11(n){try{const e=window.decodeBolt11(n);return parseInt(e.sections.find((t=>t.name==="amount"))?.value??"0",10)}catch{return 0}}async displayStats(n,e){try{await Lg(n,e)}catch{}}},vn=new class{#e;#t;#n;#i;#o;#a;#c;constructor(){this.#e=new Ol,this.#r(),this.#s()}#r(){this.#n=new Map,this.#i=new Map,this.#o=new Map,this.#t=!1}#s(){const n={pool:this.#e,batchSize:Ae.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_SIZE,batchDelay:Ae.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_DELAY};this.#a=new dg(n),this.#c=new fg(n)}#d(n){this.#n.has(n)||this.#n.set(n,{zap:null}),this.#i.has(n)||this.#i.set(n,{isZapClosed:!1})}#l(n,e,t,r){this.#n.get(n).zap=this.#e.subscribeMany(e.relayUrls,[t.req],r)}#f(n){return n&&n.id&&Array.isArray(n.tags)}#g(n,e){return n&&this.#o.delete(n),null}async connectToRelays(n){this.#t||([this.#a,this.#c].forEach((e=>e.setRelayUrls(n))),this.#t=!0)}subscribeToZaps(n,e,t,r){try{this.#y(t),this.#d(n),this.#i.get(n).isZapClosed=!1,this.#l(n,e,t,this.#p(r))}catch(o){this.#u("Subscription error",o)}}#y(n){if(!n?.req?.kinds||!Array.isArray(n.req.kinds))throw new Error("Invalid subscription settings")}async fetchReference(n,e,t){try{if(!this.#f(e))return null;const r=e.tags.find((d=>Array.isArray(d)&&d[0]===t));if(!r)return null;const o=t==="e"?r[1]:`${r[1]}`,c=we.getReference(o);if(c)return c;const l=this.#o.get(o);if(l)return l;const h=t==="e"?this.#a:this.#c;try{const d=await h.getOrCreateFetchPromise(o);return d&&we.setReference(o,d),this.#o.delete(o),d}finally{this.#o.delete(o)}}catch(r){return this.#g(e?.id,r)}}#p(n){const e=Math.floor(Date.now()/1e3);return{...n,onevent:t=>{t.isRealTimeEvent=t.created_at>=e,n.onevent(t)},oneose:n.oneose}}#u(n,e){throw e}get zapPool(){return this.#e}},{zapPool:Ug}=vn,Ct=new class{constructor(){this.viewConfigs=new Map,this.configStore=new Map,this.observers=new Map,this.#e=new Map,this.#t=new Map}#e;#t;setZapListUI(n){this.zapListUI=n}setViewConfig(n,e){this.viewConfigs.set(n,e),lt.viewConfigs.set(n,e),we.initializeZapView(n)}getViewConfig(n){return this.viewConfigs.get(n)}async updateEventReference(n,e){try{const t=this.getViewConfig(e);if(!t?.relayUrls?.length||Un(t?.identifier||""))return!1;const r=await this._fetchEventReference(n,t);return!!r&&(n.reference=r,!0)}catch{return!1}}async _fetchEventReference(n,e){const t=async()=>{if(!n?.tags||!Array.isArray(n.tags))return null;try{if(n.tags.find((c=>Array.isArray(c)&&c[0]==="a"))?.[1])return await vn.fetchReference(e.relayUrls,n,"a");const o=n.tags.find((c=>Array.isArray(c)&&c[0]==="e"));return o?.[1]&&/^[0-9a-f]{64}$/.test(o[1].toLowerCase())?await vn.fetchReference(e.relayUrls,n,"e"):null}catch{return null}};try{return await we.getOrFetchReference(n.id,t)}catch{return null}}async updateEventReferenceBatch(n,e){const t=this.getViewConfig(e);if(!t?.relayUrls?.length||Un(t?.identifier||""))return;const r=n.map((o=>this.updateEventReference(o,e)));await Promise.allSettled(r)}updateUIReferences(n){this.zapListUI&&n.forEach((e=>{e.reference&&this.zapListUI.updateZapReference(e)}))}async initializeSubscriptions(n,e){try{if(!this._isValidFilter(n))throw new Error("Invalid filter settings");const t=ya(n.identifier);if(!t)throw new Error(Ae.ZAP_CONFIG.ERRORS.DECODE_FAILED);this._initializeLoadState(e),this._showInitialLoadingSpinner(e);const{batchEvents:r,lastEventTime:o}=await this._collectInitialEvents(e,n,t);r?.length>0&&this._processBatchEvents(r,e).catch(console.error),await this.finalizeInitialization(e,o)}catch(t){throw t}}_showInitialLoadingSpinner(n){const e=this._getListElement(n);if(e){const t=this._createLoadTrigger();e.appendChild(t)}}async finalizeInitialization(n,e){const t=we.getZapEvents(n),r=this._getListElement(n),o=we.updateLoadState(n,{isInitialFetchComplete:!0,lastEventTime:e});await Promise.all([o,t.length===0?this.zapListUI?.showNoZapsMessage():null,t.length>=Ae.REQ_CONFIG.INITIAL_LOAD_COUNT?this.setupInfiniteScroll(n):null]),r?.querySelector(".load-more-trigger")?.remove()}_initializeLoadState(n){we.updateLoadState(n,{isInitialFetchComplete:!1,lastEventTime:null,isLoading:!1})}_isValidFilter(n){return n&&n.relayUrls&&Array.isArray(n.relayUrls)&&n.relayUrls.length>0&&n.identifier}setupInfiniteScroll(n){try{this._cleanupInfiniteScroll(n);const e=this._getListElement(n);if(!e)return;const t=this._createLoadTrigger();e.appendChild(t),this._observeLoadTrigger(t,n,e)}catch{}}_createLoadTrigger(){const n=document.createElement("div");n.className="load-more-trigger";const e=document.createElement("div");return e.className="loading-spinner",n.appendChild(e),n}_observeLoadTrigger(n,e,t){const r=new IntersectionObserver((o=>this._handleIntersection(o[0],e)),{root:t,rootMargin:Ae.INFINITE_SCROLL.ROOT_MARGIN,threshold:Ae.INFINITE_SCROLL.THRESHOLD});r.observe(n),this.observers.set(e,r)}async _handleIntersection(n,e){n.isIntersecting&&(we.getLoadState(e).isLoading?setTimeout((()=>{n.isIntersecting&&this._handleIntersection(n,e)}),Ae.INFINITE_SCROLL.RETRY_DELAY):this.loadMoreZaps(e).then((t=>{t===0&&this._cleanupInfiniteScroll(e)})).catch((t=>{this._cleanupInfiniteScroll(e)})))}_cleanupInfiniteScroll(n){const e=this.observers.get(n);if(!e)return;e.disconnect(),this._getListElement(n)?.querySelector(".load-more-trigger")?.remove(),this.observers.delete(n)}_getListElement(n){return document.querySelector(`nzv-dialog[data-view-id="${n}"]`)?.shadowRoot?.querySelector(".dialog-zap-list")}async loadMoreZaps(n){const e=we.getLoadState(n),t=this.getViewConfig(n);if(!this._canLoadMore(e,t))return 0;e.isLoading=!0;try{const r=await this._executeLoadMore(n,e,t);if(r>0){const o=we.getZapEvents(n).slice(-r);await this.updateEventReferenceBatch(o,n),this.updateUIReferences(o)}return r}finally{e.isLoading=!1}}async _executeLoadMore(n,e,t){const r=ya(t.identifier,e.lastEventTime);if(!r)return 0;const o=[],c=setTimeout((()=>{o.length===0&&this._cleanupInfiniteScroll(n)}),Ae.LOAD_TIMEOUT);try{return await this._collectEvents(n,t,r,o,Ae.REQ_CONFIG.ADDITIONAL_LOAD_COUNT,e),o.length>0&&await this._processBatchEvents(o,n),o.length}catch{return 0}finally{clearTimeout(c)}}async _collectEvents(n,e,t,r,o,c){return new Promise(((l,h)=>{const d=setTimeout((()=>h(new Error("Load timeout"))),Ae.LOAD_TIMEOUT);vn.subscribeToZaps(n,e,t,{onevent:g=>{g.created_at<c.lastEventTime&&(r.push(g),c.lastEventTime=Math.min(c.lastEventTime,g.created_at),r.length>=o&&(clearTimeout(d),l()))},oneose:()=>{clearTimeout(d),l()}})}))}async _collectInitialEvents(n,e,t){const r=[];let o=null;return new Promise((c=>{const l=this._setupBufferInterval(r,n),h=vn.subscribeToZaps(n,e,t,{onevent:d=>{const g=this._handleInitialEvent(d,r,o,n);g!==null&&(o=g)},oneose:()=>{clearInterval(l),c({batchEvents:[...r],lastEventTime:o})}});this.#e.set(n,{zap:h})}))}_handleInitialEvent(n,e,t,r){const o=Math.min(t||n.created_at,n.created_at);if(we.addZapEvent(r,n)){if(e.push(n),this.updateEventReference(n,r).then((c=>{c&&this.zapListUI&&n.reference&&this.zapListUI.updateZapReference(n)})),n.isRealTimeEvent){const c=this.getViewConfig(r);hr.handleZapEvent(n,r,c?.identifier),this.zapListUI&&this.zapListUI.prependZap(n).catch(console.error)}e.length>=Ae.BATCH_SIZE&&this.zapListUI&&this.zapListUI.batchUpdate(we.getZapEvents(r)).catch(console.error)}return o}async _processBatchEvents(n,e){if(n?.length){n.sort(((t,r)=>r.created_at-t.created_at)),n.forEach((t=>we.addZapEvent(e,t)));try{await Promise.all([ur.processBatchProfiles(n)])}catch{}await this._updateUI(n,e)}}async _updateUI(n,e){this.zapListUI&&await this.zapListUI.batchUpdate(n,{isFullUpdate:!0})}_setupBufferInterval(n,e){let t=0;const r=Ae.BUFFER_MIN_INTERVAL;return setInterval((()=>{const o=Date.now();n.length>0&&o-t>=r&&this.zapListUI&&(this.zapListUI.batchUpdate(we.getZapEvents(e),{isBufferUpdate:!0}).catch(console.error),t=o)}),Ae.BUFFER_INTERVAL)}_canLoadMore(n,e){return e&&!n.isLoading&&n.lastEventTime}unsubscribe(n){try{const e=this.#e.get(n);e?.zap&&(e.zap(),e.zap=null),this.#t.set(n,{isZapClosed:!0}),this._cleanupInfiniteScroll(n)}catch{}}};class Tg extends HTMLElement{#e;#t;constructor(){super(),this.attachShadow({mode:"open"}),this.#e={isInitialized:!1,theme:Ae.DEFAULT_OPTIONS.theme},this.popStateHandler=e=>{e.preventDefault(),this.#r(".dialog")?.open&&this.closeDialog()}}async connectedCallback(){if(this.viewId=this.getAttribute("data-view-id"),this.viewId){this.#t=this.#n();try{await this.#t,this.#e.isInitialized=!0;const e=Ct.getViewConfig(this.viewId);if(!e)throw new Error("Config is required for initialization");if(await this.#i(e),this.getAttribute("data-nzv-id")){const t=await hr.getCurrentStats(this.viewId);t&&this.statsUI.displayStats(t)}this.#e.isInitialized=!0,this.dispatchEvent(new CustomEvent("dialog-initialized",{detail:{viewId:this.viewId}}))}catch{}}}async#n(){return new Promise((e=>{const t=document.createElement("template");t.innerHTML=lt.getDialogTemplate(),this.shadowRoot.appendChild(t.content.cloneNode(!0)),this.#o(),queueMicrotask((()=>e()))}))}async#i(e){const t=document.createElement("style");t.textContent=Cg(),this.shadowRoot.appendChild(t),this.statsUI=new hg(this.shadowRoot),this.profileUI=new _g,this.zapListUI=new Sg(this.shadowRoot,this.profileUI,this.viewId,e),Ct.setZapListUI(this.zapListUI);const r=we.getZapEvents(this.viewId);r?.length?await this.zapListUI.renderZapListFromCache(r):this.zapListUI.showNoZapsMessage();const o=this.getAttribute("data-nzv-id");if(o){const c=await we.getCachedStats(this.viewId,o);if(c?.stats)this.statsUI.displayStats(c.stats);else{const l=await hr.getCurrentStats(this.viewId);l&&this.statsUI.displayStats(l)}}}static get observedAttributes(){return["data-theme"]}#o(){const e=this.#r(".dialog");this.#r(".close-dialog-button").addEventListener("click",(()=>this.closeDialog())),e.addEventListener("click",(t=>{t.target===e&&this.closeDialog()})),e.addEventListener("cancel",(t=>{t.preventDefault(),this.closeDialog()})),document.addEventListener("keydown",(t=>{if(e?.open){if(t.key==="Escape")this.closeDialog();else if(t.key===" "){t.preventDefault();const r=this.#r(".dialog-zap-list");r&&(r.scrollTop+=.8*r.clientHeight)}}}))}attributeChangedCallback(e,t,r){t!==r&&e==="data-theme"&&this.#a(r)}#a(e){we.updateThemeState(this.viewId,{theme:e}).isInitialized&&this.#c()}#c(){const e=we.getThemeState(this.viewId).theme==="dark"?"dark-theme":"light-theme";this.shadowRoot.host.classList.add(e)}async showDialog(){await this.#t;const e=this.#r(".dialog");e&&!e.open&&this.#e.isInitialized&&(window.addEventListener("popstate",this.popStateHandler),e.showModal(),queueMicrotask((()=>{document.activeElement&&document.activeElement.blur()})),this.#s())}closeDialog(){const e=this.#r(".dialog");e?.open&&(this.zapListUI?.destroy(),Ct.unsubscribe(this.viewId),e.close(),this.remove(),window.removeEventListener("popstate",this.popStateHandler))}displayZapStats(e){this.statsUI.displayStats(e)}#r(e){return this.shadowRoot.querySelector(e)}#s(){const e=this.getAttribute("data-view-id"),t=document.querySelector(`button[data-zap-view-id="${e}"]`);if(!t)return;const r=this.#r(".dialog-title"),o=this.#r(".dialog-title a");if(!o||!r)return;const c=t.getAttribute("data-title"),l=t.getAttribute("data-nzv-id");o.href=l?`https://njump.me/${l}`:"#",c?.trim()?(o.textContent=c,r.classList.add("custom-title")):(o.textContent=Ae.DIALOG_CONFIG.DEFAULT_TITLE+Cl(l),r.classList.remove("custom-title"))}getOperations(){if(!this.#e.isInitialized)return null;const e={closeDialog:()=>this.closeDialog(),showDialog:()=>this.showDialog()};return this.#e.isInitialized&&Object.assign(e,{prependZap:t=>this.zapListUI?.prependZap(t),displayZapStats:t=>this.statsUI?.displayStats(t),showNoZapsMessage:()=>this.zapListUI?.showNoZapsMessage()}),e}async waitForInitialization(){return this.#t}}customElements.define("nzv-dialog",Tg);const Pr={create:async(n,e)=>{if(!n||!e)return Promise.reject(new Error("Invalid viewId or config"));Ct.setViewConfig(n,e);const t=document.querySelector(`nzv-dialog[data-view-id="${n}"]`);if(t)return t;const r=document.createElement("nzv-dialog");r.setAttribute("data-view-id",n),r.setAttribute("data-config",JSON.stringify(e));const o=document.querySelector(`button[data-zap-view-id="${n}"]`);return o?.getAttribute("data-nzv-id")&&r.setAttribute("data-nzv-id",o.getAttribute("data-nzv-id")),document.body.appendChild(r),await r.waitForInitialization(),r},get:n=>document.querySelector(`nzv-dialog[data-view-id="${n}"]`),execute:(n,e,...t)=>{const r=Pr.get(n),o=r?.getOperations();return o?o[e]?.(...t)??null:null}},Lg=(n,e)=>Pr.execute(e,"displayZapStats",n);async function Og(n,e){try{const t=lr.fromButton(n);if(!t)throw new Error("Failed to create config from button");if(Ct.setViewConfig(e,t),!await(async function(o){try{const c=Ct.getViewConfig(o);if(!c)throw new Error(`View configuration not found for viewId: ${o}`);return Ct.setViewConfig(o,c),await Pr.create(o,c)}catch{return null}})(e))throw new Error(Ae.ZAP_CONFIG.ERRORS.DIALOG_NOT_FOUND);await(async function(o){try{const c=Pr.get(o);if(!c)throw new Error("Dialog not found");await c.waitForInitialization();const l=c.getOperations();if(!l?.showDialog)throw new Error("Basic dialog operations not available");l.showDialog()}catch{}})(e),setTimeout((async()=>{if(await(async function(o,c){const l=we.getZapEvents(o);if(l.length>0){const d=[...new Set(l.map((g=>g.pubkey)))];ur.fetchProfiles(d)}const{hasEnoughCachedEvents:h}=await we.processCachedData(o,c);return h&&Ct.setupInfiniteScroll(o),h})(e,t),!n.hasAttribute("data-initialized")){const o=n.getAttribute("data-nzv-id");await Promise.all([vn.connectToRelays(t.relayUrls),Ct.initializeSubscriptions(t,e),o?hr.initializeStats(o,e,!0):Promise.resolve()]),n.setAttribute("data-initialized","true")}}),0)}catch{}}function Ml(){Object.entries(Ae.LIBRARIES).forEach((([n,e])=>{window[n]=e})),document.querySelectorAll("button[data-nzv-id]").forEach(((n,e)=>{if(n.hasAttribute("data-zap-view-id"))return;const t=`nostr-zap-view-${e}`;n.setAttribute("data-zap-view-id",t),n.hasAttribute("data-zap-color-mode")||n.setAttribute("data-zap-color-mode",Ae.ZAP_CONFIG.DEFAULT_COLOR_MODE),n.addEventListener("click",(()=>Og(n,t)))}))}function Nl(n={}){Object.assign(Ae,n),typeof window<"u"&&Ml()}function Mg(n={}){return Nl(n)}typeof window<"u"&&document.addEventListener("DOMContentLoaded",Ml);Ot.vQ;Ot.ZM;Ot.yk;Ot.h0;Ot.n_;var Dg=Ot.Xz;Ot.Uv;Ot.fU;Ot.Dw;var ba={},wa;function Ng(){if(wa)return ba;wa=1;var n=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof Ks<"u"?Ks:{};function e(s){return s&&s.__esModule?s.default:s}var t={},r={},o=n.parcelRequire1faa;o==null&&(o=function(s){if(s in t)return t[s].exports;if(s in r){var i=r[s];delete r[s];var a={id:s,exports:{}};return t[s]=a,i.call(a.exports,a,a.exports),a.exports}var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u},o.register=function(i,a){r[i]=a},n.parcelRequire1faa=o),o.register("58QMB",function(s,i){(function(){function a(b,x){var O,U=Object.keys(x);for(O=0;O<U.length;O++)b=b.replace(new RegExp("\\{"+U[O]+"\\}","gi"),x[U[O]]);return b}function u(b){var x,O,U;if(!b)throw new Error("cannot create a random attribute name for an undefined object");x="ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",O="";do for(O="",U=0;U<12;U++)O+=x[Math.floor(Math.random()*x.length)];while(b[O]);return O}function f(b){var x={left:"start",right:"end",center:"middle",start:"start",end:"end"};return x[b]||x.start}function p(b){var x={alphabetic:"alphabetic",hanging:"hanging",top:"text-before-edge",bottom:"text-after-edge",middle:"central"};return x[b]||x.alphabetic}var E,y,N,P,B;B=(function(b,x){var O,U,q,J={};for(b=b.split(","),x=x||10,O=0;O<b.length;O+=2)U="&"+b[O+1]+";",q=parseInt(b[O],x),J[U]="&#"+q+";";return J["\\xa0"]="&#160;",J})("50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro",32),E={strokeStyle:{svgAttr:"stroke",canvas:"#000000",svg:"none",apply:"stroke"},fillStyle:{svgAttr:"fill",canvas:"#000000",svg:null,apply:"fill"},lineCap:{svgAttr:"stroke-linecap",canvas:"butt",svg:"butt",apply:"stroke"},lineJoin:{svgAttr:"stroke-linejoin",canvas:"miter",svg:"miter",apply:"stroke"},miterLimit:{svgAttr:"stroke-miterlimit",canvas:10,svg:4,apply:"stroke"},lineWidth:{svgAttr:"stroke-width",canvas:1,svg:1,apply:"stroke"},globalAlpha:{svgAttr:"opacity",canvas:1,svg:1,apply:"fill stroke"},font:{canvas:"10px sans-serif"},shadowColor:{canvas:"#000000"},shadowOffsetX:{canvas:0},shadowOffsetY:{canvas:0},shadowBlur:{canvas:0},textAlign:{canvas:"start"},textBaseline:{canvas:"alphabetic"},lineDash:{svgAttr:"stroke-dasharray",canvas:[],svg:null,apply:"stroke"}},N=function(b,x){this.__root=b,this.__ctx=x},N.prototype.addColorStop=function(b,x){var O,U,q=this.__ctx.__createElement("stop");q.setAttribute("offset",b),x.indexOf("rgba")!==-1?(O=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi,U=O.exec(x),q.setAttribute("stop-color",a("rgb({r},{g},{b})",{r:U[1],g:U[2],b:U[3]})),q.setAttribute("stop-opacity",U[4])):q.setAttribute("stop-color",x),this.__root.appendChild(q)},P=function(b,x){this.__root=b,this.__ctx=x},y=function(b){var x,O={width:500,height:500,enableMirroring:!1};if(arguments.length>1?(x=O,x.width=arguments[0],x.height=arguments[1]):x=b||O,!(this instanceof y))return new y(x);this.width=x.width||O.width,this.height=x.height||O.height,this.enableMirroring=x.enableMirroring!==void 0?x.enableMirroring:O.enableMirroring,this.canvas=this,this.__document=x.document||document,x.ctx?this.__ctx=x.ctx:(this.__canvas=this.__document.createElement("canvas"),this.__ctx=this.__canvas.getContext("2d")),this.__setDefaultStyles(),this.__stack=[this.__getStyleState()],this.__groupStack=[],this.__root=this.__document.createElementNS("http://www.w3.org/2000/svg","svg"),this.__root.setAttribute("version",1.1),this.__root.setAttribute("xmlns","http://www.w3.org/2000/svg"),this.__root.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),this.__root.setAttribute("width",this.width),this.__root.setAttribute("height",this.height),this.__ids={},this.__defs=this.__document.createElementNS("http://www.w3.org/2000/svg","defs"),this.__root.appendChild(this.__defs),this.__currentElement=this.__document.createElementNS("http://www.w3.org/2000/svg","g"),this.__root.appendChild(this.__currentElement)},y.prototype.__createElement=function(b,x,O){x===void 0&&(x={});var U,q,J=this.__document.createElementNS("http://www.w3.org/2000/svg",b),se=Object.keys(x);for(O&&(J.setAttribute("fill","none"),J.setAttribute("stroke","none")),U=0;U<se.length;U++)q=se[U],J.setAttribute(q,x[q]);return J},y.prototype.__setDefaultStyles=function(){var b,x,O=Object.keys(E);for(b=0;b<O.length;b++)x=O[b],this[x]=E[x].canvas},y.prototype.__applyStyleState=function(b){var x,O,U=Object.keys(b);for(x=0;x<U.length;x++)O=U[x],this[O]=b[O]},y.prototype.__getStyleState=function(){var b,x,O={},U=Object.keys(E);for(b=0;b<U.length;b++)x=U[b],O[x]=this[x];return O},y.prototype.__applyStyleToCurrentElement=function(b){var x=this.__currentElement,O=this.__currentElementsToStyle;O&&(x.setAttribute(b,""),x=O.element,O.children.forEach(function(Le){Le.setAttribute(b,"")}));var U,q,J,se,ie,fe,he=Object.keys(E);for(U=0;U<he.length;U++)if(q=E[he[U]],J=this[he[U]],q.apply){if(J instanceof P){if(J.__ctx)for(;J.__ctx.__defs.childNodes.length;)se=J.__ctx.__defs.childNodes[0].getAttribute("id"),this.__ids[se]=se,this.__defs.appendChild(J.__ctx.__defs.childNodes[0]);x.setAttribute(q.apply,a("url(#{id})",{id:J.__root.getAttribute("id")}))}else if(J instanceof N)x.setAttribute(q.apply,a("url(#{id})",{id:J.__root.getAttribute("id")}));else if(q.apply.indexOf(b)!==-1&&q.svg!==J)if(q.svgAttr!=="stroke"&&q.svgAttr!=="fill"||J.indexOf("rgba")===-1){var ue=q.svgAttr;if(he[U]==="globalAlpha"&&(ue=b+"-"+q.svgAttr,x.getAttribute(ue)))continue;x.setAttribute(ue,J)}else{ie=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi,fe=ie.exec(J),x.setAttribute(q.svgAttr,a("rgb({r},{g},{b})",{r:fe[1],g:fe[2],b:fe[3]}));var ge=fe[4],be=this.globalAlpha;be!=null&&(ge*=be),x.setAttribute(q.svgAttr+"-opacity",ge)}}},y.prototype.__closestGroupOrSvg=function(b){return b=b||this.__currentElement,b.nodeName==="g"||b.nodeName==="svg"?b:this.__closestGroupOrSvg(b.parentNode)},y.prototype.getSerializedSvg=function(b){var x,O,U,q,J,se,ie=new XMLSerializer().serializeToString(this.__root);if(se=/xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi,se.test(ie)&&(ie=ie.replace('xmlns="http://www.w3.org/2000/svg','xmlns:xlink="http://www.w3.org/1999/xlink')),b)for(x=Object.keys(B),O=0;O<x.length;O++)U=x[O],q=B[U],J=new RegExp(U,"gi"),J.test(ie)&&(ie=ie.replace(J,q));return ie},y.prototype.getSvg=function(){return this.__root},y.prototype.save=function(){var b=this.__createElement("g"),x=this.__closestGroupOrSvg();this.__groupStack.push(x),x.appendChild(b),this.__currentElement=b,this.__stack.push(this.__getStyleState())},y.prototype.restore=function(){this.__currentElement=this.__groupStack.pop(),this.__currentElementsToStyle=null,this.__currentElement||(this.__currentElement=this.__root.childNodes[1]);var b=this.__stack.pop();this.__applyStyleState(b)},y.prototype.__addTransform=function(b){var x=this.__closestGroupOrSvg();if(x.childNodes.length>0){this.__currentElement.nodeName==="path"&&(this.__currentElementsToStyle||(this.__currentElementsToStyle={element:x,children:[]}),this.__currentElementsToStyle.children.push(this.__currentElement),this.__applyCurrentDefaultPath());var O=this.__createElement("g");x.appendChild(O),this.__currentElement=O}var U=this.__currentElement.getAttribute("transform");U?U+=" ":U="",U+=b,this.__currentElement.setAttribute("transform",U)},y.prototype.scale=function(b,x){x===void 0&&(x=b),this.__addTransform(a("scale({x},{y})",{x:b,y:x}))},y.prototype.rotate=function(b){var x=180*b/Math.PI;this.__addTransform(a("rotate({angle},{cx},{cy})",{angle:x,cx:0,cy:0}))},y.prototype.translate=function(b,x){this.__addTransform(a("translate({x},{y})",{x:b,y:x}))},y.prototype.transform=function(b,x,O,U,q,J){this.__addTransform(a("matrix({a},{b},{c},{d},{e},{f})",{a:b,b:x,c:O,d:U,e:q,f:J}))},y.prototype.beginPath=function(){var b,x;this.__currentDefaultPath="",this.__currentPosition={},b=this.__createElement("path",{},!0),x=this.__closestGroupOrSvg(),x.appendChild(b),this.__currentElement=b},y.prototype.__applyCurrentDefaultPath=function(){var b=this.__currentElement;b.nodeName==="path"?b.setAttribute("d",this.__currentDefaultPath):console.error("Attempted to apply path command to node",b.nodeName)},y.prototype.__addPathCommand=function(b){this.__currentDefaultPath+=" ",this.__currentDefaultPath+=b},y.prototype.moveTo=function(b,x){this.__currentElement.nodeName!=="path"&&this.beginPath(),this.__currentPosition={x:b,y:x},this.__addPathCommand(a("M {x} {y}",{x:b,y:x}))},y.prototype.closePath=function(){this.__currentDefaultPath&&this.__addPathCommand("Z")},y.prototype.lineTo=function(b,x){this.__currentPosition={x:b,y:x},this.__currentDefaultPath.indexOf("M")>-1?this.__addPathCommand(a("L {x} {y}",{x:b,y:x})):this.__addPathCommand(a("M {x} {y}",{x:b,y:x}))},y.prototype.bezierCurveTo=function(b,x,O,U,q,J){this.__currentPosition={x:q,y:J},this.__addPathCommand(a("C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}",{cp1x:b,cp1y:x,cp2x:O,cp2y:U,x:q,y:J}))},y.prototype.quadraticCurveTo=function(b,x,O,U){this.__currentPosition={x:O,y:U},this.__addPathCommand(a("Q {cpx} {cpy} {x} {y}",{cpx:b,cpy:x,x:O,y:U}))};var D=function(b){var x=Math.sqrt(b[0]*b[0]+b[1]*b[1]);return[b[0]/x,b[1]/x]};y.prototype.arcTo=function(b,x,O,U,q){var J=this.__currentPosition&&this.__currentPosition.x,se=this.__currentPosition&&this.__currentPosition.y;if(J!==void 0&&se!==void 0){if(q<0)throw new Error("IndexSizeError: The radius provided ("+q+") is negative.");if(J===b&&se===x||b===O&&x===U||q===0)return void this.lineTo(b,x);var ie=D([J-b,se-x]),fe=D([O-b,U-x]);if(ie[0]*fe[1]==ie[1]*fe[0])return void this.lineTo(b,x);var he=ie[0]*fe[0]+ie[1]*fe[1],ue=Math.acos(Math.abs(he)),ge=D([ie[0]+fe[0],ie[1]+fe[1]]),be=q/Math.sin(ue/2),Le=b+be*ge[0],I=x+be*ge[1],T=[-ie[1],ie[0]],_=[fe[1],-fe[0]],R=function(ce){var te=ce[0];return ce[1]>=0?Math.acos(te):-Math.acos(te)},j=R(T),ne=R(_);this.lineTo(Le+T[0]*q,I+T[1]*q),this.arc(Le,I,q,j,ne)}},y.prototype.stroke=function(){this.__currentElement.nodeName==="path"&&this.__currentElement.setAttribute("paint-order","fill stroke markers"),this.__applyCurrentDefaultPath(),this.__applyStyleToCurrentElement("stroke")},y.prototype.fill=function(){this.__currentElement.nodeName==="path"&&this.__currentElement.setAttribute("paint-order","stroke fill markers"),this.__applyCurrentDefaultPath(),this.__applyStyleToCurrentElement("fill")},y.prototype.rect=function(b,x,O,U){this.__currentElement.nodeName!=="path"&&this.beginPath(),this.moveTo(b,x),this.lineTo(b+O,x),this.lineTo(b+O,x+U),this.lineTo(b,x+U),this.lineTo(b,x),this.closePath()},y.prototype.fillRect=function(b,x,O,U){var q,J;q=this.__createElement("rect",{x:b,y:x,width:O,height:U,"shape-rendering":"crispEdges"},!0),J=this.__closestGroupOrSvg(),J.appendChild(q),this.__currentElement=q,this.__applyStyleToCurrentElement("fill")},y.prototype.strokeRect=function(b,x,O,U){var q,J;q=this.__createElement("rect",{x:b,y:x,width:O,height:U},!0),J=this.__closestGroupOrSvg(),J.appendChild(q),this.__currentElement=q,this.__applyStyleToCurrentElement("stroke")},y.prototype.__clearCanvas=function(){for(var b=this.__closestGroupOrSvg(),x=b.getAttribute("transform"),O=this.__root.childNodes[1],U=O.childNodes,q=U.length-1;q>=0;q--)U[q]&&O.removeChild(U[q]);this.__currentElement=O,this.__groupStack=[],x&&this.__addTransform(x)},y.prototype.clearRect=function(b,x,O,U){if(b===0&&x===0&&O===this.width&&U===this.height)return void this.__clearCanvas();var q,J=this.__closestGroupOrSvg();q=this.__createElement("rect",{x:b,y:x,width:O,height:U,fill:"#FFFFFF"},!0),J.appendChild(q)},y.prototype.createLinearGradient=function(b,x,O,U){var q=this.__createElement("linearGradient",{id:u(this.__ids),x1:b+"px",x2:O+"px",y1:x+"px",y2:U+"px",gradientUnits:"userSpaceOnUse"},!1);return this.__defs.appendChild(q),new N(q,this)},y.prototype.createRadialGradient=function(b,x,O,U,q,J){var se=this.__createElement("radialGradient",{id:u(this.__ids),cx:U+"px",cy:q+"px",r:J+"px",fx:b+"px",fy:x+"px",gradientUnits:"userSpaceOnUse"},!1);return this.__defs.appendChild(se),new N(se,this)},y.prototype.__parseFont=function(){var b=/^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z0-9]+?)\s*$/i,x=b.exec(this.font),O={style:x[1]||"normal",size:x[4]||"10px",family:x[6]||"sans-serif",weight:x[3]||"normal",decoration:x[2]||"normal",href:null};return this.__fontUnderline==="underline"&&(O.decoration="underline"),this.__fontHref&&(O.href=this.__fontHref),O},y.prototype.__wrapTextLink=function(b,x){if(b.href){var O=this.__createElement("a");return O.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",b.href),O.appendChild(x),O}return x},y.prototype.__applyText=function(b,x,O,U){var q=this.__parseFont(),J=this.__closestGroupOrSvg(),se=this.__createElement("text",{"font-family":q.family,"font-size":q.size,"font-style":q.style,"font-weight":q.weight,"text-decoration":q.decoration,x,y:O,"text-anchor":f(this.textAlign),"dominant-baseline":p(this.textBaseline)},!0);se.appendChild(this.__document.createTextNode(b)),this.__currentElement=se,this.__applyStyleToCurrentElement(U),J.appendChild(this.__wrapTextLink(q,se))},y.prototype.fillText=function(b,x,O){this.__applyText(b,x,O,"fill")},y.prototype.strokeText=function(b,x,O){this.__applyText(b,x,O,"stroke")},y.prototype.measureText=function(b){return this.__ctx.font=this.font,this.__ctx.measureText(b)},y.prototype.arc=function(b,x,O,U,q,J){if(U!==q){U%=2*Math.PI,q%=2*Math.PI,U===q&&(q=(q+2*Math.PI-.001*(J?-1:1))%(2*Math.PI));var se=b+O*Math.cos(q),ie=x+O*Math.sin(q),fe=b+O*Math.cos(U),he=x+O*Math.sin(U),ue=J?0:1,ge=0,be=q-U;be<0&&(be+=2*Math.PI),ge=J?be>Math.PI?0:1:be>Math.PI?1:0,this.lineTo(fe,he),this.__addPathCommand(a("A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}",{rx:O,ry:O,xAxisRotation:0,largeArcFlag:ge,sweepFlag:ue,endX:se,endY:ie})),this.__currentPosition={x:se,y:ie}}},y.prototype.clip=function(){var b=this.__closestGroupOrSvg(),x=this.__createElement("clipPath"),O=u(this.__ids),U=this.__createElement("g");this.__applyCurrentDefaultPath(),b.removeChild(this.__currentElement),x.setAttribute("id",O),x.appendChild(this.__currentElement),this.__defs.appendChild(x),b.setAttribute("clip-path",a("url(#{id})",{id:O})),b.appendChild(U),this.__currentElement=U},y.prototype.drawImage=function(){var b,x,O,U,q,J,se,ie,fe,he,ue,ge,be,Le,I=Array.prototype.slice.call(arguments),T=I[0],_=0,R=0;if(I.length===3)b=I[1],x=I[2],q=T.width,J=T.height,O=q,U=J;else if(I.length===5)b=I[1],x=I[2],O=I[3],U=I[4],q=T.width,J=T.height;else{if(I.length!==9)throw new Error("Invalid number of arguments passed to drawImage: "+arguments.length);_=I[1],R=I[2],q=I[3],J=I[4],b=I[5],x=I[6],O=I[7],U=I[8]}se=this.__closestGroupOrSvg(),this.__currentElement;var j="translate("+b+", "+x+")";if(T instanceof y){if(ie=T.getSvg().cloneNode(!0),ie.childNodes&&ie.childNodes.length>1){for(fe=ie.childNodes[0];fe.childNodes.length;)Le=fe.childNodes[0].getAttribute("id"),this.__ids[Le]=Le,this.__defs.appendChild(fe.childNodes[0]);if(he=ie.childNodes[1]){var ne,ce=he.getAttribute("transform");ne=ce?ce+" "+j:j,he.setAttribute("transform",ne),se.appendChild(he)}}}else T.nodeName!=="CANVAS"&&T.nodeName!=="IMG"||(ue=this.__createElement("image"),ue.setAttribute("width",O),ue.setAttribute("height",U),ue.setAttribute("preserveAspectRatio","none"),ue.setAttribute("opacity",this.globalAlpha),(_||R||q!==T.width||J!==T.height)&&(ge=this.__document.createElement("canvas"),ge.width=O,ge.height=U,be=ge.getContext("2d"),be.drawImage(T,_,R,q,J,0,0,O,U),T=ge),ue.setAttribute("transform",j),ue.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",T.nodeName==="CANVAS"?T.toDataURL():T.originalSrc),se.appendChild(ue))},y.prototype.createPattern=function(b,x){var O,U=this.__document.createElementNS("http://www.w3.org/2000/svg","pattern"),q=u(this.__ids);return U.setAttribute("id",q),U.setAttribute("width",b.width),U.setAttribute("height",b.height),b.nodeName==="CANVAS"||b.nodeName==="IMG"?(O=this.__document.createElementNS("http://www.w3.org/2000/svg","image"),O.setAttribute("width",b.width),O.setAttribute("height",b.height),O.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",b.nodeName==="CANVAS"?b.toDataURL():b.getAttribute("src")),U.appendChild(O),this.__defs.appendChild(U)):b instanceof y&&(U.appendChild(b.__root.childNodes[1]),this.__defs.appendChild(U)),new P(U,this)},y.prototype.setLineDash=function(b){b&&b.length>0?this.lineDash=b.join(","):this.lineDash=null},y.prototype.drawFocusRing=function(){},y.prototype.createImageData=function(){},y.prototype.getImageData=function(){},y.prototype.putImageData=function(){},y.prototype.globalCompositeOperation=function(){},y.prototype.setTransform=function(){},typeof window=="object"&&(window.C2S=y),typeof s.exports=="object"&&(s.exports=y)})(),(function(){function a(I,T,_){this.mode=se.MODE_8BIT_BYTE,this.data=I,this.parsedData=[];for(var R=0,j=this.data.length;R<j;R++){var ne=[],ce=this.data.charCodeAt(R);T?ne[0]=ce:ce>65536?(ne[0]=240|(1835008&ce)>>>18,ne[1]=128|(258048&ce)>>>12,ne[2]=128|(4032&ce)>>>6,ne[3]=128|63&ce):ce>2048?(ne[0]=224|(61440&ce)>>>12,ne[1]=128|(4032&ce)>>>6,ne[2]=128|63&ce):ce>128?(ne[0]=192|(1984&ce)>>>6,ne[1]=128|63&ce):ne[0]=ce,this.parsedData.push(ne)}this.parsedData=Array.prototype.concat.apply([],this.parsedData),_||this.parsedData.length==this.data.length||(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function u(I,T){this.typeNumber=I,this.errorCorrectLevel=T,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function f(I,T){if(I.length==B)throw new Error(I.length+"/"+T);for(var _=0;_<I.length&&I[_]==0;)_++;this.num=new Array(I.length-_+T);for(var R=0;R<I.length-_;R++)this.num[R]=I[R+_]}function p(I,T){this.totalCount=I,this.dataCount=T}function E(){this.buffer=[],this.length=0}function y(){var I=!1,T=navigator.userAgent;if(/android/i.test(T)){I=!0;var _=T.toString().match(/android ([0-9]\.[0-9])/i);_&&_[1]&&(I=parseFloat(_[1]))}return I}function N(I,T){for(var _=T.correctLevel,R=1,j=P(I),ne=0,ce=be.length;ne<ce;ne++){var te=0;switch(_){case ie.L:te=be[ne][0];break;case ie.M:te=be[ne][1];break;case ie.Q:te=be[ne][2];break;case ie.H:te=be[ne][3]}if(j<=te)break;R++}if(R>be.length)throw new Error("Too long data. the CorrectLevel."+["M","L","H","Q"][_]+" limit length is "+te);return T.version!=0&&(R<=T.version?(R=T.version,T.runVersion=R):(console.warn("QR Code version "+T.version+" too small, run version use "+R),T.runVersion=R)),R}function P(I){var T=encodeURI(I).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return T.length+(T.length!=I.length?3:0)}var B,D,b=typeof n=="object"&&n&&n.Object===Object&&n,x=typeof self=="object"&&self&&self.Object===Object&&self,O=b||x||Function("return this")(),U=i&&!i.nodeType&&i,q=U&&!0&&s&&!s.nodeType&&s,J=O.QRCode;a.prototype={getLength:function(I){return this.parsedData.length},write:function(I){for(var T=0,_=this.parsedData.length;T<_;T++)I.put(this.parsedData[T],8)}},u.prototype={addData:function(I,T,_){var R=new a(I,T,_);this.dataList.push(R),this.dataCache=null},isDark:function(I,T){if(I<0||this.moduleCount<=I||T<0||this.moduleCount<=T)throw new Error(I+","+T);return this.modules[I][T][0]},getEye:function(I,T){if(I<0||this.moduleCount<=I||T<0||this.moduleCount<=T)throw new Error(I+","+T);var _=this.modules[I][T];if(_[1]){var R="P"+_[1]+"_"+_[2];return _[2]=="A"&&(R="A"+_[1]),{isDark:_[0],type:R}}return null},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(I,T){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var _=0;_<this.moduleCount;_++){this.modules[_]=new Array(this.moduleCount);for(var R=0;R<this.moduleCount;R++)this.modules[_][R]=[]}this.setupPositionProbePattern(0,0,"TL"),this.setupPositionProbePattern(this.moduleCount-7,0,"BL"),this.setupPositionProbePattern(0,this.moduleCount-7,"TR"),this.setupPositionAdjustPattern("A"),this.setupTimingPattern(),this.setupTypeInfo(I,T),this.typeNumber>=7&&this.setupTypeNumber(I),this.dataCache==null&&(this.dataCache=u.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,T)},setupPositionProbePattern:function(I,T,_){for(var R=-1;R<=7;R++)if(!(I+R<=-1||this.moduleCount<=I+R))for(var j=-1;j<=7;j++)T+j<=-1||this.moduleCount<=T+j||(0<=R&&R<=6&&(j==0||j==6)||0<=j&&j<=6&&(R==0||R==6)||2<=R&&R<=4&&2<=j&&j<=4?(this.modules[I+R][T+j][0]=!0,this.modules[I+R][T+j][2]=_,this.modules[I+R][T+j][1]=R==-0||j==-0||R==6||j==6?"O":"I"):this.modules[I+R][T+j][0]=!1)},getBestMaskPattern:function(){for(var I=0,T=0,_=0;_<8;_++){this.makeImpl(!0,_);var R=he.getLostPoint(this);(_==0||I>R)&&(I=R,T=_)}return T},createMovieClip:function(I,T,_){var R=I.createEmptyMovieClip(T,_);this.make();for(var j=0;j<this.modules.length;j++)for(var ne=1*j,ce=0;ce<this.modules[j].length;ce++){var te=1*ce,M=this.modules[j][ce][0];M&&(R.beginFill(0,100),R.moveTo(te,ne),R.lineTo(te+1,ne),R.lineTo(te+1,ne+1),R.lineTo(te,ne+1),R.endFill())}return R},setupTimingPattern:function(){for(var I=8;I<this.moduleCount-8;I++)this.modules[I][6][0]==null&&(this.modules[I][6][0]=I%2==0);for(var T=8;T<this.moduleCount-8;T++)this.modules[6][T][0]==null&&(this.modules[6][T][0]=T%2==0)},setupPositionAdjustPattern:function(I){for(var T=he.getPatternPosition(this.typeNumber),_=0;_<T.length;_++)for(var R=0;R<T.length;R++){var j=T[_],ne=T[R];if(this.modules[j][ne][0]==null)for(var ce=-2;ce<=2;ce++)for(var te=-2;te<=2;te++)ce==-2||ce==2||te==-2||te==2||ce==0&&te==0?(this.modules[j+ce][ne+te][0]=!0,this.modules[j+ce][ne+te][2]=I,this.modules[j+ce][ne+te][1]=ce==-2||te==-2||ce==2||te==2?"O":"I"):this.modules[j+ce][ne+te][0]=!1}},setupTypeNumber:function(I){for(var T=he.getBCHTypeNumber(this.typeNumber),_=0;_<18;_++){var R=!I&&(T>>_&1)==1;this.modules[Math.floor(_/3)][_%3+this.moduleCount-8-3][0]=R}for(var _=0;_<18;_++){var R=!I&&(T>>_&1)==1;this.modules[_%3+this.moduleCount-8-3][Math.floor(_/3)][0]=R}},setupTypeInfo:function(I,T){for(var _=this.errorCorrectLevel<<3|T,R=he.getBCHTypeInfo(_),j=0;j<15;j++){var ne=!I&&(R>>j&1)==1;j<6?this.modules[j][8][0]=ne:j<8?this.modules[j+1][8][0]=ne:this.modules[this.moduleCount-15+j][8][0]=ne}for(var j=0;j<15;j++){var ne=!I&&(R>>j&1)==1;j<8?this.modules[8][this.moduleCount-j-1][0]=ne:j<9?this.modules[8][15-j-1+1][0]=ne:this.modules[8][15-j-1][0]=ne}this.modules[this.moduleCount-8][8][0]=!I},mapData:function(I,T){for(var _=-1,R=this.moduleCount-1,j=7,ne=0,ce=this.moduleCount-1;ce>0;ce-=2)for(ce==6&&ce--;;){for(var te=0;te<2;te++)if(this.modules[R][ce-te][0]==null){var M=!1;ne<I.length&&(M=(I[ne]>>>j&1)==1);var Me=he.getMask(T,R,ce-te);Me&&(M=!M),this.modules[R][ce-te][0]=M,j--,j==-1&&(ne++,j=7)}if((R+=_)<0||this.moduleCount<=R){R-=_,_=-_;break}}}},u.PAD0=236,u.PAD1=17,u.createData=function(I,T,_){for(var R=p.getRSBlocks(I,T),j=new E,ne=0;ne<_.length;ne++){var ce=_[ne];j.put(ce.mode,4),j.put(ce.getLength(),he.getLengthInBits(ce.mode,I)),ce.write(j)}for(var te=0,ne=0;ne<R.length;ne++)te+=R[ne].dataCount;if(j.getLengthInBits()>8*te)throw new Error("code length overflow. ("+j.getLengthInBits()+">"+8*te+")");for(j.getLengthInBits()+4<=8*te&&j.put(0,4);j.getLengthInBits()%8!=0;)j.putBit(!1);for(;!(j.getLengthInBits()>=8*te||(j.put(u.PAD0,8),j.getLengthInBits()>=8*te));)j.put(u.PAD1,8);return u.createBytes(j,R)},u.createBytes=function(I,T){for(var _=0,R=0,j=0,ne=new Array(T.length),ce=new Array(T.length),te=0;te<T.length;te++){var M=T[te].dataCount,Me=T[te].totalCount-M;R=Math.max(R,M),j=Math.max(j,Me),ne[te]=new Array(M);for(var Se=0;Se<ne[te].length;Se++)ne[te][Se]=255&I.buffer[Se+_];_+=M;var Pe=he.getErrorCorrectPolynomial(Me),Ee=new f(ne[te],Pe.getLength()-1),st=Ee.mod(Pe);ce[te]=new Array(Pe.getLength()-1);for(var Se=0;Se<ce[te].length;Se++){var nt=Se+st.getLength()-ce[te].length;ce[te][Se]=nt>=0?st.get(nt):0}}for(var Bt=0,Se=0;Se<T.length;Se++)Bt+=T[Se].totalCount;for(var ft=new Array(Bt),Ze=0,Se=0;Se<R;Se++)for(var te=0;te<T.length;te++)Se<ne[te].length&&(ft[Ze++]=ne[te][Se]);for(var Se=0;Se<j;Se++)for(var te=0;te<T.length;te++)Se<ce[te].length&&(ft[Ze++]=ce[te][Se]);return ft};for(var se={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},ie={L:1,M:0,Q:3,H:2},fe={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},he={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(I){for(var T=I<<10;he.getBCHDigit(T)-he.getBCHDigit(he.G15)>=0;)T^=he.G15<<he.getBCHDigit(T)-he.getBCHDigit(he.G15);return(I<<10|T)^he.G15_MASK},getBCHTypeNumber:function(I){for(var T=I<<12;he.getBCHDigit(T)-he.getBCHDigit(he.G18)>=0;)T^=he.G18<<he.getBCHDigit(T)-he.getBCHDigit(he.G18);return I<<12|T},getBCHDigit:function(I){for(var T=0;I!=0;)T++,I>>>=1;return T},getPatternPosition:function(I){return he.PATTERN_POSITION_TABLE[I-1]},getMask:function(I,T,_){switch(I){case fe.PATTERN000:return(T+_)%2==0;case fe.PATTERN001:return T%2==0;case fe.PATTERN010:return _%3==0;case fe.PATTERN011:return(T+_)%3==0;case fe.PATTERN100:return(Math.floor(T/2)+Math.floor(_/3))%2==0;case fe.PATTERN101:return T*_%2+T*_%3==0;case fe.PATTERN110:return(T*_%2+T*_%3)%2==0;case fe.PATTERN111:return(T*_%3+(T+_)%2)%2==0;default:throw new Error("bad maskPattern:"+I)}},getErrorCorrectPolynomial:function(I){for(var T=new f([1],0),_=0;_<I;_++)T=T.multiply(new f([1,ue.gexp(_)],0));return T},getLengthInBits:function(I,T){if(1<=T&&T<10)switch(I){case se.MODE_NUMBER:return 10;case se.MODE_ALPHA_NUM:return 9;case se.MODE_8BIT_BYTE:case se.MODE_KANJI:return 8;default:throw new Error("mode:"+I)}else if(T<27)switch(I){case se.MODE_NUMBER:return 12;case se.MODE_ALPHA_NUM:return 11;case se.MODE_8BIT_BYTE:return 16;case se.MODE_KANJI:return 10;default:throw new Error("mode:"+I)}else{if(!(T<41))throw new Error("type:"+T);switch(I){case se.MODE_NUMBER:return 14;case se.MODE_ALPHA_NUM:return 13;case se.MODE_8BIT_BYTE:return 16;case se.MODE_KANJI:return 12;default:throw new Error("mode:"+I)}}},getLostPoint:function(I){for(var T=I.getModuleCount(),_=0,R=0;R<T;R++)for(var j=0;j<T;j++){for(var ne=0,ce=I.isDark(R,j),te=-1;te<=1;te++)if(!(R+te<0||T<=R+te))for(var M=-1;M<=1;M++)j+M<0||T<=j+M||te==0&&M==0||ce==I.isDark(R+te,j+M)&&ne++;ne>5&&(_+=3+ne-5)}for(var R=0;R<T-1;R++)for(var j=0;j<T-1;j++){var Me=0;I.isDark(R,j)&&Me++,I.isDark(R+1,j)&&Me++,I.isDark(R,j+1)&&Me++,I.isDark(R+1,j+1)&&Me++,Me!=0&&Me!=4||(_+=3)}for(var R=0;R<T;R++)for(var j=0;j<T-6;j++)I.isDark(R,j)&&!I.isDark(R,j+1)&&I.isDark(R,j+2)&&I.isDark(R,j+3)&&I.isDark(R,j+4)&&!I.isDark(R,j+5)&&I.isDark(R,j+6)&&(_+=40);for(var j=0;j<T;j++)for(var R=0;R<T-6;R++)I.isDark(R,j)&&!I.isDark(R+1,j)&&I.isDark(R+2,j)&&I.isDark(R+3,j)&&I.isDark(R+4,j)&&!I.isDark(R+5,j)&&I.isDark(R+6,j)&&(_+=40);for(var Se=0,j=0;j<T;j++)for(var R=0;R<T;R++)I.isDark(R,j)&&Se++;return _+=Math.abs(100*Se/T/T-50)/5*10}},ue={glog:function(I){if(I<1)throw new Error("glog("+I+")");return ue.LOG_TABLE[I]},gexp:function(I){for(;I<0;)I+=255;for(;I>=256;)I-=255;return ue.EXP_TABLE[I]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},ge=0;ge<8;ge++)ue.EXP_TABLE[ge]=1<<ge;for(var ge=8;ge<256;ge++)ue.EXP_TABLE[ge]=ue.EXP_TABLE[ge-4]^ue.EXP_TABLE[ge-5]^ue.EXP_TABLE[ge-6]^ue.EXP_TABLE[ge-8];for(var ge=0;ge<255;ge++)ue.LOG_TABLE[ue.EXP_TABLE[ge]]=ge;f.prototype={get:function(I){return this.num[I]},getLength:function(){return this.num.length},multiply:function(I){for(var T=new Array(this.getLength()+I.getLength()-1),_=0;_<this.getLength();_++)for(var R=0;R<I.getLength();R++)T[_+R]^=ue.gexp(ue.glog(this.get(_))+ue.glog(I.get(R)));return new f(T,0)},mod:function(I){if(this.getLength()-I.getLength()<0)return this;for(var T=ue.glog(this.get(0))-ue.glog(I.get(0)),_=new Array(this.getLength()),R=0;R<this.getLength();R++)_[R]=this.get(R);for(var R=0;R<I.getLength();R++)_[R]^=ue.gexp(ue.glog(I.get(R))+T);return new f(_,0).mod(I)}},p.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],p.getRSBlocks=function(I,T){var _=p.getRsBlockTable(I,T);if(_==B)throw new Error("bad rs block @ typeNumber:"+I+"/errorCorrectLevel:"+T);for(var R=_.length/3,j=[],ne=0;ne<R;ne++)for(var ce=_[3*ne+0],te=_[3*ne+1],M=_[3*ne+2],Me=0;Me<ce;Me++)j.push(new p(te,M));return j},p.getRsBlockTable=function(I,T){switch(T){case ie.L:return p.RS_BLOCK_TABLE[4*(I-1)+0];case ie.M:return p.RS_BLOCK_TABLE[4*(I-1)+1];case ie.Q:return p.RS_BLOCK_TABLE[4*(I-1)+2];case ie.H:return p.RS_BLOCK_TABLE[4*(I-1)+3];default:return B}},E.prototype={get:function(I){var T=Math.floor(I/8);return(this.buffer[T]>>>7-I%8&1)==1},put:function(I,T){for(var _=0;_<T;_++)this.putBit((I>>>T-_-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(I){var T=Math.floor(this.length/8);this.buffer.length<=T&&this.buffer.push(0),I&&(this.buffer[T]|=128>>>this.length%8),this.length++}};var be=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],Le=(function(){return typeof CanvasRenderingContext2D<"u"})()?(function(){function I(){if(this._htOption.drawer=="svg"){var ne=this._oContext.getSerializedSvg(!0);this.dataURL=ne,this._el.innerHTML=ne}else try{var ce=this._elCanvas.toDataURL("image/png");this.dataURL=ce}catch(te){console.error(te)}this._htOption.onRenderingEnd&&(this.dataURL||console.error("Can not get base64 data, please check: 1. Published the page and image to the server 2. The image request support CORS 3. Configured `crossOrigin:'anonymous'` option"),this._htOption.onRenderingEnd(this._htOption,this.dataURL))}function T(ne,ce){var te=this;if(te._fFail=ce,te._fSuccess=ne,te._bSupportDataURI===null){var M=document.createElement("img"),Me=function(){te._bSupportDataURI=!1,te._fFail&&te._fFail.call(te)},Se=function(){te._bSupportDataURI=!0,te._fSuccess&&te._fSuccess.call(te)};return M.onabort=Me,M.onerror=Me,M.onload=Se,void(M.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")}te._bSupportDataURI===!0&&te._fSuccess?te._fSuccess.call(te):te._bSupportDataURI===!1&&te._fFail&&te._fFail.call(te)}if(O._android&&O._android<=2.1){var _=1/window.devicePixelRatio,R=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(ne,ce,te,M,Me,Se,Pe,Ee,st){if("nodeName"in ne&&/img/i.test(ne.nodeName))for(var nt=arguments.length-1;nt>=1;nt--)arguments[nt]=arguments[nt]*_;else Ee===void 0&&(arguments[1]*=_,arguments[2]*=_,arguments[3]*=_,arguments[4]*=_);R.apply(this,arguments)}}var j=function(ne,ce){this._bIsPainted=!1,this._android=y(),this._el=ne,this._htOption=ce,this._htOption.drawer=="svg"?(this._oContext={},this._elCanvas={}):(this._elCanvas=document.createElement("canvas"),this._el.appendChild(this._elCanvas),this._oContext=this._elCanvas.getContext("2d")),this._bSupportDataURI=null,this.dataURL=null};return j.prototype.draw=function(ne){function ce(){M.quietZone>0&&M.quietZoneColor&&(Ee.lineWidth=0,Ee.fillStyle=M.quietZoneColor,Ee.fillRect(0,0,st._elCanvas.width,M.quietZone),Ee.fillRect(0,M.quietZone,M.quietZone,st._elCanvas.height-2*M.quietZone),Ee.fillRect(st._elCanvas.width-M.quietZone,M.quietZone,M.quietZone,st._elCanvas.height-2*M.quietZone),Ee.fillRect(0,st._elCanvas.height-M.quietZone,st._elCanvas.width,M.quietZone))}function te(Bt){function ft(wt){var Ve=Math.round(M.width/3.5),ct=Math.round(M.height/3.5);Ve!==ct&&(Ve=ct),M.logoMaxWidth?Ve=Math.round(M.logoMaxWidth):M.logoWidth&&(Ve=Math.round(M.logoWidth)),M.logoMaxHeight?ct=Math.round(M.logoMaxHeight):M.logoHeight&&(ct=Math.round(M.logoHeight));var Yt,Xt;wt.naturalWidth===void 0?(Yt=wt.width,Xt=wt.height):(Yt=wt.naturalWidth,Xt=wt.naturalHeight),(M.logoMaxWidth||M.logoMaxHeight)&&(M.logoMaxWidth&&Yt<=Ve&&(Ve=Yt),M.logoMaxHeight&&Xt<=ct&&(ct=Xt),Yt<=Ve&&Xt<=ct&&(Ve=Yt,ct=Xt));var ki=(M.width+2*M.quietZone-Ve)/2,Si=(M.height+M.titleHeight+2*M.quietZone-ct)/2,Gs=Math.min(Ve/Yt,ct/Xt),Ii=Yt*Gs,Ci=Xt*Gs;(M.logoMaxWidth||M.logoMaxHeight)&&(Ve=Ii,ct=Ci,ki=(M.width+2*M.quietZone-Ve)/2,Si=(M.height+M.titleHeight+2*M.quietZone-ct)/2),M.logoBackgroundTransparent||(Ee.fillStyle=M.logoBackgroundColor,Ee.fillRect(ki,Si,Ve,ct));var Rd=Ee.imageSmoothingQuality,zd=Ee.imageSmoothingEnabled;Ee.imageSmoothingEnabled=!0,Ee.imageSmoothingQuality="high",Ee.drawImage(wt,ki+(Ve-Ii)/2,Si+(ct-Ci)/2,Ii,Ci),Ee.imageSmoothingEnabled=zd,Ee.imageSmoothingQuality=Rd,ce(),Tn._bIsPainted=!0,Tn.makeImage()}M.onRenderingStart&&M.onRenderingStart(M);for(var Ze=0;Ze<Me;Ze++)for(var at=0;at<Me;at++){var Qt=at*Se+M.quietZone,yn=Ze*Pe+M.quietZone,Xn=Bt.isDark(Ze,at),Ye=Bt.getEye(Ze,at),Ue=M.dotScale;Ee.lineWidth=0;var je,Xe;Ye?(je=M[Ye.type]||M[Ye.type.substring(0,2)]||M.colorDark,Xe=M.colorLight):M.backgroundImage?(Xe="rgba(0,0,0,0)",Ze==6?M.autoColor?(je=M.timing_H||M.timing||M.autoColorDark,Xe=M.autoColorLight):je=M.timing_H||M.timing||M.colorDark:at==6?M.autoColor?(je=M.timing_V||M.timing||M.autoColorDark,Xe=M.autoColorLight):je=M.timing_V||M.timing||M.colorDark:M.autoColor?(je=M.autoColorDark,Xe=M.autoColorLight):je=M.colorDark):(je=Ze==6?M.timing_H||M.timing||M.colorDark:at==6&&(M.timing_V||M.timing)||M.colorDark,Xe=M.colorLight),Ee.strokeStyle=Xn?je:Xe,Ee.fillStyle=Xn?je:Xe,Ye?(Ue=Ye.type=="AO"?M.dotScaleAO:Ye.type=="AI"?M.dotScaleAI:1,M.backgroundImage&&M.autoColor?(je=(Ye.type=="AO"?M.AI:M.AO)||M.autoColorDark,Xe=M.autoColorLight):je=(Ye.type=="AO"?M.AI:M.AO)||je,Xn=Ye.isDark,Ee.fillRect(Qt+Se*(1-Ue)/2,M.titleHeight+yn+Pe*(1-Ue)/2,Se*Ue,Pe*Ue)):Ze==6?(Ue=M.dotScaleTiming_H,Ee.fillRect(Qt+Se*(1-Ue)/2,M.titleHeight+yn+Pe*(1-Ue)/2,Se*Ue,Pe*Ue)):at==6?(Ue=M.dotScaleTiming_V,Ee.fillRect(Qt+Se*(1-Ue)/2,M.titleHeight+yn+Pe*(1-Ue)/2,Se*Ue,Pe*Ue)):(M.backgroundImage,Ee.fillRect(Qt+Se*(1-Ue)/2,M.titleHeight+yn+Pe*(1-Ue)/2,Se*Ue,Pe*Ue)),M.dotScale==1||Ye||(Ee.strokeStyle=M.colorLight)}if(M.title&&(Ee.fillStyle=M.titleBackgroundColor,Ee.fillRect(M.quietZone,M.quietZone,M.width,M.titleHeight),Ee.font=M.titleFont,Ee.fillStyle=M.titleColor,Ee.textAlign="center",Ee.fillText(M.title,this._elCanvas.width/2,+M.quietZone+M.titleTop)),M.subTitle&&(Ee.font=M.subTitleFont,Ee.fillStyle=M.subTitleColor,Ee.fillText(M.subTitle,this._elCanvas.width/2,+M.quietZone+M.subTitleTop)),M.logo){var Rt=new Image,Tn=this;Rt.onload=function(){ft(Rt)},Rt.onerror=function(wt){console.error(wt)},M.crossOrigin!=null&&(Rt.crossOrigin=M.crossOrigin),Rt.originalSrc=M.logo,Rt.src=M.logo}else ce(),this._bIsPainted=!0,this.makeImage()}var M=this._htOption,Me=ne.getModuleCount(),Se=Math.round(M.width/Me),Pe=Math.round((M.height-M.titleHeight)/Me);Se<=1&&(Se=1),Pe<=1&&(Pe=1),M.width=Se*Me,M.height=Pe*Me+M.titleHeight,M.quietZone=Math.round(M.quietZone),this._elCanvas.width=M.width+2*M.quietZone,this._elCanvas.height=M.height+2*M.quietZone,this._htOption.drawer!="canvas"&&(this._oContext=new C2S(this._elCanvas.width,this._elCanvas.height)),this.clear();var Ee=this._oContext;Ee.lineWidth=0,Ee.fillStyle=M.colorLight,Ee.fillRect(0,0,this._elCanvas.width,this._elCanvas.height),Ee.clearRect(M.quietZone,M.quietZone,M.width,M.titleHeight);var st=this;if(M.backgroundImage){var nt=new Image;nt.onload=function(){Ee.globalAlpha=1,Ee.globalAlpha=M.backgroundImageAlpha;var Bt=Ee.imageSmoothingQuality,ft=Ee.imageSmoothingEnabled;Ee.imageSmoothingEnabled=!0,Ee.imageSmoothingQuality="high",Ee.drawImage(nt,0,M.titleHeight,M.width+2*M.quietZone,M.height+2*M.quietZone-M.titleHeight),Ee.imageSmoothingEnabled=ft,Ee.imageSmoothingQuality=Bt,Ee.globalAlpha=1,te.call(st,ne)},M.crossOrigin!=null&&(nt.crossOrigin=M.crossOrigin),nt.originalSrc=M.backgroundImage,nt.src=M.backgroundImage}else te.call(st,ne)},j.prototype.makeImage=function(){this._bIsPainted&&T.call(this,I)},j.prototype.isPainted=function(){return this._bIsPainted},j.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},j.prototype.remove=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1,this._el.innerHTML=""},j.prototype.round=function(ne){return ne&&Math.floor(1e3*ne)/1e3},j})():(function(){var I=function(T,_){this._el=T,this._htOption=_};return I.prototype.draw=function(T){var _=this._htOption,R=this._el,j=T.getModuleCount(),ne=Math.round(_.width/j),ce=Math.round((_.height-_.titleHeight)/j);ne<=1&&(ne=1),ce<=1&&(ce=1),this._htOption.width=ne*j,this._htOption.height=ce*j+_.titleHeight,this._htOption.quietZone=Math.round(this._htOption.quietZone);var te=[],M="",Me=Math.round(ne*_.dotScale),Se=Math.round(ce*_.dotScale);Me<4&&(Me=4,Se=4);var Pe=_.colorDark,Ee=_.colorLight;if(_.backgroundImage){_.autoColor?(_.colorDark="rgba(0, 0, 0, .6);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#99000000', EndColorStr='#99000000');",_.colorLight="rgba(255, 255, 255, .7);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#B2FFFFFF', EndColorStr='#B2FFFFFF');"):_.colorLight="rgba(0,0,0,0)";var st='<div style="display:inline-block; z-index:-10;position:absolute;"><img src="'+_.backgroundImage+'" widht="'+(_.width+2*_.quietZone)+'" height="'+(_.height+2*_.quietZone)+'" style="opacity:'+_.backgroundImageAlpha+";filter:alpha(opacity="+100*_.backgroundImageAlpha+'); "/></div>';te.push(st)}if(_.quietZone&&(M="display:inline-block; width:"+(_.width+2*_.quietZone)+"px; height:"+(_.width+2*_.quietZone)+"px;background:"+_.quietZoneColor+"; text-align:center;"),te.push('<div style="font-size:0;'+M+'">'),te.push('<table  style="font-size:0;border:0;border-collapse:collapse; margin-top:'+_.quietZone+'px;" border="0" cellspacing="0" cellspadding="0" align="center" valign="middle">'),te.push('<tr height="'+_.titleHeight+'" align="center"><td style="border:0;border-collapse:collapse;margin:0;padding:0" colspan="'+j+'">'),_.title){var nt=_.titleColor,Bt=_.titleFont;te.push('<div style="width:100%;margin-top:'+_.titleTop+"px;color:"+nt+";font:"+Bt+";background:"+_.titleBackgroundColor+'">'+_.title+"</div>")}_.subTitle&&te.push('<div style="width:100%;margin-top:'+(_.subTitleTop-_.titleTop)+"px;color:"+_.subTitleColor+"; font:"+_.subTitleFont+'">'+_.subTitle+"</div>"),te.push("</td></tr>");for(var ft=0;ft<j;ft++){te.push('<tr style="border:0; padding:0; margin:0;" height="7">');for(var Ze=0;Ze<j;Ze++){var at=T.isDark(ft,Ze),Qt=T.getEye(ft,Ze);if(Qt){at=Qt.isDark;var yn=Qt.type,Xn=_[yn]||_[yn.substring(0,2)]||Pe;te.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+ne+"px;height:"+ce+'px;"><span style="width:'+ne+"px;height:"+ce+"px;background-color:"+(at?Xn:Ee)+';display:inline-block"></span></td>')}else{var Ye=_.colorDark;ft==6?(Ye=_.timing_H||_.timing||Pe,te.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+ne+"px;height:"+ce+"px;background-color:"+(at?Ye:Ee)+';"></td>')):Ze==6?(Ye=_.timing_V||_.timing||Pe,te.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+ne+"px;height:"+ce+"px;background-color:"+(at?Ye:Ee)+';"></td>')):te.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+ne+"px;height:"+ce+'px;"><div style="display:inline-block;width:'+Me+"px;height:"+Se+"px;background-color:"+(at?Ye:_.colorLight)+';"></div></td>')}}te.push("</tr>")}if(te.push("</table>"),te.push("</div>"),_.logo){var Ue=new Image;_.crossOrigin!=null&&(Ue.crossOrigin=_.crossOrigin),Ue.src=_.logo;var je=_.width/3.5,Xe=_.height/3.5;je!=Xe&&(je=Xe),_.logoWidth&&(je=_.logoWidth),_.logoHeight&&(Xe=_.logoHeight);var Rt="position:relative; z-index:1;display:table-cell;top:-"+((_.height-_.titleHeight)/2+Xe/2+_.quietZone)+"px;text-align:center; width:"+je+"px; height:"+Xe+"px;line-height:"+je+"px; vertical-align: middle;";_.logoBackgroundTransparent||(Rt+="background:"+_.logoBackgroundColor),te.push('<div style="'+Rt+'"><img  src="'+_.logo+'"  style="max-width: '+je+"px; max-height: "+Xe+'px;" /> <div style=" display: none; width:1px;margin-left: -1px;"></div></div>')}_.onRenderingStart&&_.onRenderingStart(_),R.innerHTML=te.join("");var Tn=R.childNodes[0],wt=(_.width-Tn.offsetWidth)/2,Ve=(_.height-Tn.offsetHeight)/2;wt>0&&Ve>0&&(Tn.style.margin=Ve+"px "+wt+"px"),this._htOption.onRenderingEnd&&this._htOption.onRenderingEnd(this._htOption,null)},I.prototype.clear=function(){this._el.innerHTML=""},I})();D=function(I,T){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:ie.H,dotScale:1,dotScaleTiming:1,dotScaleTiming_H:B,dotScaleTiming_V:B,dotScaleA:1,dotScaleAO:B,dotScaleAI:B,quietZone:0,quietZoneColor:"rgba(0,0,0,0)",title:"",titleFont:"normal normal bold 16px Arial",titleColor:"#000000",titleBackgroundColor:"#ffffff",titleHeight:0,titleTop:30,subTitle:"",subTitleFont:"normal normal normal 14px Arial",subTitleColor:"#4F4F4F",subTitleTop:60,logo:B,logoWidth:B,logoHeight:B,logoMaxWidth:B,logoMaxHeight:B,logoBackgroundColor:"#ffffff",logoBackgroundTransparent:!1,PO:B,PI:B,PO_TL:B,PI_TL:B,PO_TR:B,PI_TR:B,PO_BL:B,PI_BL:B,AO:B,AI:B,timing:B,timing_H:B,timing_V:B,backgroundImage:B,backgroundImageAlpha:1,autoColor:!1,autoColorDark:"rgba(0, 0, 0, .6)",autoColorLight:"rgba(255, 255, 255, .7)",onRenderingStart:B,onRenderingEnd:B,version:0,tooltip:!1,binary:!1,drawer:"canvas",crossOrigin:null,utf8WithoutBOM:!0},typeof T=="string"&&(T={text:T}),T)for(var _ in T)this._htOption[_]=T[_];this._htOption.title||this._htOption.subTitle||(this._htOption.titleHeight=0),(this._htOption.version<0||this._htOption.version>40)&&(console.warn("QR Code version '"+this._htOption.version+"' is invalidate, reset to 0"),this._htOption.version=0),(this._htOption.dotScale<0||this._htOption.dotScale>1)&&(console.warn(this._htOption.dotScale+" , is invalidate, dotScale must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScale=1),(this._htOption.dotScaleTiming<0||this._htOption.dotScaleTiming>1)&&(console.warn(this._htOption.dotScaleTiming+" , is invalidate, dotScaleTiming must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleTiming=1),this._htOption.dotScaleTiming_H?(this._htOption.dotScaleTiming_H<0||this._htOption.dotScaleTiming_H>1)&&(console.warn(this._htOption.dotScaleTiming_H+" , is invalidate, dotScaleTiming_H must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleTiming_H=1):this._htOption.dotScaleTiming_H=this._htOption.dotScaleTiming,this._htOption.dotScaleTiming_V?(this._htOption.dotScaleTiming_V<0||this._htOption.dotScaleTiming_V>1)&&(console.warn(this._htOption.dotScaleTiming_V+" , is invalidate, dotScaleTiming_V must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleTiming_V=1):this._htOption.dotScaleTiming_V=this._htOption.dotScaleTiming,(this._htOption.dotScaleA<0||this._htOption.dotScaleA>1)&&(console.warn(this._htOption.dotScaleA+" , is invalidate, dotScaleA must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleA=1),this._htOption.dotScaleAO?(this._htOption.dotScaleAO<0||this._htOption.dotScaleAO>1)&&(console.warn(this._htOption.dotScaleAO+" , is invalidate, dotScaleAO must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleAO=1):this._htOption.dotScaleAO=this._htOption.dotScaleA,this._htOption.dotScaleAI?(this._htOption.dotScaleAI<0||this._htOption.dotScaleAI>1)&&(console.warn(this._htOption.dotScaleAI+" , is invalidate, dotScaleAI must greater than 0, less than or equal to 1, now reset to 1. "),this._htOption.dotScaleAI=1):this._htOption.dotScaleAI=this._htOption.dotScaleA,(this._htOption.backgroundImageAlpha<0||this._htOption.backgroundImageAlpha>1)&&(console.warn(this._htOption.backgroundImageAlpha+" , is invalidate, backgroundImageAlpha must between 0 and 1, now reset to 1. "),this._htOption.backgroundImageAlpha=1),this._htOption.height=this._htOption.height+this._htOption.titleHeight,typeof I=="string"&&(I=document.getElementById(I)),(!this._htOption.drawer||this._htOption.drawer!="svg"&&this._htOption.drawer!="canvas")&&(this._htOption.drawer="canvas"),this._android=y(),this._el=I,this._oQRCode=null,this._htOption._element=I;var R={};for(var _ in this._htOption)R[_]=this._htOption[_];this._oDrawing=new Le(this._el,R),this._htOption.text&&this.makeCode(this._htOption.text)},D.prototype.makeCode=function(I){this._oQRCode=new u(N(I,this._htOption),this._htOption.correctLevel),this._oQRCode.addData(I,this._htOption.binary,this._htOption.utf8WithoutBOM),this._oQRCode.make(),this._htOption.tooltip&&(this._el.title=I),this._oDrawing.draw(this._oQRCode)},D.prototype.makeImage=function(){typeof this._oDrawing.makeImage=="function"&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},D.prototype.clear=function(){this._oDrawing.remove()},D.prototype.resize=function(I,T){this._oDrawing._htOption.width=I,this._oDrawing._htOption.height=T,this._oDrawing.draw(this._oQRCode)},D.prototype.noConflict=function(){return O.QRCode===this&&(O.QRCode=J),D},D.CorrectLevel=ie,q?((q.exports=D).QRCode=D,U.QRCode=D):O.QRCode=D}).call(this)});var c=o("58QMB");var l={};const h=BigInt(0),d=BigInt(1),g=BigInt(2),w=BigInt(3),m=BigInt(8),v=Object.freeze({a:h,b:BigInt(7),P:BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),n:BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),h:d,Gx:BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),Gy:BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),beta:BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")}),L=(s,i)=>(s+i/g)/i,C={beta:BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),splitScalar(s){const{n:i}=v,a=BigInt("0x3086d221a7d46bcde86c90e49284eb15"),u=-d*BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),f=BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),p=a,E=BigInt("0x100000000000000000000000000000000"),y=L(p*s,i),N=L(-u*s,i);let P=ae(s-y*a-N*f,i),B=ae(-y*u-N*p,i);const D=P>E,b=B>E;if(D&&(P=i-P),b&&(B=i-B),P>E||B>E)throw new Error("splitScalarEndo: Endomorphism failed, k="+s);return{k1neg:D,k1:P,k2neg:b,k2:B}}},S=32,z=32,F=32,H=S+1,ee=2*S+1;function oe(s){const{a:i,b:a}=v,u=ae(s*s),f=ae(u*s);return ae(f+i*s+a)}const W=v.a===h;class K extends Error{constructor(i){super(i)}}function Q(s){if(!(s instanceof G))throw new TypeError("JacobianPoint expected")}class G{constructor(i,a,u){this.x=i,this.y=a,this.z=u}static fromAffine(i){if(!(i instanceof A))throw new TypeError("JacobianPoint#fromAffine: expected Point");return i.equals(A.ZERO)?G.ZERO:new G(i.x,i.y,d)}static toAffineBatch(i){const a=Bl(i.map(u=>u.z));return i.map((u,f)=>u.toAffine(a[f]))}static normalizeZ(i){return G.toAffineBatch(i).map(G.fromAffine)}equals(i){Q(i);const{x:a,y:u,z:f}=this,{x:p,y:E,z:y}=i,N=ae(f*f),P=ae(y*y),B=ae(a*P),D=ae(p*N),b=ae(ae(u*y)*P),x=ae(ae(E*f)*N);return B===D&&b===x}negate(){return new G(this.x,ae(-this.y),this.z)}double(){const{x:i,y:a,z:u}=this,f=ae(i*i),p=ae(a*a),E=ae(p*p),y=i+p,N=ae(g*(ae(y*y)-f-E)),P=ae(w*f),B=ae(P*P),D=ae(B-g*N),b=ae(P*(N-D)-m*E),x=ae(g*a*u);return new G(D,b,x)}add(i){Q(i);const{x:a,y:u,z:f}=this,{x:p,y:E,z:y}=i;if(p===h||E===h)return this;if(a===h||u===h)return i;const N=ae(f*f),P=ae(y*y),B=ae(a*P),D=ae(p*N),b=ae(ae(u*y)*P),x=ae(ae(E*f)*N),O=ae(D-B),U=ae(x-b);if(O===h)return U===h?this.double():G.ZERO;const q=ae(O*O),J=ae(O*q),se=ae(B*q),ie=ae(U*U-J-g*se),fe=ae(U*(se-ie)-b*J),he=ae(f*y*O);return new G(ie,fe,he)}subtract(i){return this.add(i.negate())}multiplyUnsafe(i){const a=G.ZERO;if(typeof i=="bigint"&&i===h)return a;let u=We(i);if(u===d)return this;if(!W){let D=a,b=this;for(;u>h;)u&d&&(D=D.add(b)),b=b.double(),u>>=d;return D}let{k1neg:f,k1:p,k2neg:E,k2:y}=C.splitScalar(u),N=a,P=a,B=this;for(;p>h||y>h;)p&d&&(N=N.add(B)),y&d&&(P=P.add(B)),B=B.double(),p>>=d,y>>=d;return f&&(N=N.negate()),E&&(P=P.negate()),P=new G(ae(P.x*C.beta),P.y,P.z),N.add(P)}precomputeWindow(i){const a=W?128/i+1:256/i+1,u=[];let f=this,p=f;for(let E=0;E<a;E++){p=f,u.push(p);for(let y=1;y<2**(i-1);y++)p=p.add(f),u.push(p);f=p.double()}return u}wNAF(i,a){!a&&this.equals(G.BASE)&&(a=A.BASE);const u=a&&a._WINDOW_SIZE||1;if(256%u)throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");let f=a&&$.get(a);f||(f=this.precomputeWindow(u),a&&u!==1&&(f=G.normalizeZ(f),$.set(a,f)));let p=G.ZERO,E=G.BASE;const y=1+(W?128/u:256/u),N=2**(u-1),P=BigInt(2**u-1),B=2**u,D=BigInt(u);for(let b=0;b<y;b++){const x=b*N;let O=Number(i&P);i>>=D,O>N&&(O-=B,i+=d);const U=x,q=x+Math.abs(O)-1,J=b%2!==0,se=O<0;O===0?E=E.add(k(J,f[U])):p=p.add(k(se,f[q]))}return{p,f:E}}multiply(i,a){let u=We(i),f,p;if(W){const{k1neg:E,k1:y,k2neg:N,k2:P}=C.splitScalar(u);let{p:B,f:D}=this.wNAF(y,a),{p:b,f:x}=this.wNAF(P,a);B=k(E,B),b=k(N,b),b=new G(ae(b.x*C.beta),b.y,b.z),f=B.add(b),p=D.add(x)}else{const{p:E,f:y}=this.wNAF(u,a);f=E,p=y}return G.normalizeZ([f,p])[0]}toAffine(i){const{x:a,y:u,z:f}=this,p=this.equals(G.ZERO);i==null&&(i=p?m:$n(f));const E=i,y=ae(E*E),N=ae(y*E),P=ae(a*y),B=ae(u*N),D=ae(f*E);if(p)return A.ZERO;if(D!==d)throw new Error("invZ was invalid");return new A(P,B)}}G.BASE=new G(v.Gx,v.Gy,d),G.ZERO=new G(h,d,h);function k(s,i){const a=i.negate();return s?a:i}const $=new WeakMap;class A{constructor(i,a){this.x=i,this.y=a}_setWindowSize(i){this._WINDOW_SIZE=i,$.delete(this)}hasEvenY(){return this.y%g===h}static fromCompressedHex(i){const a=i.length===32,u=ke(a?i:i.subarray(1));if(!fr(u))throw new Error("Point is not on curve");const f=oe(u);let p=qn(f);const E=(p&d)===d;a?E&&(p=ae(-p)):(i[0]&1)===1!==E&&(p=ae(-p));const y=new A(u,p);return y.assertValidity(),y}static fromUncompressedHex(i){const a=ke(i.subarray(1,S+1)),u=ke(i.subarray(S+1,S*2+1)),f=new A(a,u);return f.assertValidity(),f}static fromHex(i){const a=Oe(i),u=a.length,f=a[0];if(u===S)return this.fromCompressedHex(a);if(u===H&&(f===2||f===3))return this.fromCompressedHex(a);if(u===ee&&f===4)return this.fromUncompressedHex(a);throw new Error(`Point.fromHex: received invalid point. Expected 32-${H} compressed bytes or ${ee} uncompressed bytes, not ${u}`)}static fromPrivateKey(i){return A.BASE.multiply(hn(i))}static fromSignature(i,a,u){const{r:f,s:p}=Po(a);if(![0,1,2,3].includes(u))throw new Error("Cannot recover: invalid recovery bit");const E=ei(Oe(i)),{n:y}=v,N=u===2||u===3?f+y:f,P=$n(N,y),B=ae(-E*P,y),D=ae(p*P,y),b=u&1?"03":"02",x=A.fromHex(b+$e(N)),O=A.BASE.multiplyAndAddUnsafe(x,B,D);if(!O)throw new Error("Cannot recover signature: point at infinify");return O.assertValidity(),O}toRawBytes(i=!1){return Re(this.toHex(i))}toHex(i=!1){const a=$e(this.x);return i?`${this.hasEvenY()?"02":"03"}${a}`:`04${a}${$e(this.y)}`}toHexX(){return this.toHex(!0).slice(2)}toRawX(){return this.toRawBytes(!0).slice(1)}assertValidity(){const i="Point is not on elliptic curve",{x:a,y:u}=this;if(!fr(a)||!fr(u))throw new Error(i);const f=ae(u*u),p=oe(a);if(ae(f-p)!==h)throw new Error(i)}equals(i){return this.x===i.x&&this.y===i.y}negate(){return new A(this.x,ae(-this.y))}double(){return G.fromAffine(this).double().toAffine()}add(i){return G.fromAffine(this).add(G.fromAffine(i)).toAffine()}subtract(i){return this.add(i.negate())}multiply(i){return G.fromAffine(this).multiply(i,this).toAffine()}multiplyAndAddUnsafe(i,a,u){const f=G.fromAffine(this),p=a===h||a===d||this!==A.BASE?f.multiplyUnsafe(a):f.multiply(a),E=G.fromAffine(i).multiplyUnsafe(u),y=p.add(E);return y.equals(G.ZERO)?void 0:y.toAffine()}}A.BASE=new A(v.Gx,v.Gy),A.ZERO=new A(h,h);function V(s){return Number.parseInt(s[0],16)>=8?"00"+s:s}function Z(s){if(s.length<2||s[0]!==2)throw new Error(`Invalid signature integer tag: ${ye(s)}`);const i=s[1],a=s.subarray(2,i+2);if(!i||a.length!==i)throw new Error("Invalid signature integer: wrong length");if(a[0]===0&&a[1]<=127)throw new Error("Invalid signature integer: trailing length");return{data:ke(a),left:s.subarray(i+2)}}function X(s){if(s.length<2||s[0]!=48)throw new Error(`Invalid signature tag: ${ye(s)}`);if(s[1]!==s.length-2)throw new Error("Invalid signature: incorrect length");const{data:i,left:a}=Z(s.subarray(2)),{data:u,left:f}=Z(a);if(f.length)throw new Error(`Invalid signature: left bytes after parsing: ${ye(f)}`);return{r:i,s:u}}class Y{constructor(i,a){this.r=i,this.s=a,this.assertValidity()}static fromCompact(i){const a=i instanceof Uint8Array,u="Signature.fromCompact";if(typeof i!="string"&&!a)throw new TypeError(`${u}: Expected string or Uint8Array`);const f=a?ye(i):i;if(f.length!==128)throw new Error(`${u}: Expected 64-byte hex`);return new Y(Be(f.slice(0,64)),Be(f.slice(64,128)))}static fromDER(i){const a=i instanceof Uint8Array;if(typeof i!="string"&&!a)throw new TypeError("Signature.fromDER: Expected string or Uint8Array");const{r:u,s:f}=X(a?i:Re(i));return new Y(u,f)}static fromHex(i){return this.fromDER(i)}assertValidity(){const{r:i,s:a}=this;if(!_n(i))throw new Error("Invalid Signature: r must be 0 < r < n");if(!_n(a))throw new Error("Invalid Signature: s must be 0 < s < n")}hasHighS(){const i=v.n>>d;return this.s>i}normalizeS(){return this.hasHighS()?new Y(this.r,ae(-this.s,v.n)):this}toDERRawBytes(){return Re(this.toDERHex())}toDERHex(){const i=V(_e(this.s)),a=V(_e(this.r)),u=i.length/2,f=a.length/2,p=_e(u),E=_e(f);return`30${_e(f+u+4)}02${E}${a}02${p}${i}`}toRawBytes(){return this.toDERRawBytes()}toHex(){return this.toDERHex()}toCompactRawBytes(){return Re(this.toCompactHex())}toCompactHex(){return $e(this.r)+$e(this.s)}}function re(...s){if(!s.every(u=>u instanceof Uint8Array))throw new Error("Uint8Array list expected");if(s.length===1)return s[0];const i=s.reduce((u,f)=>u+f.length,0),a=new Uint8Array(i);for(let u=0,f=0;u<s.length;u++){const p=s[u];a.set(p,f),f+=p.length}return a}const pe=Array.from({length:256},(s,i)=>i.toString(16).padStart(2,"0"));function ye(s){if(!(s instanceof Uint8Array))throw new Error("Expected Uint8Array");let i="";for(let a=0;a<s.length;a++)i+=pe[s[a]];return i}const le=BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");function $e(s){if(typeof s!="bigint")throw new Error("Expected bigint");if(!(h<=s&&s<le))throw new Error("Expected number 0 <= n < 2^256");return s.toString(16).padStart(64,"0")}function ve(s){const i=Re($e(s));if(i.length!==32)throw new Error("Error: expected 32 bytes");return i}function _e(s){const i=s.toString(16);return i.length&1?`0${i}`:i}function Be(s){if(typeof s!="string")throw new TypeError("hexToNumber: expected string, got "+typeof s);return BigInt(`0x${s}`)}function Re(s){if(typeof s!="string")throw new TypeError("hexToBytes: expected string, got "+typeof s);if(s.length%2)throw new Error("hexToBytes: received invalid unpadded hex"+s.length);const i=new Uint8Array(s.length/2);for(let a=0;a<i.length;a++){const u=a*2,f=s.slice(u,u+2),p=Number.parseInt(f,16);if(Number.isNaN(p)||p<0)throw new Error("Invalid byte sequence");i[a]=p}return i}function ke(s){return Be(ye(s))}function Oe(s){return s instanceof Uint8Array?Uint8Array.from(s):Re(s)}function We(s){if(typeof s=="number"&&Number.isSafeInteger(s)&&s>0)return BigInt(s);if(typeof s=="bigint"&&_n(s))return s;throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n")}function ae(s,i=v.P){const a=s%i;return a>=h?a:i+a}function ze(s,i){const{P:a}=v;let u=s;for(;i-- >h;)u*=u,u%=a;return u}function qn(s){const{P:i}=v,a=BigInt(6),u=BigInt(11),f=BigInt(22),p=BigInt(23),E=BigInt(44),y=BigInt(88),N=s*s*s%i,P=N*N*s%i,B=ze(P,w)*P%i,D=ze(B,w)*P%i,b=ze(D,g)*N%i,x=ze(b,u)*b%i,O=ze(x,f)*x%i,U=ze(O,E)*O%i,q=ze(U,y)*U%i,J=ze(q,E)*O%i,se=ze(J,w)*P%i,ie=ze(se,p)*x%i,fe=ze(ie,a)*N%i,he=ze(fe,g);if(he*he%i!==s)throw new Error("Cannot find square root");return he}function $n(s,i=v.P){if(s===h||i<=h)throw new Error(`invert: expected positive integers, got n=${s} mod=${i}`);let a=ae(s,i),u=i,f=h,p=d;for(;a!==h;){const y=u/a,N=u%a,P=f-p*y;u=a,a=N,f=p,p=P}if(u!==d)throw new Error("invert: does not exist");return ae(f,i)}function Bl(s,i=v.P){const a=new Array(s.length),u=s.reduce((p,E,y)=>E===h?p:(a[y]=p,ae(p*E,i)),d),f=$n(u,i);return s.reduceRight((p,E,y)=>E===h?p:(a[y]=ae(p*a[y],i),ae(p*E,i)),f),a}function Rl(s){const i=s.length*8-z*8,a=ke(s);return i>0?a>>BigInt(i):a}function ei(s,i=!1){const a=Rl(s);if(i)return a;const{n:u}=v;return a>=u?a-u:a}let An,Zn;class zl{constructor(i,a){if(this.hashLen=i,this.qByteLen=a,typeof i!="number"||i<2)throw new Error("hashLen must be a number");if(typeof a!="number"||a<2)throw new Error("qByteLen must be a number");this.v=new Uint8Array(i).fill(1),this.k=new Uint8Array(i).fill(0),this.counter=0}hmac(...i){return Ie.hmacSha256(this.k,...i)}hmacSync(...i){return Zn(this.k,...i)}checkSync(){if(typeof Zn!="function")throw new K("hmacSha256Sync needs to be set")}incr(){if(this.counter>=1e3)throw new Error("Tried 1,000 k values for sign(), all were invalid");this.counter+=1}async reseed(i=new Uint8Array){this.k=await this.hmac(this.v,Uint8Array.from([0]),i),this.v=await this.hmac(this.v),i.length!==0&&(this.k=await this.hmac(this.v,Uint8Array.from([1]),i),this.v=await this.hmac(this.v))}reseedSync(i=new Uint8Array){this.checkSync(),this.k=this.hmacSync(this.v,Uint8Array.from([0]),i),this.v=this.hmacSync(this.v),i.length!==0&&(this.k=this.hmacSync(this.v,Uint8Array.from([1]),i),this.v=this.hmacSync(this.v))}async generate(){this.incr();let i=0;const a=[];for(;i<this.qByteLen;){this.v=await this.hmac(this.v);const u=this.v.slice();a.push(u),i+=this.v.length}return re(...a)}generateSync(){this.checkSync(),this.incr();let i=0;const a=[];for(;i<this.qByteLen;){this.v=this.hmacSync(this.v);const u=this.v.slice();a.push(u),i+=this.v.length}return re(...a)}}function _n(s){return h<s&&s<v.n}function fr(s){return h<s&&s<v.P}function Ul(s,i,a,u=!0){const{n:f}=v,p=ei(s,!0);if(!_n(p))return;const E=$n(p,f),y=A.BASE.multiply(p),N=ae(y.x,f);if(N===h)return;const P=ae(E*ae(i+a*N,f),f);if(P===h)return;let B=new Y(N,P),D=(y.x===B.r?0:2)|Number(y.y&d);return u&&B.hasHighS()&&(B=B.normalizeS(),D^=1),{sig:B,recovery:D}}function hn(s){let i;if(typeof s=="bigint")i=s;else if(typeof s=="number"&&Number.isSafeInteger(s)&&s>0)i=BigInt(s);else if(typeof s=="string"){if(s.length!==2*z)throw new Error("Expected 32 bytes of private key");i=Be(s)}else if(s instanceof Uint8Array){if(s.length!==z)throw new Error("Expected 32 bytes of private key");i=ke(s)}else throw new TypeError("Expected valid private key");if(!_n(i))throw new Error("Expected private key: 0 < key < n");return i}function ti(s){return s instanceof A?(s.assertValidity(),s):A.fromHex(s)}function Po(s){if(s instanceof Y)return s.assertValidity(),s;try{return Y.fromDER(s)}catch{return Y.fromCompact(s)}}function Dl(s,i=!1){return A.fromPrivateKey(s).toRawBytes(i)}function Ho(s){const i=s instanceof Uint8Array,a=typeof s=="string",u=(i||a)&&s.length;return i?u===H||u===ee:a?u===H*2||u===ee*2:s instanceof A}function jo(s,i,a=!1){if(Ho(s))throw new TypeError("getSharedSecret: first arg must be private key");if(!Ho(i))throw new TypeError("getSharedSecret: second arg must be public key");const u=ti(i);return u.assertValidity(),u.multiply(hn(s)).toRawBytes(a)}function Fo(s){const i=s.length>S?s.slice(0,S):s;return ke(i)}function Pl(s){const i=Fo(s),a=ae(i,v.n);return qo(a<h?i:a)}function qo(s){return ve(s)}function Hl(s,i,a){if(s==null)throw new Error(`sign: expected valid message hash, not "${s}"`);const u=Oe(s),f=hn(i),p=[qo(f),Pl(u)];if(a!=null){a===!0&&(a=Ie.randomBytes(S));const N=Oe(a);if(N.length!==S)throw new Error(`sign: Expected ${S} bytes of extra data`);p.push(N)}const E=re(...p),y=Fo(u);return{seed:E,m:y,d:f}}function jl(s,i){const{sig:a,recovery:u}=s,{der:f,recovered:p}=Object.assign({canonical:!0,der:!0},i),E=f?a.toDERRawBytes():a.toCompactRawBytes();return p?[E,u]:E}function Fl(s,i,a={}){const{seed:u,m:f,d:p}=Hl(s,i,a.extraEntropy),E=new zl(F,z);E.reseedSync(u);let y;for(;!(y=Ul(E.generateSync(),f,p,a.canonical));)E.reseedSync();return jl(y,a)}const ql={strict:!0};function Zl(s,i,a,u=ql){let f;try{f=Po(s),i=Oe(i)}catch{return!1}const{r:p,s:E}=f;if(u.strict&&f.hasHighS())return!1;const y=ei(i);let N;try{N=ti(a)}catch{return!1}const{n:P}=v,B=$n(E,P),D=ae(y*B,P),b=ae(p*B,P),x=A.BASE.multiplyAndAddUnsafe(N,D,b);return x?ae(x.x,P)===p:!1}function pr(s){return ae(ke(s),v.n)}class kn{constructor(i,a){this.r=i,this.s=a,this.assertValidity()}static fromHex(i){const a=Oe(i);if(a.length!==64)throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${a.length}`);const u=ke(a.subarray(0,32)),f=ke(a.subarray(32,64));return new kn(u,f)}assertValidity(){const{r:i,s:a}=this;if(!fr(i)||!_n(a))throw new Error("Invalid signature")}toHex(){return $e(this.r)+$e(this.s)}toRawBytes(){return Re(this.toHex())}}function Vl(s){return A.fromPrivateKey(s).toRawX()}class Zo{constructor(i,a,u=Ie.randomBytes()){if(i==null)throw new TypeError(`sign: Expected valid message, not "${i}"`);this.m=Oe(i);const{x:f,scalar:p}=this.getScalar(hn(a));if(this.px=f,this.d=p,this.rand=Oe(u),this.rand.length!==32)throw new TypeError("sign: Expected 32 bytes of aux randomness")}getScalar(i){const a=A.fromPrivateKey(i),u=a.hasEvenY()?i:v.n-i;return{point:a,scalar:u,x:a.toRawX()}}initNonce(i,a){return ve(i^ke(a))}finalizeNonce(i){const a=ae(ke(i),v.n);if(a===h)throw new Error("sign: Creation of signature failed. k is zero");const{point:u,x:f,scalar:p}=this.getScalar(a);return{R:u,rx:f,k:p}}finalizeSig(i,a,u,f){return new kn(i.x,ae(a+u*f,v.n)).toRawBytes()}error(){throw new Error("sign: Invalid signature produced")}async calc(){const{m:i,d:a,px:u,rand:f}=this,p=Ie.taggedHash,E=this.initNonce(a,await p(qt.aux,f)),{R:y,rx:N,k:P}=this.finalizeNonce(await p(qt.nonce,E,u,i)),B=pr(await p(qt.challenge,N,u,i)),D=this.finalizeSig(y,P,B,a);return await Ko(D,i,u)||this.error(),D}calcSync(){const{m:i,d:a,px:u,rand:f}=this,p=Ie.taggedHashSync,E=this.initNonce(a,p(qt.aux,f)),{R:y,rx:N,k:P}=this.finalizeNonce(p(qt.nonce,E,u,i)),B=pr(p(qt.challenge,N,u,i)),D=this.finalizeSig(y,P,B,a);return Wo(D,i,u)||this.error(),D}}async function Gl(s,i,a){return new Zo(s,i,a).calc()}function Kl(s,i,a){return new Zo(s,i,a).calcSync()}function Vo(s,i,a){const u=s instanceof kn,f=u?s:kn.fromHex(s);return u&&f.assertValidity(),{...f,m:Oe(i),P:ti(a)}}function Go(s,i,a,u){const f=A.BASE.multiplyAndAddUnsafe(i,hn(a),ae(-u,v.n));return!(!f||!f.hasEvenY()||f.x!==s)}async function Ko(s,i,a){try{const{r:u,s:f,m:p,P:E}=Vo(s,i,a),y=pr(await Ie.taggedHash(qt.challenge,ve(u),E.toRawX(),p));return Go(u,E,f,y)}catch{return!1}}function Wo(s,i,a){try{const{r:u,s:f,m:p,P:E}=Vo(s,i,a),y=pr(Ie.taggedHashSync(qt.challenge,ve(u),E.toRawX(),p));return Go(u,E,f,y)}catch(u){if(u instanceof K)throw u;return!1}}const Vn={Signature:kn,getPublicKey:Vl,sign:Gl,verify:Ko,signSync:Kl,verifySync:Wo};A.BASE._setWindowSize(8);const dt={node:l,web:typeof self=="object"&&"crypto"in self?self.crypto:void 0},qt={challenge:"BIP0340/challenge",aux:"BIP0340/aux",nonce:"BIP0340/nonce"},gr={},Ie={bytesToHex:ye,hexToBytes:Re,concatBytes:re,mod:ae,invert:$n,isValidPrivateKey(s){try{return hn(s),!0}catch{return!1}},_bigintTo32Bytes:ve,_normalizePrivateKey:hn,hashToPrivateKey:s=>{s=Oe(s);const i=z+8;if(s.length<i||s.length>1024)throw new Error("Expected valid bytes of private key as per FIPS 186");const a=ae(ke(s),v.n-d)+d;return ve(a)},randomBytes:(s=32)=>{if(dt.web)return dt.web.getRandomValues(new Uint8Array(s));if(dt.node){const{randomBytes:i}=dt.node;return Uint8Array.from(i(s))}else throw new Error("The environment doesn't have randomBytes function")},randomPrivateKey:()=>Ie.hashToPrivateKey(Ie.randomBytes(z+8)),precompute(s=8,i=A.BASE){const a=i===A.BASE?i:new A(i.x,i.y);return a._setWindowSize(s),a.multiply(w),a},sha256:async(...s)=>{if(dt.web){const i=await dt.web.subtle.digest("SHA-256",re(...s));return new Uint8Array(i)}else if(dt.node){const{createHash:i}=dt.node,a=i("sha256");return s.forEach(u=>a.update(u)),Uint8Array.from(a.digest())}else throw new Error("The environment doesn't have sha256 function")},hmacSha256:async(s,...i)=>{if(dt.web){const a=await dt.web.subtle.importKey("raw",s,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),u=re(...i),f=await dt.web.subtle.sign("HMAC",a,u);return new Uint8Array(f)}else if(dt.node){const{createHmac:a}=dt.node,u=a("sha256",s);return i.forEach(f=>u.update(f)),Uint8Array.from(u.digest())}else throw new Error("The environment doesn't have hmac-sha256 function")},sha256Sync:void 0,hmacSha256Sync:void 0,taggedHash:async(s,...i)=>{let a=gr[s];if(a===void 0){const u=await Ie.sha256(Uint8Array.from(s,f=>f.charCodeAt(0)));a=re(u,u),gr[s]=a}return Ie.sha256(a,...i)},taggedHashSync:(s,...i)=>{if(typeof An!="function")throw new K("sha256Sync is undefined, you need to set it");let a=gr[s];if(a===void 0){const u=An(Uint8Array.from(s,f=>f.charCodeAt(0)));a=re(u,u),gr[s]=a}return An(a,...i)},_JacobianPoint:G};Object.defineProperties(Ie,{sha256Sync:{configurable:!1,get(){return An},set(s){An||(An=s)}},hmacSha256Sync:{configurable:!1,get(){return Zn},set(s){Zn||(Zn=s)}}});var rt={};Object.defineProperty(rt,"__esModule",{value:!0}),rt.sha224=rt.sha256=void 0;var Sn={};Object.defineProperty(Sn,"__esModule",{value:!0}),Sn.SHA2=void 0;var Te={};Object.defineProperty(Te,"__esModule",{value:!0}),Te.output=Te.exists=Te.hash=Te.bytes=Te.bool=Te.number=void 0;function yr(s){if(!Number.isSafeInteger(s)||s<0)throw new Error(`Wrong positive integer: ${s}`)}Te.number=yr;function Qo(s){if(typeof s!="boolean")throw new Error(`Expected boolean, not ${s}`)}Te.bool=Qo;function ni(s,...i){if(!(s instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(i.length>0&&!i.includes(s.length))throw new TypeError(`Expected Uint8Array of length ${i}, not of length=${s.length}`)}Te.bytes=ni;function Yo(s){if(typeof s!="function"||typeof s.create!="function")throw new Error("Hash should be wrapped by utils.wrapConstructor");yr(s.outputLen),yr(s.blockLen)}Te.hash=Yo;function Xo(s,i=!0){if(s.destroyed)throw new Error("Hash instance has been destroyed");if(i&&s.finished)throw new Error("Hash#digest() has already been called")}Te.exists=Xo;function Jo(s,i){ni(s);const a=i.outputLen;if(s.length<a)throw new Error(`digestInto() expects output buffer of length at least ${a}`)}Te.output=Jo;const Wl={number:yr,bool:Qo,bytes:ni,hash:Yo,exists:Xo,output:Jo};Te.default=Wl;var de={};Object.defineProperty(de,"__esModule",{value:!0}),de.randomBytes=de.wrapConstructorWithOpts=de.wrapConstructor=de.checkOpts=de.Hash=de.concatBytes=de.toBytes=de.utf8ToBytes=de.asyncLoop=de.nextTick=de.hexToBytes=de.bytesToHex=de.isLE=de.rotr=de.createView=de.u32=de.u8=void 0;var dn={};Object.defineProperty(dn,"__esModule",{value:!0}),dn.crypto=void 0,dn.crypto={node:void 0,web:typeof self=="object"&&"crypto"in self?self.crypto:void 0};const Ql=s=>new Uint8Array(s.buffer,s.byteOffset,s.byteLength);de.u8=Ql;const Yl=s=>new Uint32Array(s.buffer,s.byteOffset,Math.floor(s.byteLength/4));de.u32=Yl;const Xl=s=>new DataView(s.buffer,s.byteOffset,s.byteLength);de.createView=Xl;const Jl=(s,i)=>s<<32-i|s>>>i;if(de.rotr=Jl,de.isLE=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68,!de.isLE)throw new Error("Non little-endian hardware is not supported");const eu=Array.from({length:256},(s,i)=>i.toString(16).padStart(2,"0"));function tu(s){if(!(s instanceof Uint8Array))throw new Error("Uint8Array expected");let i="";for(let a=0;a<s.length;a++)i+=eu[s[a]];return i}de.bytesToHex=tu;function nu(s){if(typeof s!="string")throw new TypeError("hexToBytes: expected string, got "+typeof s);if(s.length%2)throw new Error("hexToBytes: received invalid unpadded hex");const i=new Uint8Array(s.length/2);for(let a=0;a<i.length;a++){const u=a*2,f=s.slice(u,u+2),p=Number.parseInt(f,16);if(Number.isNaN(p)||p<0)throw new Error("Invalid byte sequence");i[a]=p}return i}de.hexToBytes=nu;const ru=async()=>{};de.nextTick=ru;async function iu(s,i,a){let u=Date.now();for(let f=0;f<s;f++){a(f);const p=Date.now()-u;p>=0&&p<i||(await(0,de.nextTick)(),u+=p)}}de.asyncLoop=iu;function es(s){if(typeof s!="string")throw new TypeError(`utf8ToBytes expected string, got ${typeof s}`);return new TextEncoder().encode(s)}de.utf8ToBytes=es;function ri(s){if(typeof s=="string"&&(s=es(s)),!(s instanceof Uint8Array))throw new TypeError(`Expected input type is Uint8Array (got ${typeof s})`);return s}de.toBytes=ri;function ou(...s){if(!s.every(u=>u instanceof Uint8Array))throw new Error("Uint8Array list expected");if(s.length===1)return s[0];const i=s.reduce((u,f)=>u+f.length,0),a=new Uint8Array(i);for(let u=0,f=0;u<s.length;u++){const p=s[u];a.set(p,f),f+=p.length}return a}de.concatBytes=ou;class su{clone(){return this._cloneInto()}}de.Hash=su;const au=s=>Object.prototype.toString.call(s)==="[object Object]"&&s.constructor===Object;function cu(s,i){if(i!==void 0&&(typeof i!="object"||!au(i)))throw new TypeError("Options should be object or undefined");return Object.assign(s,i)}de.checkOpts=cu;function lu(s){const i=u=>s().update(ri(u)).digest(),a=s();return i.outputLen=a.outputLen,i.blockLen=a.blockLen,i.create=()=>s(),i}de.wrapConstructor=lu;function uu(s){const i=(u,f)=>s(f).update(ri(u)).digest(),a=s({});return i.outputLen=a.outputLen,i.blockLen=a.blockLen,i.create=u=>s(u),i}de.wrapConstructorWithOpts=uu;function hu(s=32){if(dn.crypto.web)return dn.crypto.web.getRandomValues(new Uint8Array(s));if(dn.crypto.node)return new Uint8Array(dn.crypto.node.randomBytes(s).buffer);throw new Error("The environment doesn't have randomBytes function")}de.randomBytes=hu;function du(s,i,a,u){if(typeof s.setBigUint64=="function")return s.setBigUint64(i,a,u);const f=BigInt(32),p=BigInt(4294967295),E=Number(a>>f&p),y=Number(a&p),N=u?4:0,P=u?0:4;s.setUint32(i+N,E,u),s.setUint32(i+P,y,u)}class fu extends de.Hash{constructor(i,a,u,f){super(),this.blockLen=i,this.outputLen=a,this.padOffset=u,this.isLE=f,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(i),this.view=(0,de.createView)(this.buffer)}update(i){Te.default.exists(this);const{view:a,buffer:u,blockLen:f}=this;i=(0,de.toBytes)(i);const p=i.length;for(let E=0;E<p;){const y=Math.min(f-this.pos,p-E);if(y===f){const N=(0,de.createView)(i);for(;f<=p-E;E+=f)this.process(N,E);continue}u.set(i.subarray(E,E+y),this.pos),this.pos+=y,E+=y,this.pos===f&&(this.process(a,0),this.pos=0)}return this.length+=i.length,this.roundClean(),this}digestInto(i){Te.default.exists(this),Te.default.output(i,this),this.finished=!0;const{buffer:a,view:u,blockLen:f,isLE:p}=this;let{pos:E}=this;a[E++]=128,this.buffer.subarray(E).fill(0),this.padOffset>f-E&&(this.process(u,0),E=0);for(let D=E;D<f;D++)a[D]=0;du(u,f-8,BigInt(this.length*8),p),this.process(u,0);const y=(0,de.createView)(i),N=this.outputLen;if(N%4)throw new Error("_sha2: outputLen should be aligned to 32bit");const P=N/4,B=this.get();if(P>B.length)throw new Error("_sha2: outputLen bigger than state");for(let D=0;D<P;D++)y.setUint32(4*D,B[D],p)}digest(){const{buffer:i,outputLen:a}=this;this.digestInto(i);const u=i.slice(0,a);return this.destroy(),u}_cloneInto(i){i||(i=new this.constructor),i.set(...this.get());const{blockLen:a,buffer:u,length:f,finished:p,destroyed:E,pos:y}=this;return i.length=f,i.pos=y,i.finished=p,i.destroyed=E,f%a&&i.buffer.set(u),i}}Sn.SHA2=fu;const pu=(s,i,a)=>s&i^~s&a,gu=(s,i,a)=>s&i^s&a^i&a,yu=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Zt=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),Vt=new Uint32Array(64);class ts extends Sn.SHA2{constructor(){super(64,32,8,!1),this.A=Zt[0]|0,this.B=Zt[1]|0,this.C=Zt[2]|0,this.D=Zt[3]|0,this.E=Zt[4]|0,this.F=Zt[5]|0,this.G=Zt[6]|0,this.H=Zt[7]|0}get(){const{A:i,B:a,C:u,D:f,E:p,F:E,G:y,H:N}=this;return[i,a,u,f,p,E,y,N]}set(i,a,u,f,p,E,y,N){this.A=i|0,this.B=a|0,this.C=u|0,this.D=f|0,this.E=p|0,this.F=E|0,this.G=y|0,this.H=N|0}process(i,a){for(let D=0;D<16;D++,a+=4)Vt[D]=i.getUint32(a,!1);for(let D=16;D<64;D++){const b=Vt[D-15],x=Vt[D-2],O=(0,de.rotr)(b,7)^(0,de.rotr)(b,18)^b>>>3,U=(0,de.rotr)(x,17)^(0,de.rotr)(x,19)^x>>>10;Vt[D]=U+Vt[D-7]+O+Vt[D-16]|0}let{A:u,B:f,C:p,D:E,E:y,F:N,G:P,H:B}=this;for(let D=0;D<64;D++){const b=(0,de.rotr)(y,6)^(0,de.rotr)(y,11)^(0,de.rotr)(y,25),x=B+b+pu(y,N,P)+yu[D]+Vt[D]|0,U=((0,de.rotr)(u,2)^(0,de.rotr)(u,13)^(0,de.rotr)(u,22))+gu(u,f,p)|0;B=P,P=N,N=y,y=E+x|0,E=p,p=f,f=u,u=x+U|0}u=u+this.A|0,f=f+this.B|0,p=p+this.C|0,E=E+this.D|0,y=y+this.E|0,N=N+this.F|0,P=P+this.G|0,B=B+this.H|0,this.set(u,f,p,E,y,N,P,B)}roundClean(){Vt.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}}class mu extends ts{constructor(){super(),this.A=-1056596264,this.B=914150663,this.C=812702999,this.D=-150054599,this.E=-4191439,this.F=1750603025,this.G=1694076839,this.H=-1090891868,this.outputLen=28}}rt.sha256=(0,de.wrapConstructor)(()=>new ts),rt.sha224=(0,de.wrapConstructor)(()=>new mu);function fn(s){if(!Number.isSafeInteger(s))throw new Error(`Wrong integer: ${s}`)}function bt(...s){const i=(f,p)=>E=>f(p(E)),a=Array.from(s).reverse().reduce((f,p)=>f?i(f,p.encode):p.encode,void 0),u=s.reduce((f,p)=>f?i(f,p.decode):p.decode,void 0);return{encode:a,decode:u}}function xt(s){return{encode:i=>{if(!Array.isArray(i)||i.length&&typeof i[0]!="number")throw new Error("alphabet.encode input should be an array of numbers");return i.map(a=>{if(fn(a),a<0||a>=s.length)throw new Error(`Digit index outside alphabet: ${a} (alphabet: ${s.length})`);return s[a]})},decode:i=>{if(!Array.isArray(i)||i.length&&typeof i[0]!="string")throw new Error("alphabet.decode input should be array of strings");return i.map(a=>{if(typeof a!="string")throw new Error(`alphabet.decode: not string element=${a}`);const u=s.indexOf(a);if(u===-1)throw new Error(`Unknown letter: "${a}". Allowed: ${s}`);return u})}}}function $t(s=""){if(typeof s!="string")throw new Error("join separator should be string");return{encode:i=>{if(!Array.isArray(i)||i.length&&typeof i[0]!="string")throw new Error("join.encode input should be array of strings");for(let a of i)if(typeof a!="string")throw new Error(`join.encode: non-string input=${a}`);return i.join(s)},decode:i=>{if(typeof i!="string")throw new Error("join.decode input should be string");return i.split(s)}}}function Gn(s,i="="){if(fn(s),typeof i!="string")throw new Error("padding chr should be string");return{encode(a){if(!Array.isArray(a)||a.length&&typeof a[0]!="string")throw new Error("padding.encode input should be array of strings");for(let u of a)if(typeof u!="string")throw new Error(`padding.encode: non-string input=${u}`);for(;a.length*s%8;)a.push(i);return a},decode(a){if(!Array.isArray(a)||a.length&&typeof a[0]!="string")throw new Error("padding.encode input should be array of strings");for(let f of a)if(typeof f!="string")throw new Error(`padding.decode: non-string input=${f}`);let u=a.length;if(u*s%8)throw new Error("Invalid padding: string should have whole number of bytes");for(;u>0&&a[u-1]===i;u--)if(!((u-1)*s%8))throw new Error("Invalid padding: string has too much padding");return a.slice(0,u)}}}function ns(s){if(typeof s!="function")throw new Error("normalize fn should be function");return{encode:i=>i,decode:i=>s(i)}}function rs(s,i,a){if(i<2)throw new Error(`convertRadix: wrong from=${i}, base cannot be less than 2`);if(a<2)throw new Error(`convertRadix: wrong to=${a}, base cannot be less than 2`);if(!Array.isArray(s))throw new Error("convertRadix: data should be array");if(!s.length)return[];let u=0;const f=[],p=Array.from(s);for(p.forEach(E=>{if(fn(E),E<0||E>=i)throw new Error(`Wrong integer: ${E}`)});;){let E=0,y=!0;for(let N=u;N<p.length;N++){const P=p[N],B=i*E+P;if(!Number.isSafeInteger(B)||i*E/i!==E||B-P!==i*E)throw new Error("convertRadix: carry overflow");if(E=B%a,p[N]=Math.floor(B/a),!Number.isSafeInteger(p[N])||p[N]*a+E!==B)throw new Error("convertRadix: carry overflow");if(y)p[N]?y=!1:u=N;else continue}if(f.push(E),y)break}for(let E=0;E<s.length-1&&s[E]===0;E++)f.push(0);return f.reverse()}const is=(s,i)=>i?is(i,s%i):s,mr=(s,i)=>s+(i-is(s,i));function ii(s,i,a,u){if(!Array.isArray(s))throw new Error("convertRadix2: data should be array");if(i<=0||i>32)throw new Error(`convertRadix2: wrong from=${i}`);if(a<=0||a>32)throw new Error(`convertRadix2: wrong to=${a}`);if(mr(i,a)>32)throw new Error(`convertRadix2: carry overflow from=${i} to=${a} carryBits=${mr(i,a)}`);let f=0,p=0;const E=2**a-1,y=[];for(const N of s){if(fn(N),N>=2**i)throw new Error(`convertRadix2: invalid data word=${N} from=${i}`);if(f=f<<i|N,p+i>32)throw new Error(`convertRadix2: carry overflow pos=${p} from=${i}`);for(p+=i;p>=a;p-=a)y.push((f>>p-a&E)>>>0);f&=2**p-1}if(f=f<<a-p&E,!u&&p>=i)throw new Error("Excess padding");if(!u&&f)throw new Error(`Non-zero padding: ${f}`);return u&&p>0&&y.push(f>>>0),y}function os(s){return fn(s),{encode:i=>{if(!(i instanceof Uint8Array))throw new Error("radix.encode input should be Uint8Array");return rs(Array.from(i),256,s)},decode:i=>{if(!Array.isArray(i)||i.length&&typeof i[0]!="number")throw new Error("radix.decode input should be array of strings");return Uint8Array.from(rs(i,s,256))}}}function Mt(s,i=!1){if(fn(s),s<=0||s>32)throw new Error("radix2: bits should be in (0..32]");if(mr(8,s)>32||mr(s,8)>32)throw new Error("radix2: carry overflow");return{encode:a=>{if(!(a instanceof Uint8Array))throw new Error("radix2.encode input should be Uint8Array");return ii(Array.from(a),8,s,!i)},decode:a=>{if(!Array.isArray(a)||a.length&&typeof a[0]!="number")throw new Error("radix2.decode input should be array of strings");return Uint8Array.from(ii(a,s,8,i))}}}function ss(s){if(typeof s!="function")throw new Error("unsafeWrapper fn should be function");return function(...i){try{return s.apply(null,i)}catch{}}}function as(s,i){if(fn(s),typeof i!="function")throw new Error("checksum fn should be function");return{encode(a){if(!(a instanceof Uint8Array))throw new Error("checksum.encode: input should be Uint8Array");const u=i(a).slice(0,s),f=new Uint8Array(a.length+s);return f.set(a),f.set(u,a.length),f},decode(a){if(!(a instanceof Uint8Array))throw new Error("checksum.decode: input should be Uint8Array");const u=a.slice(0,-s),f=i(u).slice(0,s),p=a.slice(-s);for(let E=0;E<s;E++)if(f[E]!==p[E])throw new Error("Invalid checksum");return u}}}const br={alphabet:xt,chain:bt,checksum:as,radix:os,radix2:Mt,join:$t,padding:Gn},bu=bt(Mt(4),xt("0123456789ABCDEF"),$t("")),wu=bt(Mt(5),xt("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"),Gn(5),$t(""));bt(Mt(5),xt("0123456789ABCDEFGHIJKLMNOPQRSTUV"),Gn(5),$t("")),bt(Mt(5),xt("0123456789ABCDEFGHJKMNPQRSTVWXYZ"),$t(""),ns(s=>s.toUpperCase().replace(/O/g,"0").replace(/[IL]/g,"1")));const Kn=bt(Mt(6),xt("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),Gn(6),$t("")),vu=bt(Mt(6),xt("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),Gn(6),$t("")),oi=s=>bt(os(58),xt(s),$t("")),wr=oi("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");oi("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),oi("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");const cs=[0,2,3,5,6,7,9,10,11],Eu={encode(s){let i="";for(let a=0;a<s.length;a+=8){const u=s.subarray(a,a+8);i+=wr.encode(u).padStart(cs[u.length],"1")}return i},decode(s){let i=[];for(let a=0;a<s.length;a+=11){const u=s.slice(a,a+11),f=cs.indexOf(u.length),p=wr.decode(u);for(let E=0;E<p.length-f;E++)if(p[E]!==0)throw new Error("base58xmr: wrong padding");i=i.concat(Array.from(p.slice(p.length-f)))}return Uint8Array.from(i)}},xu=s=>bt(as(4,i=>s(s(i))),wr),si=bt(xt("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),$t("")),ls=[996825010,642813549,513874426,1027748829,705979059];function Wn(s){const i=s>>25;let a=(s&33554431)<<5;for(let u=0;u<ls.length;u++)(i>>u&1)===1&&(a^=ls[u]);return a}function us(s,i,a=1){const u=s.length;let f=1;for(let p=0;p<u;p++){const E=s.charCodeAt(p);if(E<33||E>126)throw new Error(`Invalid prefix (${s})`);f=Wn(f)^E>>5}f=Wn(f);for(let p=0;p<u;p++)f=Wn(f)^s.charCodeAt(p)&31;for(let p of i)f=Wn(f)^p;for(let p=0;p<6;p++)f=Wn(f);return f^=a,si.encode(ii([f%2**30],30,5,!1))}function hs(s){const i=s==="bech32"?1:734539939,a=Mt(5),u=a.decode,f=a.encode,p=ss(u);function E(B,D,b=90){if(typeof B!="string")throw new Error(`bech32.encode prefix should be string, not ${typeof B}`);if(!Array.isArray(D)||D.length&&typeof D[0]!="number")throw new Error(`bech32.encode words should be array of numbers, not ${typeof D}`);const x=B.length+7+D.length;if(b!==!1&&x>b)throw new TypeError(`Length ${x} exceeds limit ${b}`);return B=B.toLowerCase(),`${B}1${si.encode(D)}${us(B,D,i)}`}function y(B,D=90){if(typeof B!="string")throw new Error(`bech32.decode input should be string, not ${typeof B}`);if(B.length<8||D!==!1&&B.length>D)throw new TypeError(`Wrong string length: ${B.length} (${B}). Expected (8..${D})`);const b=B.toLowerCase();if(B!==b&&B!==B.toUpperCase())throw new Error("String must be lowercase or uppercase");B=b;const x=B.lastIndexOf("1");if(x===0||x===-1)throw new Error('Letter "1" must be present between prefix and data only');const O=B.slice(0,x),U=B.slice(x+1);if(U.length<6)throw new Error("Data must be at least 6 characters long");const q=si.decode(U).slice(0,-6),J=us(O,q,i);if(!U.endsWith(J))throw new Error(`Invalid checksum in ${B}: expected "${J}"`);return{prefix:O,words:q}}const N=ss(y);function P(B){const{prefix:D,words:b}=y(B,!1);return{prefix:D,words:b,bytes:u(b)}}return{encode:E,decode:y,decodeToBytes:P,decodeUnsafe:N,fromWords:u,fromWordsUnsafe:p,toWords:f}}const it=hs("bech32");hs("bech32m");const $u={encode:s=>new TextDecoder().decode(s),decode:s=>new TextEncoder().encode(s)},Au=bt(Mt(4),xt("0123456789abcdef"),$t(""),ns(s=>{if(typeof s!="string"||s.length%2)throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);return s.toLowerCase()}));`${Object.keys({utf8:$u,hex:Au,base16:bu,base32:wu,base64:Kn,base64url:vu,base58:wr,base58xmr:Eu}).join(", ")}`;var Qn={};Object.defineProperty(Qn,"__esModule",{value:!0}),Qn.wordlist=void 0,Qn.wordlist=`abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);var Qe={};Object.defineProperty(Qe,"__esModule",{value:!0}),Qe.mnemonicToSeedSync=Qe.mnemonicToSeed=Qe.validateMnemonic=Qe.entropyToMnemonic=Qe.mnemonicToEntropy=Qe.generateMnemonic=void 0;var pn={};Object.defineProperty(pn,"__esModule",{value:!0}),pn.pbkdf2Async=pn.pbkdf2=void 0;var Nt={};Object.defineProperty(Nt,"__esModule",{value:!0}),Nt.hmac=void 0;class ds extends de.Hash{constructor(i,a){super(),this.finished=!1,this.destroyed=!1,Te.default.hash(i);const u=(0,de.toBytes)(a);if(this.iHash=i.create(),typeof this.iHash.update!="function")throw new TypeError("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;const f=this.blockLen,p=new Uint8Array(f);p.set(u.length>f?i.create().update(u).digest():u);for(let E=0;E<p.length;E++)p[E]^=54;this.iHash.update(p),this.oHash=i.create();for(let E=0;E<p.length;E++)p[E]^=106;this.oHash.update(p),p.fill(0)}update(i){return Te.default.exists(this),this.iHash.update(i),this}digestInto(i){Te.default.exists(this),Te.default.bytes(i,this.outputLen),this.finished=!0,this.iHash.digestInto(i),this.oHash.update(i),this.oHash.digestInto(i),this.destroy()}digest(){const i=new Uint8Array(this.oHash.outputLen);return this.digestInto(i),i}_cloneInto(i){i||(i=Object.create(Object.getPrototypeOf(this),{}));const{oHash:a,iHash:u,finished:f,destroyed:p,blockLen:E,outputLen:y}=this;return i.finished=f,i.destroyed=p,i.blockLen=E,i.outputLen=y,i.oHash=a._cloneInto(i.oHash),i.iHash=u._cloneInto(i.iHash),i}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}}const _u=(s,i,a)=>new ds(s,i).update(a).digest();Nt.hmac=_u,Nt.hmac.create=(s,i)=>new ds(s,i);function fs(s,i,a,u){Te.default.hash(s);const f=(0,de.checkOpts)({dkLen:32,asyncTick:10},u),{c:p,dkLen:E,asyncTick:y}=f;if(Te.default.number(p),Te.default.number(E),Te.default.number(y),p<1)throw new Error("PBKDF2: iterations (c) should be >= 1");const N=(0,de.toBytes)(i),P=(0,de.toBytes)(a),B=new Uint8Array(E),D=Nt.hmac.create(s,N),b=D._cloneInto().update(P);return{c:p,dkLen:E,asyncTick:y,DK:B,PRF:D,PRFSalt:b}}function ps(s,i,a,u,f){return s.destroy(),i.destroy(),u&&u.destroy(),f.fill(0),a}function ku(s,i,a,u){const{c:f,dkLen:p,DK:E,PRF:y,PRFSalt:N}=fs(s,i,a,u);let P;const B=new Uint8Array(4),D=(0,de.createView)(B),b=new Uint8Array(y.outputLen);for(let x=1,O=0;O<p;x++,O+=y.outputLen){const U=E.subarray(O,O+y.outputLen);D.setInt32(0,x,!1),(P=N._cloneInto(P)).update(B).digestInto(b),U.set(b.subarray(0,U.length));for(let q=1;q<f;q++){y._cloneInto(P).update(b).digestInto(b);for(let J=0;J<U.length;J++)U[J]^=b[J]}}return ps(y,N,E,P,b)}pn.pbkdf2=ku;async function Su(s,i,a,u){const{c:f,dkLen:p,asyncTick:E,DK:y,PRF:N,PRFSalt:P}=fs(s,i,a,u);let B;const D=new Uint8Array(4),b=(0,de.createView)(D),x=new Uint8Array(N.outputLen);for(let O=1,U=0;U<p;O++,U+=N.outputLen){const q=y.subarray(U,U+N.outputLen);b.setInt32(0,O,!1),(B=P._cloneInto(B)).update(D).digestInto(x),q.set(x.subarray(0,q.length)),await(0,de.asyncLoop)(f-1,E,J=>{N._cloneInto(B).update(x).digestInto(x);for(let se=0;se<q.length;se++)q[se]^=x[se]})}return ps(N,P,y,B,x)}pn.pbkdf2Async=Su;var tt={};Object.defineProperty(tt,"__esModule",{value:!0}),tt.sha384=tt.sha512_256=tt.sha512_224=tt.sha512=tt.SHA512=void 0;var xe={};Object.defineProperty(xe,"__esModule",{value:!0}),xe.add=xe.toBig=xe.split=xe.fromBig=void 0;const vr=BigInt(2**32-1),ai=BigInt(32);function ci(s,i=!1){return i?{h:Number(s&vr),l:Number(s>>ai&vr)}:{h:Number(s>>ai&vr)|0,l:Number(s&vr)|0}}xe.fromBig=ci;function gs(s,i=!1){let a=new Uint32Array(s.length),u=new Uint32Array(s.length);for(let f=0;f<s.length;f++){const{h:p,l:E}=ci(s[f],i);[a[f],u[f]]=[p,E]}return[a,u]}xe.split=gs;const Iu=(s,i)=>BigInt(s>>>0)<<ai|BigInt(i>>>0);xe.toBig=Iu;const Cu=(s,i,a)=>s>>>a,Tu=(s,i,a)=>s<<32-a|i>>>a,Lu=(s,i,a)=>s>>>a|i<<32-a,Ou=(s,i,a)=>s<<32-a|i>>>a,Mu=(s,i,a)=>s<<64-a|i>>>a-32,Nu=(s,i,a)=>s>>>a-32|i<<64-a,Bu=(s,i)=>i,Ru=(s,i)=>s,zu=(s,i,a)=>s<<a|i>>>32-a,Uu=(s,i,a)=>i<<a|s>>>32-a,Du=(s,i,a)=>i<<a-32|s>>>64-a,Pu=(s,i,a)=>s<<a-32|i>>>64-a;function ys(s,i,a,u){const f=(i>>>0)+(u>>>0);return{h:s+a+(f/2**32|0)|0,l:f|0}}xe.add=ys;const Hu=(s,i,a)=>(s>>>0)+(i>>>0)+(a>>>0),ju=(s,i,a,u)=>i+a+u+(s/2**32|0)|0,Fu=(s,i,a,u)=>(s>>>0)+(i>>>0)+(a>>>0)+(u>>>0),qu=(s,i,a,u,f)=>i+a+u+f+(s/2**32|0)|0,Zu=(s,i,a,u,f)=>(s>>>0)+(i>>>0)+(a>>>0)+(u>>>0)+(f>>>0),Vu=(s,i,a,u,f,p)=>i+a+u+f+p+(s/2**32|0)|0,Gu={fromBig:ci,split:gs,toBig:xe.toBig,shrSH:Cu,shrSL:Tu,rotrSH:Lu,rotrSL:Ou,rotrBH:Mu,rotrBL:Nu,rotr32H:Bu,rotr32L:Ru,rotlSH:zu,rotlSL:Uu,rotlBH:Du,rotlBL:Pu,add:ys,add3L:Hu,add3H:ju,add4L:Fu,add4H:qu,add5H:Vu,add5L:Zu};xe.default=Gu;const[Ku,Wu]=xe.default.split(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189dbbc","0x3956c25bf348b538","0x59f111f1b605d019","0x923f82a4af194f9b","0xab1c5ed5da6d8118","0xd807aa98a3030242","0x12835b0145706fbe","0x243185be4ee4b28c","0x550c7dc3d5ffb4e2","0x72be5d74f27b896f","0x80deb1fe3b1696b1","0x9bdc06a725c71235","0xc19bf174cf692694","0xe49b69c19ef14ad2","0xefbe4786384f25e3","0x0fc19dc68b8cd5b5","0x240ca1cc77ac9c65","0x2de92c6f592b0275","0x4a7484aa6ea6e483","0x5cb0a9dcbd41fbd4","0x76f988da831153b5","0x983e5152ee66dfab","0xa831c66d2db43210","0xb00327c898fb213f","0xbf597fc7beef0ee4","0xc6e00bf33da88fc2","0xd5a79147930aa725","0x06ca6351e003826f","0x142929670a0e6e70","0x27b70a8546d22ffc","0x2e1b21385c26c926","0x4d2c6dfc5ac42aed","0x53380d139d95b3df","0x650a73548baf63de","0x766a0abb3c77b2a8","0x81c2c92e47edaee6","0x92722c851482353b","0xa2bfe8a14cf10364","0xa81a664bbc423001","0xc24b8b70d0f89791","0xc76c51a30654be30","0xd192e819d6ef5218","0xd69906245565a910","0xf40e35855771202a","0x106aa07032bbd1b8","0x19a4c116b8d2d0c8","0x1e376c085141ab53","0x2748774cdf8eeb99","0x34b0bcb5e19b48a8","0x391c0cb3c5c95a63","0x4ed8aa4ae3418acb","0x5b9cca4f7763e373","0x682e6ff3d6b2b8a3","0x748f82ee5defb2fc","0x78a5636f43172f60","0x84c87814a1f0ab72","0x8cc702081a6439ec","0x90befffa23631e28","0xa4506cebde82bde9","0xbef9a3f7b2c67915","0xc67178f2e372532b","0xca273eceea26619c","0xd186b8c721c0c207","0xeada7dd6cde0eb1e","0xf57d4f7fee6ed178","0x06f067aa72176fba","0x0a637dc5a2c898a6","0x113f9804bef90dae","0x1b710b35131c471b","0x28db77f523047d84","0x32caab7b40c72493","0x3c9ebe0a15c9bebc","0x431d67c49c100d4c","0x4cc5d4becb3e42b6","0x597f299cfc657e2a","0x5fcb6fab3ad6faec","0x6c44198c4a475817"].map(s=>BigInt(s))),Gt=new Uint32Array(80),Kt=new Uint32Array(80);class Yn extends Sn.SHA2{constructor(){super(128,64,16,!1),this.Ah=1779033703,this.Al=-205731576,this.Bh=-1150833019,this.Bl=-2067093701,this.Ch=1013904242,this.Cl=-23791573,this.Dh=-1521486534,this.Dl=1595750129,this.Eh=1359893119,this.El=-1377402159,this.Fh=-1694144372,this.Fl=725511199,this.Gh=528734635,this.Gl=-79577749,this.Hh=1541459225,this.Hl=327033209}get(){const{Ah:i,Al:a,Bh:u,Bl:f,Ch:p,Cl:E,Dh:y,Dl:N,Eh:P,El:B,Fh:D,Fl:b,Gh:x,Gl:O,Hh:U,Hl:q}=this;return[i,a,u,f,p,E,y,N,P,B,D,b,x,O,U,q]}set(i,a,u,f,p,E,y,N,P,B,D,b,x,O,U,q){this.Ah=i|0,this.Al=a|0,this.Bh=u|0,this.Bl=f|0,this.Ch=p|0,this.Cl=E|0,this.Dh=y|0,this.Dl=N|0,this.Eh=P|0,this.El=B|0,this.Fh=D|0,this.Fl=b|0,this.Gh=x|0,this.Gl=O|0,this.Hh=U|0,this.Hl=q|0}process(i,a){for(let ie=0;ie<16;ie++,a+=4)Gt[ie]=i.getUint32(a),Kt[ie]=i.getUint32(a+=4);for(let ie=16;ie<80;ie++){const fe=Gt[ie-15]|0,he=Kt[ie-15]|0,ue=xe.default.rotrSH(fe,he,1)^xe.default.rotrSH(fe,he,8)^xe.default.shrSH(fe,he,7),ge=xe.default.rotrSL(fe,he,1)^xe.default.rotrSL(fe,he,8)^xe.default.shrSL(fe,he,7),be=Gt[ie-2]|0,Le=Kt[ie-2]|0,I=xe.default.rotrSH(be,Le,19)^xe.default.rotrBH(be,Le,61)^xe.default.shrSH(be,Le,6),T=xe.default.rotrSL(be,Le,19)^xe.default.rotrBL(be,Le,61)^xe.default.shrSL(be,Le,6),_=xe.default.add4L(ge,T,Kt[ie-7],Kt[ie-16]),R=xe.default.add4H(_,ue,I,Gt[ie-7],Gt[ie-16]);Gt[ie]=R|0,Kt[ie]=_|0}let{Ah:u,Al:f,Bh:p,Bl:E,Ch:y,Cl:N,Dh:P,Dl:B,Eh:D,El:b,Fh:x,Fl:O,Gh:U,Gl:q,Hh:J,Hl:se}=this;for(let ie=0;ie<80;ie++){const fe=xe.default.rotrSH(D,b,14)^xe.default.rotrSH(D,b,18)^xe.default.rotrBH(D,b,41),he=xe.default.rotrSL(D,b,14)^xe.default.rotrSL(D,b,18)^xe.default.rotrBL(D,b,41),ue=D&x^~D&U,ge=b&O^~b&q,be=xe.default.add5L(se,he,ge,Wu[ie],Kt[ie]),Le=xe.default.add5H(be,J,fe,ue,Ku[ie],Gt[ie]),I=be|0,T=xe.default.rotrSH(u,f,28)^xe.default.rotrBH(u,f,34)^xe.default.rotrBH(u,f,39),_=xe.default.rotrSL(u,f,28)^xe.default.rotrBL(u,f,34)^xe.default.rotrBL(u,f,39),R=u&p^u&y^p&y,j=f&E^f&N^E&N;J=U|0,se=q|0,U=x|0,q=O|0,x=D|0,O=b|0,{h:D,l:b}=xe.default.add(P|0,B|0,Le|0,I|0),P=y|0,B=N|0,y=p|0,N=E|0,p=u|0,E=f|0;const ne=xe.default.add3L(I,_,j);u=xe.default.add3H(ne,Le,T,R),f=ne|0}({h:u,l:f}=xe.default.add(this.Ah|0,this.Al|0,u|0,f|0)),{h:p,l:E}=xe.default.add(this.Bh|0,this.Bl|0,p|0,E|0),{h:y,l:N}=xe.default.add(this.Ch|0,this.Cl|0,y|0,N|0),{h:P,l:B}=xe.default.add(this.Dh|0,this.Dl|0,P|0,B|0),{h:D,l:b}=xe.default.add(this.Eh|0,this.El|0,D|0,b|0),{h:x,l:O}=xe.default.add(this.Fh|0,this.Fl|0,x|0,O|0),{h:U,l:q}=xe.default.add(this.Gh|0,this.Gl|0,U|0,q|0),{h:J,l:se}=xe.default.add(this.Hh|0,this.Hl|0,J|0,se|0),this.set(u,f,p,E,y,N,P,B,D,b,x,O,U,q,J,se)}roundClean(){Gt.fill(0),Kt.fill(0)}destroy(){this.buffer.fill(0),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}tt.SHA512=Yn;class Qu extends Yn{constructor(){super(),this.Ah=-1942145080,this.Al=424955298,this.Bh=1944164710,this.Bl=-1982016298,this.Ch=502970286,this.Cl=855612546,this.Dh=1738396948,this.Dl=1479516111,this.Eh=258812777,this.El=2077511080,this.Fh=2011393907,this.Fl=79989058,this.Gh=1067287976,this.Gl=1780299464,this.Hh=286451373,this.Hl=-1848208735,this.outputLen=28}}class Yu extends Yn{constructor(){super(),this.Ah=573645204,this.Al=-64227540,this.Bh=-1621794909,this.Bl=-934517566,this.Ch=596883563,this.Cl=1867755857,this.Dh=-1774684391,this.Dl=1497426621,this.Eh=-1775747358,this.El=-1467023389,this.Fh=-1101128155,this.Fl=1401305490,this.Gh=721525244,this.Gl=746961066,this.Hh=246885852,this.Hl=-2117784414,this.outputLen=32}}class Xu extends Yn{constructor(){super(),this.Ah=-876896931,this.Al=-1056596264,this.Bh=1654270250,this.Bl=914150663,this.Ch=-1856437926,this.Cl=812702999,this.Dh=355462360,this.Dl=-150054599,this.Eh=1731405415,this.El=-4191439,this.Fh=-1900787065,this.Fl=1750603025,this.Gh=-619958771,this.Gl=1694076839,this.Hh=1203062813,this.Hl=-1090891868,this.outputLen=48}}tt.sha512=(0,de.wrapConstructor)(()=>new Yn),tt.sha512_224=(0,de.wrapConstructor)(()=>new Qu),tt.sha512_256=(0,de.wrapConstructor)(()=>new Yu),tt.sha384=(0,de.wrapConstructor)(()=>new Xu);const Ju=s=>s[0]==="あいこくしん";function ms(s){if(typeof s!="string")throw new TypeError(`Invalid mnemonic type: ${typeof s}`);return s.normalize("NFKD")}function li(s){const i=ms(s),a=i.split(" ");if(![12,15,18,21,24].includes(a.length))throw new Error("Invalid mnemonic");return{nfkd:i,words:a}}function bs(s){Te.default.bytes(s,16,20,24,28,32)}function eh(s,i=128){if(Te.default.number(i),i%32!==0||i>256)throw new TypeError("Invalid entropy");return Es((0,de.randomBytes)(i/8),s)}Qe.generateMnemonic=eh;const th=s=>{const i=8-s.length/4;return new Uint8Array([(0,rt.sha256)(s)[0]>>i<<i])};function ws(s){if(!Array.isArray(s)||s.length!==2048||typeof s[0]!="string")throw new Error("Worlist: expected array of 2048 strings");return s.forEach(i=>{if(typeof i!="string")throw new Error(`Wordlist: non-string element: ${i}`)}),br.chain(br.checksum(1,th),br.radix2(11,!0),br.alphabet(s))}function vs(s,i){const{words:a}=li(s),u=ws(i).decode(a);return bs(u),u}Qe.mnemonicToEntropy=vs;function Es(s,i){return bs(s),ws(i).encode(s).join(Ju(i)?"　":" ")}Qe.entropyToMnemonic=Es;function nh(s,i){try{vs(s,i)}catch{return!1}return!0}Qe.validateMnemonic=nh;const xs=s=>ms(`mnemonic${s}`);function rh(s,i=""){return(0,pn.pbkdf2Async)(tt.sha512,li(s).nfkd,xs(i),{c:2048,dkLen:64})}Qe.mnemonicToSeed=rh;function ih(s,i=""){return(0,pn.pbkdf2)(tt.sha512,li(s).nfkd,xs(i),{c:2048,dkLen:64})}Qe.mnemonicToSeedSync=ih;var In={};Object.defineProperty(In,"__esModule",{value:!0}),In.ripemd160=In.RIPEMD160=void 0;const oh=new Uint8Array([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),$s=Uint8Array.from({length:16},(s,i)=>i),sh=$s.map(s=>(9*s+5)%16);let ui=[$s],hi=[sh];for(let s=0;s<4;s++)for(let i of[ui,hi])i.push(i[s].map(a=>oh[a]));const As=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(s=>new Uint8Array(s)),ah=ui.map((s,i)=>s.map(a=>As[i][a])),ch=hi.map((s,i)=>s.map(a=>As[i][a])),lh=new Uint32Array([0,1518500249,1859775393,2400959708,2840853838]),uh=new Uint32Array([1352829926,1548603684,1836072691,2053994217,0]),Er=(s,i)=>s<<i|s>>>32-i;function _s(s,i,a,u){return s===0?i^a^u:s===1?i&a|~i&u:s===2?(i|~a)^u:s===3?i&u|a&~u:i^(a|~u)}const xr=new Uint32Array(16);class ks extends Sn.SHA2{constructor(){super(64,20,8,!0),this.h0=1732584193,this.h1=-271733879,this.h2=-1732584194,this.h3=271733878,this.h4=-1009589776}get(){const{h0:i,h1:a,h2:u,h3:f,h4:p}=this;return[i,a,u,f,p]}set(i,a,u,f,p){this.h0=i|0,this.h1=a|0,this.h2=u|0,this.h3=f|0,this.h4=p|0}process(i,a){for(let x=0;x<16;x++,a+=4)xr[x]=i.getUint32(a,!0);let u=this.h0|0,f=u,p=this.h1|0,E=p,y=this.h2|0,N=y,P=this.h3|0,B=P,D=this.h4|0,b=D;for(let x=0;x<5;x++){const O=4-x,U=lh[x],q=uh[x],J=ui[x],se=hi[x],ie=ah[x],fe=ch[x];for(let he=0;he<16;he++){const ue=Er(u+_s(x,p,y,P)+xr[J[he]]+U,ie[he])+D|0;u=D,D=P,P=Er(y,10)|0,y=p,p=ue}for(let he=0;he<16;he++){const ue=Er(f+_s(O,E,N,B)+xr[se[he]]+q,fe[he])+b|0;f=b,b=B,B=Er(N,10)|0,N=E,E=ue}}this.set(this.h1+y+B|0,this.h2+P+b|0,this.h3+D+f|0,this.h4+u+E|0,this.h0+p+N|0)}roundClean(){xr.fill(0)}destroy(){this.destroyed=!0,this.buffer.fill(0),this.set(0,0,0,0,0)}}In.RIPEMD160=ks,In.ripemd160=(0,de.wrapConstructor)(()=>new ks),Ie.hmacSha256Sync=(s,...i)=>(0,Nt.hmac)(rt.sha256,s,Ie.concatBytes(...i));const di=xu(rt.sha256);function Ss(s){return BigInt(`0x${(0,de.bytesToHex)(s)}`)}function hh(s){return(0,de.hexToBytes)(s.toString(16).padStart(64,"0"))}const dh=(0,de.utf8ToBytes)("Bitcoin seed"),fi={private:76066276,public:76067358},pi=2147483648,fh=s=>(0,In.ripemd160)((0,rt.sha256)(s)),ph=s=>(0,de.createView)(s).getUint32(0,!1),$r=s=>{if(!Number.isSafeInteger(s)||s<0||s>2**32-1)throw new Error(`Invalid number=${s}. Should be from 0 to 2 ** 32 - 1`);const i=new Uint8Array(4);return(0,de.createView)(i).setUint32(0,s,!1),i};class gn{constructor(i){if(this.depth=0,this.index=0,this.chainCode=null,this.parentFingerprint=0,!i||typeof i!="object")throw new Error("HDKey.constructor must not be called directly");if(this.versions=i.versions||fi,this.depth=i.depth||0,this.chainCode=i.chainCode,this.index=i.index||0,this.parentFingerprint=i.parentFingerprint||0,!this.depth&&(this.parentFingerprint||this.index))throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");if(i.publicKey&&i.privateKey)throw new Error("HDKey: publicKey and privateKey at same time.");if(i.privateKey){if(!Ie.isValidPrivateKey(i.privateKey))throw new Error("Invalid private key");this.privKey=typeof i.privateKey=="bigint"?i.privateKey:Ss(i.privateKey),this.privKeyBytes=hh(this.privKey),this.pubKey=Dl(i.privateKey,!0)}else if(i.publicKey)this.pubKey=A.fromHex(i.publicKey).toRawBytes(!0);else throw new Error("HDKey: no public or private key provided");this.pubHash=fh(this.pubKey)}get fingerprint(){if(!this.pubHash)throw new Error("No publicKey set!");return ph(this.pubHash)}get identifier(){return this.pubHash}get pubKeyHash(){return this.pubHash}get privateKey(){return this.privKeyBytes||null}get publicKey(){return this.pubKey||null}get privateExtendedKey(){const i=this.privateKey;if(!i)throw new Error("No private key");return di.encode(this.serialize(this.versions.private,(0,de.concatBytes)(new Uint8Array([0]),i)))}get publicExtendedKey(){if(!this.pubKey)throw new Error("No public key");return di.encode(this.serialize(this.versions.public,this.pubKey))}static fromMasterSeed(i,a=fi){if((0,Te.bytes)(i),8*i.length<128||8*i.length>512)throw new Error(`HDKey: wrong seed length=${i.length}. Should be between 128 and 512 bits; 256 bits is advised)`);const u=(0,Nt.hmac)(tt.sha512,dh,i);return new gn({versions:a,chainCode:u.slice(32),privateKey:u.slice(0,32)})}static fromExtendedKey(i,a=fi){const u=di.decode(i),f=(0,de.createView)(u),p=f.getUint32(0,!1),E={versions:a,depth:u[4],parentFingerprint:f.getUint32(5,!1),index:f.getUint32(9,!1),chainCode:u.slice(13,45)},y=u.slice(45),N=y[0]===0;if(p!==a[N?"private":"public"])throw new Error("Version mismatch");return N?new gn({...E,privateKey:y.slice(1)}):new gn({...E,publicKey:y})}static fromJSON(i){return gn.fromExtendedKey(i.xpriv)}derive(i){if(!/^[mM]'?/.test(i))throw new Error('Path must start with "m" or "M"');if(/^[mM]'?$/.test(i))return this;const a=i.replace(/^[mM]'?\//,"").split("/");let u=this;for(const f of a){const p=/^(\d+)('?)$/.exec(f);if(!p||p.length!==3)throw new Error(`Invalid child index: ${f}`);let E=+p[1];if(!Number.isSafeInteger(E)||E>=pi)throw new Error("Invalid index");p[2]==="'"&&(E+=pi),u=u.deriveChild(E)}return u}deriveChild(i){if(!this.pubKey||!this.chainCode)throw new Error("No publicKey or chainCode set");let a=$r(i);if(i>=pi){const y=this.privateKey;if(!y)throw new Error("Could not derive hardened child key");a=(0,de.concatBytes)(new Uint8Array([0]),y,a)}else a=(0,de.concatBytes)(this.pubKey,a);const u=(0,Nt.hmac)(tt.sha512,this.chainCode,a),f=Ss(u.slice(0,32)),p=u.slice(32);if(!Ie.isValidPrivateKey(f))throw new Error("Tweak bigger than curve order");const E={versions:this.versions,chainCode:p,depth:this.depth+1,parentFingerprint:this.fingerprint,index:i};try{if(this.privateKey){const y=Ie.mod(this.privKey+f,v.n);if(!Ie.isValidPrivateKey(y))throw new Error("The tweak was out of range or the resulted private key is invalid");E.privateKey=y}else{const y=A.fromHex(this.pubKey).add(A.fromPrivateKey(f));if(y.equals(A.ZERO))throw new Error("The tweak was equal to negative P, which made the result key invalid");E.publicKey=y.toRawBytes(!0)}return new gn(E)}catch{return this.deriveChild(i+1)}}sign(i){if(!this.privateKey)throw new Error("No privateKey set!");return(0,Te.bytes)(i,32),Fl(i,this.privKey,{canonical:!0,der:!1})}verify(i,a){if((0,Te.bytes)(i,32),(0,Te.bytes)(a,64),!this.publicKey)throw new Error("No publicKey set!");let u;try{u=Y.fromCompact(a)}catch{return!1}return Zl(u,i,this.publicKey)}wipePrivateData(){return this.privKey=void 0,this.privKeyBytes&&(this.privKeyBytes.fill(0),this.privKeyBytes=void 0),this}toJSON(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}}serialize(i,a){if(!this.chainCode)throw new Error("No chainCode set");return(0,Te.bytes)(a,33),(0,de.concatBytes)($r(i),new Uint8Array([this.depth]),$r(this.parentFingerprint),$r(this.index),this.chainCode,a)}}var gh=Object.defineProperty,ot=(s,i)=>{for(var a in i)gh(s,a,{get:i[a],enumerable:!0})};function yh(){return Ie.bytesToHex(Ie.randomPrivateKey())}function Is(s){return Ie.bytesToHex(Vn.getPublicKey(s))}var mh={};ot(mh,{insertEventIntoAscendingList:()=>wh,insertEventIntoDescendingList:()=>bh,normalizeURL:()=>gi,utf8Decoder:()=>Wt,utf8Encoder:()=>At});var Wt=new TextDecoder("utf-8"),At=new TextEncoder;function gi(s){let i=new URL(s);return i.pathname=i.pathname.replace(/\/+/g,"/"),i.pathname.endsWith("/")&&(i.pathname=i.pathname.slice(0,-1)),(i.port==="80"&&i.protocol==="ws:"||i.port==="443"&&i.protocol==="wss:")&&(i.port=""),i.searchParams.sort(),i.hash="",i.toString()}function bh(s,i){let a=0,u=s.length-1,f,p=a;if(u<0)p=0;else if(i.created_at<s[u].created_at)p=u+1;else if(i.created_at>=s[a].created_at)p=a;else for(;;){if(u<=a+1){p=u;break}if(f=Math.floor(a+(u-a)/2),s[f].created_at>i.created_at)a=f;else if(s[f].created_at<i.created_at)u=f;else{p=f;break}}return s[p]?.id!==i.id?[...s.slice(0,p),i,...s.slice(p)]:s}function wh(s,i){let a=0,u=s.length-1,f,p=a;if(u<0)p=0;else if(i.created_at>s[u].created_at)p=u+1;else if(i.created_at<=s[a].created_at)p=a;else for(;;){if(u<=a+1){p=u;break}if(f=Math.floor(a+(u-a)/2),s[f].created_at<i.created_at)a=f;else if(s[f].created_at>i.created_at)u=f;else{p=f;break}}return s[p]?.id!==i.id?[...s.slice(0,p),i,...s.slice(p)]:s}function vh(s,i){let a=s;return a.pubkey=Is(i),a.id=yi(a),a.sig=$h(a,i),a}function Eh(s){if(!mi(s))throw new Error("can't serialize event with wrong or missing properties");return JSON.stringify([0,s.pubkey,s.created_at,s.kind,s.tags,s.content])}function yi(s){let i=(0,rt.sha256)(At.encode(Eh(s)));return Ie.bytesToHex(i)}var xh=s=>s instanceof Object;function mi(s){if(!xh(s)||typeof s.kind!="number"||typeof s.content!="string"||typeof s.created_at!="number"||typeof s.pubkey!="string"||!s.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(s.tags))return!1;for(let i=0;i<s.tags.length;i++){let a=s.tags[i];if(!Array.isArray(a))return!1;for(let u=0;u<a.length;u++)if(typeof a[u]=="object")return!1}return!0}function Cs(s){return Vn.verifySync(s.sig,yi(s),s.pubkey)}function $h(s,i){return Ie.bytesToHex(Vn.signSync(yi(s),i))}function Ah(s,i){if(s.ids&&s.ids.indexOf(i.id)===-1&&!s.ids.some(a=>i.id.startsWith(a))||s.kinds&&s.kinds.indexOf(i.kind)===-1||s.authors&&s.authors.indexOf(i.pubkey)===-1&&!s.authors.some(a=>i.pubkey.startsWith(a)))return!1;for(let a in s)if(a[0]==="#"){let u=a.slice(1),f=s[`#${u}`];if(f&&!i.tags.find(([p,E])=>p===a.slice(1)&&f.indexOf(E)!==-1))return!1}return!(s.since&&i.created_at<s.since||s.until&&i.created_at>=s.until)}function _h(s,i){for(let a=0;a<s.length;a++)if(Ah(s[a],i))return!0;return!1}var kh={};ot(kh,{getHex64:()=>Ar,getInt:()=>Ts,getSubscriptionId:()=>Ls,matchEventId:()=>Sh,matchEventKind:()=>Ch,matchEventPubkey:()=>Ih});function Ar(s,i){let a=i.length+3,u=s.indexOf(`"${i}":`)+a,f=s.slice(u).indexOf('"')+u+1;return s.slice(f,f+64)}function Ts(s,i){let a=i.length,u=s.indexOf(`"${i}":`)+a+3,f=s.slice(u),p=Math.min(f.indexOf(","),f.indexOf("}"));return parseInt(f.slice(0,p),10)}function Ls(s){let i=s.slice(0,22).indexOf('"EVENT"');if(i===-1)return null;let a=s.slice(i+7+1).indexOf('"');if(a===-1)return null;let u=i+7+1+a,f=s.slice(u+1,80).indexOf('"');if(f===-1)return null;let p=u+1+f;return s.slice(u+1,p)}function Sh(s,i){return i===Ar(s,"id")}function Ih(s,i){return i===Ar(s,"pubkey")}function Ch(s,i){return i===Ts(s,"kind")}var Os=()=>({connect:[],disconnect:[],error:[],notice:[],auth:[]});function Th(s,i={}){let{listTimeout:a=3e3,getTimeout:u=3e3,countTimeout:f=3e3}=i;var p,E={},y=Os(),N={},P={},B;async function D(){return B||(B=new Promise((J,se)=>{try{p=new WebSocket(s)}catch(ue){se(ue)}p.onopen=()=>{y.connect.forEach(ue=>ue()),J()},p.onerror=()=>{B=void 0,y.error.forEach(ue=>ue()),se()},p.onclose=async()=>{B=void 0,y.disconnect.forEach(ue=>ue())};let ie=[],fe;p.onmessage=ue=>{ie.push(ue.data),fe||(fe=setInterval(he,0))};function he(){if(ie.length===0){clearInterval(fe),fe=null;return}var ue=ie.shift();if(!ue)return;let ge=Ls(ue);if(ge){let be=E[ge];if(be&&be.alreadyHaveEvent&&be.alreadyHaveEvent(Ar(ue,"id"),s))return}try{let be=JSON.parse(ue);switch(be[0]){case"EVENT":{let _=be[1],R=be[2];mi(R)&&E[_]&&(E[_].skipVerification||Cs(R))&&_h(E[_].filters,R)&&(E[_],(N[_]?.event||[]).forEach(j=>j(R)));return}case"COUNT":let Le=be[1],I=be[2];E[Le]&&(N[Le]?.count||[]).forEach(_=>_(I));return;case"EOSE":{let _=be[1];_ in N&&(N[_].eose.forEach(R=>R()),N[_].eose=[]);return}case"OK":{let _=be[1],R=be[2],j=be[3]||"";_ in P&&(R?P[_].ok.forEach(ne=>ne()):P[_].failed.forEach(ne=>ne(j)),P[_].ok=[],P[_].failed=[]);return}case"NOTICE":let T=be[1];y.notice.forEach(_=>_(T));return;case"AUTH":{let _=be[1];y.auth?.forEach(R=>R(_));return}}}catch{return}}}),B)}function b(){return p?.readyState===1}async function x(){b()||await D()}async function O(J){let se=JSON.stringify(J);if(!(!b()&&(await new Promise(ie=>setTimeout(ie,1e3)),!b())))try{p.send(se)}catch(ie){console.log(ie)}}const U=(J,{verb:se="REQ",skipVerification:ie=!1,alreadyHaveEvent:fe=null,id:he=Math.random().toString().slice(2)}={})=>{let ue=he;return E[ue]={id:ue,filters:J,skipVerification:ie,alreadyHaveEvent:fe},O([se,ue,...J]),{sub:(ge,be={})=>U(ge||J,{skipVerification:be.skipVerification||ie,alreadyHaveEvent:be.alreadyHaveEvent||fe,id:ue}),unsub:()=>{delete E[ue],delete N[ue],O(["CLOSE",ue])},on:(ge,be)=>{N[ue]=N[ue]||{event:[],count:[],eose:[]},N[ue][ge].push(be)},off:(ge,be)=>{let Le=N[ue],I=Le[ge].indexOf(be);I>=0&&Le[ge].splice(I,1)}}};function q(J,se){if(!J.id)throw new Error(`event ${J} has no id`);let ie=J.id;return O([se,J]),{on:(fe,he)=>{P[ie]=P[ie]||{ok:[],failed:[]},P[ie][fe].push(he)},off:(fe,he)=>{let ue=P[ie];if(!ue)return;let ge=ue[fe].indexOf(he);ge>=0&&ue[fe].splice(ge,1)}}}return{url:s,sub:U,on:(J,se)=>{y[J].push(se),J==="connect"&&p?.readyState===1&&se()},off:(J,se)=>{let ie=y[J].indexOf(se);ie!==-1&&y[J].splice(ie,1)},list:(J,se)=>new Promise(ie=>{let fe=U(J,se),he=[],ue=setTimeout(()=>{fe.unsub(),ie(he)},a);fe.on("eose",()=>{fe.unsub(),clearTimeout(ue),ie(he)}),fe.on("event",ge=>{he.push(ge)})}),get:(J,se)=>new Promise(ie=>{let fe=U([J],se),he=setTimeout(()=>{fe.unsub(),ie(null)},u);fe.on("event",ue=>{fe.unsub(),clearTimeout(he),ie(ue)})}),count:J=>new Promise(se=>{let ie=U(J,{...U,verb:"COUNT"}),fe=setTimeout(()=>{ie.unsub(),se(null)},f);ie.on("count",he=>{ie.unsub(),clearTimeout(fe),se(he)})}),publish(J){return q(J,"EVENT")},auth(J){return q(J,"AUTH")},connect:x,close(){y=Os(),N={},P={},p.readyState===WebSocket.OPEN&&p?.close()},get status(){return p?.readyState??3}}}var Ms=class{_conn;_seenOn={};eoseSubTimeout;getTimeout;constructor(s={}){this._conn={},this.eoseSubTimeout=s.eoseSubTimeout||3400,this.getTimeout=s.getTimeout||3400}close(s){s.forEach(i=>{let a=this._conn[gi(i)];a&&a.close()})}async ensureRelay(s){const i=gi(s);this._conn[i]||(this._conn[i]=Th(i,{getTimeout:this.getTimeout*.9,listTimeout:this.getTimeout*.9}));const a=this._conn[i];return await a.connect(),a}sub(s,i,a){let u=new Set,f={...a||{}};f.alreadyHaveEvent=(b,x)=>{if(a?.alreadyHaveEvent?.(b,x))return!0;let O=this._seenOn[b]||new Set;return O.add(x),this._seenOn[b]=O,u.has(b)};let p=[],E=new Set,y=new Set,N=s.length,P=!1,B=setTimeout(()=>{P=!0;for(let b of y.values())b()},this.eoseSubTimeout);s.forEach(async b=>{let x;try{x=await this.ensureRelay(b)}catch{U();return}if(!x)return;let O=x.sub(i,f);O.on("event",q=>{u.add(q.id);for(let J of E.values())J(q)}),O.on("eose",()=>{P||U()}),p.push(O);function U(){if(N--,N===0){clearTimeout(B);for(let q of y.values())q()}}});let D={sub(b,x){return p.forEach(O=>O.sub(b,x)),D},unsub(){p.forEach(b=>b.unsub())},on(b,x){b==="event"?E.add(x):b==="eose"&&y.add(x)},off(b,x){b==="event"?E.delete(x):b==="eose"&&y.delete(x)}};return D}get(s,i,a){return new Promise(u=>{let f=this.sub(s,[i],a),p=setTimeout(()=>{f.unsub(),u(null)},this.getTimeout);f.on("event",E=>{u(E),clearTimeout(p),f.unsub()})})}list(s,i,a){return new Promise(u=>{let f=[],p=this.sub(s,i,a);p.on("event",E=>{f.push(E)}),p.on("eose",()=>{p.unsub(),u(f)})})}publish(s,i){const a=s.map(async f=>{let p;try{return p=await this.ensureRelay(f),p.publish(i)}catch{return{on(){},off(){}}}}),u=new Map;return{on(f,p){s.forEach(async(E,y)=>{let N=await a[y],P=()=>p(E);u.set(p,P),N.on(f,P)})},off(f,p){s.forEach(async(E,y)=>{let N=u.get(p);N&&(await a[y]).off(f,N)})}}}seenOn(s){return Array.from(this._seenOn[s]?.values?.()||[])}},bi={};ot(bi,{decode:()=>_r,naddrEncode:()=>Rh,neventEncode:()=>Bh,noteEncode:()=>Mh,nprofileEncode:()=>Nh,npubEncode:()=>Oh,nrelayEncode:()=>zh,nsecEncode:()=>Lh});var Cn=5e3;function _r(s){let{prefix:i,words:a}=it.decode(s,Cn),u=new Uint8Array(it.fromWords(a));switch(i){case"nprofile":{let f=kr(u);if(!f[0]?.[0])throw new Error("missing TLV 0 for nprofile");if(f[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");return{type:"nprofile",data:{pubkey:Ie.bytesToHex(f[0][0]),relays:f[1]?f[1].map(p=>Wt.decode(p)):[]}}}case"nevent":{let f=kr(u);if(!f[0]?.[0])throw new Error("missing TLV 0 for nevent");if(f[0][0].length!==32)throw new Error("TLV 0 should be 32 bytes");if(f[2]&&f[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");return{type:"nevent",data:{id:Ie.bytesToHex(f[0][0]),relays:f[1]?f[1].map(p=>Wt.decode(p)):[],author:f[2]?.[0]?Ie.bytesToHex(f[2][0]):void 0}}}case"naddr":{let f=kr(u);if(!f[0]?.[0])throw new Error("missing TLV 0 for naddr");if(!f[2]?.[0])throw new Error("missing TLV 2 for naddr");if(f[2][0].length!==32)throw new Error("TLV 2 should be 32 bytes");if(!f[3]?.[0])throw new Error("missing TLV 3 for naddr");if(f[3][0].length!==4)throw new Error("TLV 3 should be 4 bytes");return{type:"naddr",data:{identifier:Wt.decode(f[0][0]),pubkey:Ie.bytesToHex(f[2][0]),kind:parseInt(Ie.bytesToHex(f[3][0]),16),relays:f[1]?f[1].map(p=>Wt.decode(p)):[]}}}case"nrelay":{let f=kr(u);if(!f[0]?.[0])throw new Error("missing TLV 0 for nrelay");return{type:"nrelay",data:Wt.decode(f[0][0])}}case"nsec":case"npub":case"note":return{type:i,data:Ie.bytesToHex(u)};default:throw new Error(`unknown prefix ${i}`)}}function kr(s){let i={},a=s;for(;a.length>0;){let u=a[0],f=a[1],p=a.slice(2,2+f);a=a.slice(2+f),!(p.length<f)&&(i[u]=i[u]||[],i[u].push(p))}return i}function Lh(s){return wi("nsec",s)}function Oh(s){return wi("npub",s)}function Mh(s){return wi("note",s)}function wi(s,i){let a=Ie.hexToBytes(i),u=it.toWords(a);return it.encode(s,u,Cn)}function Nh(s){let i=Sr({0:[Ie.hexToBytes(s.pubkey)],1:(s.relays||[]).map(u=>At.encode(u))}),a=it.toWords(i);return it.encode("nprofile",a,Cn)}function Bh(s){let i=Sr({0:[Ie.hexToBytes(s.id)],1:(s.relays||[]).map(u=>At.encode(u)),2:s.author?[Ie.hexToBytes(s.author)]:[]}),a=it.toWords(i);return it.encode("nevent",a,Cn)}function Rh(s){let i=new ArrayBuffer(4);new DataView(i).setUint32(0,s.kind,!1);let a=Sr({0:[At.encode(s.identifier)],1:(s.relays||[]).map(f=>At.encode(f)),2:[Ie.hexToBytes(s.pubkey)],3:[new Uint8Array(i)]}),u=it.toWords(a);return it.encode("naddr",u,Cn)}function zh(s){let i=Sr({0:[At.encode(s)]}),a=it.toWords(i);return it.encode("nrelay",a,Cn)}function Sr(s){let i=[];return Object.entries(s).forEach(([a,u])=>{u.forEach(f=>{let p=new Uint8Array(f.length+2);p.set([parseInt(a)],0),p.set([f.length],1),p.set(f,2),i.push(p)})}),Ie.concatBytes(...i)}var Uh={};ot(Uh,{decrypt:()=>Ph,encrypt:()=>Dh});async function Dh(s,i,a){const u=jo(s,"02"+i),f=Ns(u);let p=Uint8Array.from((0,de.randomBytes)(16)),E=At.encode(a),y=await crypto.subtle.importKey("raw",f,{name:"AES-CBC"},!1,["encrypt"]),N=await crypto.subtle.encrypt({name:"AES-CBC",iv:p},y,E),P=Kn.encode(new Uint8Array(N)),B=Kn.encode(new Uint8Array(p.buffer));return`${P}?iv=${B}`}async function Ph(s,i,a){let[u,f]=a.split("?iv="),p=jo(s,"02"+i),E=Ns(p),y=await crypto.subtle.importKey("raw",E,{name:"AES-CBC"},!1,["decrypt"]),N=Kn.decode(u),P=Kn.decode(f),B=await crypto.subtle.decrypt({name:"AES-CBC",iv:P},y,N);return Wt.decode(B)}function Ns(s){return s.slice(1,33)}var Hh={};ot(Hh,{queryProfile:()=>qh,searchDomain:()=>Fh,useFetchImplementation:()=>jh});var Ir;try{Ir=fetch}catch{}function jh(s){Ir=s}async function Fh(s,i=""){try{return(await(await Ir(`https://${s}/.well-known/nostr.json?name=${i}`)).json()).names}catch{return{}}}async function qh(s){let[i,a]=s.split("@");if(a||(a=i,i="_"),!i.match(/^[A-Za-z0-9-_.]+$/)||!a.includes("."))return null;let u;try{u=await(await Ir(`https://${a}/.well-known/nostr.json?name=${i}`)).json()}catch{return null}if(!u?.names?.[i])return null;let f=u.names[i],p=u.relays?.[f]||[];return{pubkey:f,relays:p}}var Zh={};ot(Zh,{generateSeedWords:()=>Gh,privateKeyFromSeedWords:()=>Vh,validateWords:()=>Kh});function Vh(s,i){let u=gn.fromMasterSeed((0,Qe.mnemonicToSeedSync)(s,i)).derive("m/44'/1237'/0'/0/0").privateKey;if(!u)throw new Error("could not derive private key");return Ie.bytesToHex(u)}function Gh(){return(0,Qe.generateMnemonic)(Qn.wordlist)}function Kh(s){return(0,Qe.validateMnemonic)(s,Qn.wordlist)}var Wh={};ot(Wh,{parse:()=>Qh});function Qh(s){const i={reply:void 0,root:void 0,mentions:[],profiles:[]},a=[];for(const u of s.tags)u[0]==="e"&&u[1]&&a.push(u),u[0]==="p"&&u[1]&&i.profiles.push({pubkey:u[1],relays:u[2]?[u[2]]:[]});for(let u=0;u<a.length;u++){const f=a[u],[p,E,y,N]=f,P={id:E,relays:y?[y]:[]},B=u===0,D=u===a.length-1;if(N==="root"){i.root=P;continue}if(N==="reply"){i.reply=P;continue}if(N==="mention"){i.mentions.push(P);continue}if(B){i.root=P;continue}if(D){i.reply=P;continue}i.mentions.push(P)}return i}var Yh={};ot(Yh,{getPow:()=>Xh});function Xh(s){return Jh(Ie.hexToBytes(s))}function Jh(s){let i,a,u;for(a=0,i=0;a<s.length&&(u=ed(s[a]),i+=u,u===8);a++);return i}function ed(s){let i=0;if(s===0)return 8;for(;s>>=1;)i++;return 7-i}var td={};ot(td,{BECH32_REGEX:()=>Bs,NOSTR_URI_REGEX:()=>Cr,parse:()=>rd,test:()=>nd});var Bs=/[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/,Cr=new RegExp(`nostr:(${Bs.source})`);function nd(s){return typeof s=="string"&&new RegExp(`^${Cr.source}$`).test(s)}function rd(s){const i=s.match(new RegExp(`^${Cr.source}$`));if(!i)throw new Error(`Invalid Nostr URI: ${s}`);return{uri:i[0],value:i[1],decoded:_r(i[1])}}var id={};ot(id,{createDelegation:()=>od,getDelegator:()=>sd});function od(s,i){let a=[];(i.kind||-1)>=0&&a.push(`kind=${i.kind}`),i.until&&a.push(`created_at<${i.until}`),i.since&&a.push(`created_at>${i.since}`);let u=a.join("&");if(u==="")throw new Error("refusing to create a delegation without any conditions");let f=(0,rt.sha256)(At.encode(`nostr:delegation:${i.pubkey}:${u}`)),p=Ie.bytesToHex(Vn.signSync(f,s));return{from:Is(s),to:i.pubkey,cond:u,sig:p}}function sd(s){let i=s.tags.find(y=>y[0]==="delegation"&&y.length>=4);if(!i)return null;let a=i[1],u=i[2],f=i[3],p=u.split("&");for(let y=0;y<p.length;y++){let[N,P,B]=p[y].split(/\b/);if(!(N==="kind"&&P==="="&&s.kind===parseInt(B))){if(N==="created_at"&&P==="<"&&s.created_at<parseInt(B))continue;if(N==="created_at"&&P===">"&&s.created_at>parseInt(B))continue;return null}}let E=(0,rt.sha256)(At.encode(`nostr:delegation:${s.pubkey}:${u}`));return Vn.verifySync(f,E,a)?a:null}var ad={};ot(ad,{matchAll:()=>cd,regex:()=>vi,replaceAll:()=>ld});var vi=()=>new RegExp(`\\b${Cr.source}\\b`,"g");function*cd(s){const i=s.matchAll(vi());for(const a of i){const[u,f]=a;yield{uri:u,value:f,decoded:_r(f),start:a.index,end:a.index+u.length}}}function ld(s,i){return s.replaceAll(vi(),(a,u)=>i({uri:a,value:u,decoded:_r(u)}))}var ud={};ot(ud,{useFetchImplementation:()=>hd,validateGithub:()=>dd});var Ei;try{Ei=fetch}catch{}function hd(s){Ei=s}async function dd(s,i,a){try{return await(await Ei(`https://gist.github.com/${i}/${a}/raw`)).text()===`Verifying that I control the following Nostr public key: ${s}`}catch{return!1}}var fd={};ot(fd,{authenticate:()=>pd});var pd=async({challenge:s,relay:i,sign:a})=>{const u={kind:22242,created_at:Math.floor(Date.now()/1e3),tags:[["relay",i.url],["challenge",s]],content:""},f=i.auth(await a(u));return new Promise((p,E)=>{f.on("ok",function y(){f.off("ok",y),p()}),f.on("failed",function y(N){f.off("failed",y),E(N)})})},xi={};ot(xi,{getZapEndpoint:()=>yd,makeZapReceipt:()=>wd,makeZapRequest:()=>md,useFetchImplementation:()=>gd,validateZapRequest:()=>bd});var $i;try{$i=fetch}catch{}function gd(s){$i=s}async function yd(s){try{let i="",{lud06:a,lud16:u}=JSON.parse(s.content);if(a){let{words:E}=it.decode(a,1e3),y=it.fromWords(E);i=Wt.decode(y)}else if(u){let[E,y]=u.split("@");i=`https://${y}/.well-known/lnurlp/${E}`}else return null;let p=await(await $i(i)).json();if(p.allowsNostr&&p.nostrPubkey)return p.callback}catch{}return null}function md({profile:s,event:i,amount:a,relays:u,comment:f=""}){if(!a)throw new Error("amount not given");if(!s)throw new Error("profile not given");let p={kind:9734,created_at:Math.round(Date.now()/1e3),content:f,tags:[["p",s],["amount",a.toString()],["relays",...u]]};return i&&p.tags.push(["e",i]),p}function bd(s){let i;try{i=JSON.parse(s)}catch{return"Invalid zap request JSON."}if(!mi(i))return"Zap request is not a valid Nostr event.";if(!Cs(i))return"Invalid signature on zap request.";let a=i.tags.find(([p,E])=>p==="p"&&E);if(!a)return"Zap request doesn't have a 'p' tag.";if(!a[1].match(/^[a-f0-9]{64}$/))return"Zap request 'p' tag is not valid hex.";let u=i.tags.find(([p,E])=>p==="e"&&E);return u&&!u[1].match(/^[a-f0-9]{64}$/)?"Zap request 'e' tag is not valid hex.":i.tags.find(([p,E])=>p==="relays"&&E)?null:"Zap request doesn't have a 'relays' tag."}function wd({zapRequest:s,preimage:i,bolt11:a,paidAt:u}){let p=JSON.parse(s).tags.filter(([y])=>y==="e"||y==="p"||y==="a"),E={kind:9735,created_at:Math.round(u.getTime()/1e3),content:"",tags:[...p,["bolt11",a],["description",s]]};return i&&E.tags.push(["preimage",i]),E}Ie.hmacSha256Sync=(s,...i)=>(0,Nt.hmac)(rt.sha256,s,Ie.concatBytes(...i)),Ie.sha256Sync=(...s)=>(0,rt.sha256)(Ie.concatBytes(...s));const vd=s=>bi.decode(s).data,Rs=s=>bi.decode(s).data;let zs={};const Ed=async s=>{if(zs[s])return zs[s];const i=new Ms,a=["wss://relay.nostr.band","wss://purplepag.es","wss://relay.damus.io","wss://nostr.wine"];try{return await i.get(a,{authors:[s],kinds:[0]})}catch{throw new Error("failed to fetch user profile :(")}finally{i.close(a)}},xd=s=>JSON.parse(s.content),$d=async s=>{const i=await xi.getZapEndpoint(s);if(!i)throw new Error("failed to retrieve zap endpoint :(");return i},Ad=async(s,i)=>{if(Us()&&!i)try{return await window.nostr.signEvent(s)}catch{}return vh(s,yh())},_d=async({profile:s,nip19Target:i,amount:a,relays:u,comment:f,anon:p})=>{const E=xi.makeZapRequest({profile:s,event:i&&i.startsWith("note")?Rs(i):void 0,amount:a,relays:u,comment:f}),y=i&&i.startsWith("naddr")?Rs(i):void 0;if(y){const N=y.relays?y.relays.reduce((P,B)=>`${B},${P}`,""):"";E.tags.push(["a",`${y.kind}:${y.pubkey}:${y.identifier}`,N])}return(!Us()||p)&&E.tags.push(["anon"]),Ad(E,p)},kd=async({zapEndpoint:s,amount:i,comment:a,authorId:u,nip19Target:f,normalizedRelays:p,anon:E})=>{const y=await _d({profile:u,nip19Target:f,amount:i,relays:p,comment:a,anon:E});let N=`${s}?amount=${i}&nostr=${encodeURIComponent(JSON.stringify(y))}`;a&&(N=`${N}&comment=${encodeURIComponent(a)}`);const P=await fetch(N),{pr:B,reason:D,status:b}=await P.json();if(B)return B;throw b==="ERROR"?new Error(D??"Unable to fetch invoice"):new Error("Unable to fetch invoice")},Us=()=>window!==void 0&&window.nostr!==void 0,Sd=({relays:s,invoice:i,onSuccess:a})=>{const u=new Ms,f=Array.from(new Set([...s,"wss://relay.nostr.band"])),p=()=>{u&&u.close(f)},E=Math.round(Date.now()/1e3),y=setInterval(()=>{u.sub(f,[{kinds:[9735],since:E}]).on("event",P=>{P.tags.find(B=>B[0]==="bolt11"&&B[1]===i)&&(a(),p(),clearInterval(y))})},5e3);return()=>{p(),clearInterval(y)}},Ds="nostrZap.",Ps="lightningUri",Hs=()=>typeof localStorage<"u",Id=s=>{if(Hs())return localStorage.getItem(`${Ds}${s}`)},Cd=(s,i)=>{Hs()&&localStorage.setItem(`${Ds}${s}`,i)},Td=()=>Id(Ps),Ld=s=>Cd(Ps,s);let Ai=null;const Od=s=>{s=s.replace(/^#/,""),s.length===3&&(s=s.split("").map(p=>p+p).join(""));const i=parseInt(s,16),a=i>>16&255,u=i>>8&255,f=i&255;return{r:a,g:u,b:f}},Md=({r:s,g:i,b:a})=>(s*299+i*587+a*114)/1e3,js=s=>{const i=Od(s);return Md(i)<128?"#fff":"#000"},_i=s=>{const i=document.createElement("dialog");return i.classList.add("nostr-zap-dialog"),i.innerHTML=s,i.addEventListener("click",function({clientX:a,clientY:u}){const{left:f,right:p,top:E,bottom:y}=i.getBoundingClientRect();a===0&&u===0||(a<f||a>p||u<E||u>y)&&i.close()}),Ai.appendChild(i),i},Nd=({dialogHeader:s,invoice:i,relays:a,buttonColor:u})=>{const f=Td(),E=_i(`
        <button class="close-button">X</button>
        ${s}
        <div class="qrcode">
          <div class="overlay">copied invoice to clipboard</div>
        </div>
        <p>click QR code to copy invoice</p>
        <select name="lightning-wallet">
          ${[{label:"Default Wallet",value:"lightning:"},{label:"Strike",value:"strike:lightning:"},{label:"Cash App",value:"https://cash.app/launch/lightning/"},{label:"Muun",value:"muun:"},{label:"Blue Wallet",value:"bluewallet:lightning:"},{label:"Wallet of Satoshi",value:"walletofsatoshi:lightning:"},{label:"Zebedee",value:"zebedee:lightning:"},{label:"Zeus LN",value:"zeusln:lightning:"},{label:"Phoenix",value:"phoenix://"},{label:"Breez",value:"breez:"},{label:"Bitcoin Beach",value:"bitcoinbeach://"},{label:"Blixt",value:"blixtwallet:lightning:"},{label:"River",value:"river://"}].map(({label:b,value:x})=>`<option value="${x}" ${f===x?"selected":""}>${b}</option>`).join("")}
        </select>
        <button class="cta-button"
          ${u?`style="background-color: ${u}; color: ${js(u)}"`:""} 
        >Open Wallet</button>
      `),y=E.querySelector(".qrcode"),N=E.querySelector('select[name="lightning-wallet"]'),P=E.querySelector(".cta-button"),B=y.querySelector(".overlay"),D=Sd({relays:a,invoice:i,onSuccess:()=>{E.close()}});return new(e(c))(y,{text:i,quietZone:10}),y.addEventListener("click",function(){navigator.clipboard.writeText(i),B.classList.add("show"),setTimeout(()=>B.classList.remove("show"),2e3)}),P.addEventListener("click",function(){Ld(N.value),window.location.href=`${N.value}${i}`}),E.addEventListener("close",function(){D(),E.remove()}),E.querySelector(".close-button").addEventListener("click",function(){E.close()}),E},Bd=async({npub:s,nip19Target:i,relays:a,buttonColor:u,anon:f})=>{const p=ge=>`${ge.substring(0,12)}...${ge.substring(ge.length-12)}`,E=a?a.split(","):["wss://relay.nostr.band","wss://relay.damus.io","wss://nos.lol"],y=vd(s),N=Ed(y),P="https://pbs.twimg.com/profile_images/1604195803748306944/LxHDoJ7P_400x400.jpg",B=async()=>{const{picture:ge,display_name:be,name:Le}=xd(await N);return`
      <h2>${be||Le}</h2>
        <img
          src="${ge||P}"
          width="80"
          height="80"
          alt="nostr user avatar"
        />
      <p>${p(i||s)}</p>
    `},D=_i(`
      <button class="close-button">X</button>
      <div class="dialog-header-container">
        <h2 class="skeleton-placeholder"></h2>
          <img
            src="${P}"
            width="80"
            height="80"
            alt="placeholder avatar"
          />
        <p class="skeleton-placeholder"></p>
      </div>
      <div class="preset-zap-options-container">
        <button data-value="21">21 ⚡️</button>
        <button data-value="69">69 ⚡️</button>
        <button data-value="420">420 ⚡️</button>
        <button data-value="1337">1337 ⚡️</button>
        <button data-value="5000">5k ⚡️</button>
        <button data-value="10000">10k ⚡️</button>
        <button data-value="21000">21k ⚡️</button>
        <button data-value="1000000">1M ⚡️</button>
      </div>
      <form>
        <input name="amount" type="number" placeholder="amount in sats" required />
        <input name="comment" placeholder="optional comment" />
        <button class="cta-button" 
          ${u?`style="background-color: ${u}; color: ${js(u)}"`:""} 
          type="submit" disabled>Zap</button>
      </form>
    `),b=D.querySelector(".preset-zap-options-container"),x=D.querySelector("form"),O=D.querySelector('input[name="amount"]'),U=D.querySelector('input[name="comment"]'),q=D.querySelector('button[type="submit"]'),J=D.querySelector(".dialog-header-container"),se=ge=>{D.close(),Fs(ge,s).showModal()};B().then(ge=>{J.innerHTML=ge,q.disabled=!1}).catch(se);const ie=()=>{q.disabled=!0,q.innerHTML='<div class="spinner">Loading</div>'},fe=()=>{q.disabled=!1,q.innerHTML="Zap"},he=ge=>{O.value=ge};D.addEventListener("close",function(){fe(),x.reset()}),D.querySelector(".close-button").addEventListener("click",function(){D.close()}),b.addEventListener("click",function(ge){ge.target.matches("button")&&(he(ge.target.getAttribute("data-value")),O.focus())});const ue=N.then($d);return x.addEventListener("submit",async function(ge){ge.preventDefault(),ie();const be=Number(O.value)*1e3,Le=U.value;try{const I=await kd({zapEndpoint:await ue,amount:be,comment:Le,authorId:y,nip19Target:i,normalizedRelays:E,anon:f}),T=async()=>{const _=Nd({dialogHeader:await B(),invoice:I,relays:E,buttonColor:u}),R=_.querySelector(".cta-button");D.close(),_.showModal(),R.focus()};if(window.webln)try{await window.webln.enable(),await window.webln.sendPayment(I),D.close()}catch{T()}else T()}catch(I){se(I)}}),D},Fs=(s,i)=>{const a=_i(`
    <button class="close-button">X</button>
    <p class="error-message">${s}</p>
    <a href="https://nosta.me/${i}" target="_blank">
      <button class="cta-button">View Nostr Profile</button>
    </a>
  `);return a.addEventListener("close",function(){a.remove()}),a.querySelector(".close-button").addEventListener("click",function(){a.close()}),a},qs=async({npub:s,noteId:i,naddr:a,relays:u,cachedAmountDialog:f,buttonColor:p,anon:E})=>{let y=f;try{return y||(y=await Bd({npub:s,nip19Target:a||i,relays:u,buttonColor:p,anon:E})),y.showModal(),window.matchMedia("(max-height: 932px)").matches||y.querySelector('input[name="amount"]').focus(),y}catch(N){y&&y.close(),Fs(N,s).showModal()}},Zs=s=>{let i=null,a=null;s.addEventListener("click",async function(){const u=s.getAttribute("data-npub"),f=s.getAttribute("data-note-id"),p=s.getAttribute("data-naddr"),E=s.getAttribute("data-relays"),y=s.getAttribute("data-button-color"),N=s.getAttribute("data-anon")==="true";a&&(a.npub!==u||a.noteId!==f||a.naddr!==p||a.relays!==E||a.buttonColor!==y||a.anon!==N)&&(i=null),a={npub:u,noteId:f,naddr:p,relays:E,buttonColor:y,anon:N},i=await qs({npub:u,noteId:f,naddr:p,relays:E,cachedAmountDialog:i,buttonColor:y,anon:N})})},Vs=s=>{document.querySelectorAll(s||"[data-npub]").forEach(Zs)};return(()=>{const s=document.createElement("style");s.innerHTML=`
      .nostr-zap-dialog {
        width: 424px;
        min-width: 376px;
        margin: auto;
        box-sizing: content-box;
        border: none;
        border-radius: 10px;
        padding: 36px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        background-color: white;
      }
      .nostr-zap-dialog[open],
      .nostr-zap-dialog form {
        display: block;
        max-width: fit-content;
      }
      .nostr-zap-dialog form {
        padding: 0;
        width: 100%;
      }
      .nostr-zap-dialog img {
        display: inline;
        border-radius: 50%;
      }
      .nostr-zap-dialog h2 {
        font-size: 1.5em;
        font-weight: bold;
        color: black;
      }
      .nostr-zap-dialog p {
        font-size: 1em;
        font-weight: normal;
        color: black;
      }
      .nostr-zap-dialog h2,
      .nostr-zap-dialog p,
      .nostr-zap-dialog .skeleton-placeholder {
        margin: 4px;
        word-wrap: break-word;
      }
      .nostr-zap-dialog button {
        background-color: inherit;
        padding: 12px 0;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        cursor: pointer;
        border: 1px solid rgb(226, 232, 240);
        width: 100px;
        max-width: 100px;
        max-height: 52px;
        white-space: nowrap;
        color: black;
        box-sizing: border-box;
      }
      .nostr-zap-dialog button:hover {
        background-color: #edf2f7;
      }
      .nostr-zap-dialog button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .nostr-zap-dialog .cta-button {
        background-color: #7f00ff;
        color: #fff;
        width: 100%;
        max-width: 100%;
        margin-top: 16px;
      }
      .nostr-zap-dialog .cta-button:hover {
        background-color: indigo;
      }
      .nostr-zap-dialog .close-button {
        background-color: inherit;
        color: black;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 12px;
        border: none;
      }
      .nostr-zap-dialog .preset-zap-options-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 24px 0 8px 0;
        height: 120px;
      }
      .nostr-zap-dialog input {
        padding: 12px;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        width: 100%;
        max-width: 100%;
        background-color: #f7fafc;
        color: #1a202c;
        box-shadow: none;
        box-sizing: border-box;
        margin-bottom: 16px;
        border: 1px solid lightgray;
      }
      .nostr-zap-dialog .spinner {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .nostr-zap-dialog .spinner:after {
        content: " ";
        display: block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 4px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: nostr-zap-dialog-spinner 1.2s linear infinite;
        margin-left: 8px;
      }
      .nostr-zap-dialog .error-message {
        text-align: left;
        color: red;
        margin-top: 8px;
      }
      .nostr-zap-dialog .qrcode {
        position: relative;
        display: inline-block;
        margin-top: 24px;
      }
      .nostr-zap-dialog .qrcode .overlay {
        position: absolute;
        color: white;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(127, 17, 224, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
      }
      .nostr-zap-dialog .qrcode .overlay.show {
        opacity: 1;
      }
      @keyframes nostr-zap-dialog-spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      @keyframes nostr-zap-dialog-skeleton-pulse {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          opacity: 0.6;
        }
      }
      .nostr-zap-dialog .skeleton-placeholder {
        animation-name: nostr-zap-dialog-skeleton-pulse;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        background-color: #e8e8e8;
        border-radius: 4px;
        margin: 4px auto;
      }
      .nostr-zap-dialog p.skeleton-placeholder {
        height: 20px;
        width: 200px;
      }
      .nostr-zap-dialog h2.skeleton-placeholder {
        height: 28px;
        width: 300px;
      }
      .nostr-zap-dialog select[name="lightning-wallet"] {
        appearance: none;
        background-color: white;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%232D3748" width="24" height="24" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>');
        background-repeat: no-repeat;
        background-position: right 0.7rem center;
        background-size: 16px;
        border: 1px solid #CBD5E0;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 0.25rem;
        width: 100%;
        margin-top: 24px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
      .nostr-zap-dialog select[name="lightning-wallet"]:focus {
        outline: none;
        border-color: #4FD1C5;
        box-shadow: 0 0 0 2px #4FD1C5;
      }
      @media only screen and (max-width: 480px) {
        .nostr-zap-dialog {
          padding: 18px;
        }

        .nostr-zap-dialog button {
          width: 92px;
          max-width: 92px;
        }
      }
      @media only screen and (max-width: 413px) {
        .nostr-zap-dialog {
          min-width: 324px;
        }
        .nostr-zap-dialog button {
          width: 78px;
          max-width: 78px;
        }
      }
  `;const i=document.createElement("div");document.body.appendChild(i),Ai=i.attachShadow({mode:"open"}),Ai.appendChild(s)})(),Vs(),window.nostrZap={init:qs,initTarget:Zs,initTargets:Vs},ba}Ng();export{Dg as a,zg as g};
