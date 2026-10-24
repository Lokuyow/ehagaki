var e={203:(e,t)=>{function n(e){if(!Number.isSafeInteger(e))throw Error(`Wrong integer: ${e}`)}function r(...e){let t=(e,t)=>n=>e(t(n));return{encode:Array.from(e).reverse().reduce(((e,n)=>e?t(e,n.encode):n.encode),void 0),decode:e.reduce(((e,n)=>e?t(e,n.decode):n.decode),void 0)}}function i(e){return{encode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`number`)throw Error(`alphabet.encode input should be an array of numbers`);return t.map((t=>{if(n(t),t<0||t>=e.length)throw Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);return e[t]}))},decode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`string`)throw Error(`alphabet.decode input should be array of strings`);return t.map((t=>{if(typeof t!=`string`)throw Error(`alphabet.decode: not string element=${t}`);let n=e.indexOf(t);if(n===-1)throw Error(`Unknown letter: "${t}". Allowed: ${e}`);return n}))}}}function a(e=``){if(typeof e!=`string`)throw Error(`join separator should be string`);return{encode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`string`)throw Error(`join.encode input should be array of strings`);for(let e of t)if(typeof e!=`string`)throw Error(`join.encode: non-string input=${e}`);return t.join(e)},decode:t=>{if(typeof t!=`string`)throw Error(`join.decode input should be string`);return t.split(e)}}}function o(e,t=`=`){if(n(e),typeof t!=`string`)throw Error(`padding chr should be string`);return{encode(n){if(!Array.isArray(n)||n.length&&typeof n[0]!=`string`)throw Error(`padding.encode input should be array of strings`);for(let e of n)if(typeof e!=`string`)throw Error(`padding.encode: non-string input=${e}`);for(;n.length*e%8;)n.push(t);return n},decode(n){if(!Array.isArray(n)||n.length&&typeof n[0]!=`string`)throw Error(`padding.encode input should be array of strings`);for(let e of n)if(typeof e!=`string`)throw Error(`padding.decode: non-string input=${e}`);let r=n.length;if(r*e%8)throw Error(`Invalid padding: string should have whole number of bytes`);for(;r>0&&n[r-1]===t;r--)if(!((r-1)*e%8))throw Error(`Invalid padding: string has too much padding`);return n.slice(0,r)}}}function s(e){if(typeof e!=`function`)throw Error(`normalize fn should be function`);return{encode:e=>e,decode:t=>e(t)}}function c(e,t,r){if(t<2)throw Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);if(r<2)throw Error(`convertRadix: wrong to=${r}, base cannot be less than 2`);if(!Array.isArray(e))throw Error(`convertRadix: data should be array`);if(!e.length)return[];let i=0,a=[],o=Array.from(e);for(o.forEach((e=>{if(n(e),e<0||e>=t)throw Error(`Wrong integer: ${e}`)}));;){let e=0,n=!0;for(let a=i;a<o.length;a++){let s=o[a],c=t*e+s;if(!Number.isSafeInteger(c)||t*e/t!==e||c-s!=t*e||(e=c%r,o[a]=Math.floor(c/r),!Number.isSafeInteger(o[a])||o[a]*r+e!==c))throw Error(`convertRadix: carry overflow`);n&&(o[a]?n=!1:i=a)}if(a.push(e),n)break}for(let t=0;t<e.length-1&&e[t]===0;t++)a.push(0);return a.reverse()}Object.defineProperty(t,"__esModule",{value:!0}),t.bytes=t.stringToBytes=t.str=t.bytesToString=t.hex=t.utf8=t.bech32m=t.bech32=t.base58check=t.base58xmr=t.base58xrp=t.base58flickr=t.base58=t.base64url=t.base64=t.base32crockford=t.base32hex=t.base32=t.base16=t.utils=t.assertNumber=void 0,t.assertNumber=n;let l=(e,t)=>t?l(t,e%t):e,u=(e,t)=>e+(t-l(e,t));function d(e,t,r,i){if(!Array.isArray(e))throw Error(`convertRadix2: data should be array`);if(t<=0||t>32)throw Error(`convertRadix2: wrong from=${t}`);if(r<=0||r>32)throw Error(`convertRadix2: wrong to=${r}`);if(u(t,r)>32)throw Error(`convertRadix2: carry overflow from=${t} to=${r} carryBits=${u(t,r)}`);let a=0,o=0,s=2**r-1,c=[];for(let i of e){if(n(i),i>=2**t)throw Error(`convertRadix2: invalid data word=${i} from=${t}`);if(a=a<<t|i,o+t>32)throw Error(`convertRadix2: carry overflow pos=${o} from=${t}`);for(o+=t;o>=r;o-=r)c.push((a>>o-r&s)>>>0);a&=2**o-1}if(a=a<<r-o&s,!i&&o>=t)throw Error(`Excess padding`);if(!i&&a)throw Error(`Non-zero padding: ${a}`);return i&&o>0&&c.push(a>>>0),c}function f(e){return n(e),{encode:t=>{if(!(t instanceof Uint8Array))throw Error(`radix.encode input should be Uint8Array`);return c(Array.from(t),256,e)},decode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`number`)throw Error(`radix.decode input should be array of strings`);return Uint8Array.from(c(t,e,256))}}}function p(e,t=!1){if(n(e),e<=0||e>32)throw Error(`radix2: bits should be in (0..32]`);if(u(8,e)>32||u(e,8)>32)throw Error(`radix2: carry overflow`);return{encode:n=>{if(!(n instanceof Uint8Array))throw Error(`radix2.encode input should be Uint8Array`);return d(Array.from(n),8,e,!t)},decode:n=>{if(!Array.isArray(n)||n.length&&typeof n[0]!=`number`)throw Error(`radix2.decode input should be array of strings`);return Uint8Array.from(d(n,e,8,t))}}}function m(e){if(typeof e!=`function`)throw Error(`unsafeWrapper fn should be function`);return function(...t){try{return e.apply(null,t)}catch{}}}function h(e,t){if(n(e),typeof t!=`function`)throw Error(`checksum fn should be function`);return{encode(n){if(!(n instanceof Uint8Array))throw Error(`checksum.encode: input should be Uint8Array`);let r=t(n).slice(0,e),i=new Uint8Array(n.length+e);return i.set(n),i.set(r,n.length),i},decode(n){if(!(n instanceof Uint8Array))throw Error(`checksum.decode: input should be Uint8Array`);let r=n.slice(0,-e),i=t(r).slice(0,e),a=n.slice(-e);for(let t=0;t<e;t++)if(i[t]!==a[t])throw Error(`Invalid checksum`);return r}}}t.utils={alphabet:i,chain:r,checksum:h,radix:f,radix2:p,join:a,padding:o},t.base16=r(p(4),i(`0123456789ABCDEF`),a(``)),t.base32=r(p(5),i(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),o(5),a(``)),t.base32hex=r(p(5),i(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),o(5),a(``)),t.base32crockford=r(p(5),i(`0123456789ABCDEFGHJKMNPQRSTVWXYZ`),a(``),s((e=>e.toUpperCase().replace(/O/g,`0`).replace(/[IL]/g,`1`)))),t.base64=r(p(6),i(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),o(6),a(``)),t.base64url=r(p(6),i(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),o(6),a(``));let g=e=>r(f(58),i(e),a(``));t.base58=g(`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`),t.base58flickr=g(`123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ`),t.base58xrp=g(`rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`);let _=[0,2,3,5,6,7,9,10,11];t.base58xmr={encode(e){let n=``;for(let r=0;r<e.length;r+=8){let i=e.subarray(r,r+8);n+=t.base58.encode(i).padStart(_[i.length],`1`)}return n},decode(e){let n=[];for(let r=0;r<e.length;r+=11){let i=e.slice(r,r+11),a=_.indexOf(i.length),o=t.base58.decode(i);for(let e=0;e<o.length-a;e++)if(o[e]!==0)throw Error(`base58xmr: wrong padding`);n=n.concat(Array.from(o.slice(o.length-a)))}return Uint8Array.from(n)}},t.base58check=e=>r(h(4,(t=>e(e(t)))),t.base58);let v=r(i(`qpzry9x8gf2tvdw0s3jn54khce6mua7l`),a(``)),y=[996825010,642813549,513874426,1027748829,705979059];function b(e){let t=e>>25,n=(33554431&e)<<5;for(let e=0;e<y.length;e++)(t>>e&1)==1&&(n^=y[e]);return n}function x(e,t,n=1){let r=e.length,i=1;for(let t=0;t<r;t++){let n=e.charCodeAt(t);if(n<33||n>126)throw Error(`Invalid prefix (${e})`);i=b(i)^n>>5}i=b(i);for(let t=0;t<r;t++)i=b(i)^31&e.charCodeAt(t);for(let e of t)i=b(i)^e;for(let e=0;e<6;e++)i=b(i);return i^=n,v.encode(d([i%2**30],30,5,!1))}function S(e){let t=e===`bech32`?1:734539939,n=p(5),r=n.decode,i=n.encode,a=m(r);function o(e,n=90){if(typeof e!=`string`)throw Error(`bech32.decode input should be string, not `+typeof e);if(e.length<8||!1!==n&&e.length>n)throw TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${n})`);let r=e.toLowerCase();if(e!==r&&e!==e.toUpperCase())throw Error(`String must be lowercase or uppercase`);let i=(e=r).lastIndexOf(`1`);if(i===0||i===-1)throw Error(`Letter "1" must be present between prefix and data only`);let a=e.slice(0,i),o=e.slice(i+1);if(o.length<6)throw Error(`Data must be at least 6 characters long`);let s=v.decode(o).slice(0,-6),c=x(a,s,t);if(!o.endsWith(c))throw Error(`Invalid checksum in ${e}: expected "${c}"`);return{prefix:a,words:s}}return{encode:function(e,n,r=90){if(typeof e!=`string`)throw Error(`bech32.encode prefix should be string, not `+typeof e);if(!Array.isArray(n)||n.length&&typeof n[0]!=`number`)throw Error(`bech32.encode words should be array of numbers, not `+typeof n);let i=e.length+7+n.length;if(!1!==r&&i>r)throw TypeError(`Length ${i} exceeds limit ${r}`);return`${e=e.toLowerCase()}1${v.encode(n)}${x(e,n,t)}`},decode:o,decodeToBytes:function(e){let{prefix:t,words:n}=o(e,!1);return{prefix:t,words:n,bytes:r(n)}},decodeUnsafe:m(o),fromWords:r,fromWordsUnsafe:a,toWords:i}}t.bech32=S(`bech32`),t.bech32m=S(`bech32m`),t.utf8={encode:e=>new TextDecoder().decode(e),decode:e=>new TextEncoder().encode(e)},t.hex=r(p(4),i(`0123456789abcdef`),a(``),s((e=>{if(typeof e!=`string`||e.length%2)throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);return e.toLowerCase()})));let C={utf8:t.utf8,hex:t.hex,base16:t.base16,base32:t.base32,base64:t.base64,base64url:t.base64url,base58:t.base58,base58xmr:t.base58xmr},w=`Invalid encoding type. Available types: ${Object.keys(C).join(`, `)}`;t.bytesToString=(e,t)=>{if(typeof e!=`string`||!C.hasOwnProperty(e))throw TypeError(w);if(!(t instanceof Uint8Array))throw TypeError(`bytesToString() expects Uint8Array`);return C[e].encode(t)},t.str=t.bytesToString,t.stringToBytes=(e,t)=>{if(!C.hasOwnProperty(e))throw TypeError(w);if(typeof t!=`string`)throw TypeError(`stringToBytes() expects string`);return C[e].decode(t)},t.bytes=t.stringToBytes},806:(e,t,n)=>{n.d(t,{A:()=>s});var r=n(601),i=n.n(r),a=n(314),o=n.n(a)()(i());o.push([e.id,`.zap-sender.with-comment {
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
}`,``]);let s=o},540:(e,t,n)=>{n.r(t),n.d(t,{default:()=>l});var r=n(601),i=n.n(r),a=n(314),o=n.n(a),s=n(806),c=o()(i());c.i(s.A),c.push([e.id,`/* styles.css */

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
}`,``]);let l=c},314:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=``,r=t[5]!==void 0;return t[4]&&(n+=`@supports (${t[4]}) {`),t[2]&&(n+=`@media ${t[2]} {`),r&&(n+=`@layer${t[5].length>0?` ${t[5]}`:``} {`),n+=e(t),r&&(n+=`}`),t[2]&&(n+=`}`),t[4]&&(n+=`}`),n})).join(``)},t.i=function(e,n,r,i,a){typeof e==`string`&&(e=[[null,e,void 0]]);var o={};if(r)for(var s=0;s<this.length;s++){var c=this[s][0];c!=null&&(o[c]=!0)}for(var l=0;l<e.length;l++){var u=[].concat(e[l]);r&&o[u[0]]||(a!==void 0&&(u[5]===void 0||(u[1]=`@layer${u[5].length>0?` ${u[5]}`:``} {${u[1]}}`),u[5]=a),n&&(u[2]&&(u[1]=`@media ${u[2]} {${u[1]}}`),u[2]=n),i&&(u[4]?(u[1]=`@supports (${u[4]}) {${u[1]}}`,u[4]=i):u[4]=`${i}`),t.push(u))}},t}},601:e=>{e.exports=function(e){return e[1]}},705:(e,t,n)=>{let{bech32:r,hex:i,utf8:a}=n(203),o={bech32:`bc`,pubKeyHash:0,scriptHash:5,validWitnessVersions:[0]},s={bech32:`tb`,pubKeyHash:111,scriptHash:196,validWitnessVersions:[0]},c={bech32:`tbs`,pubKeyHash:111,scriptHash:196,validWitnessVersions:[0]},l={bech32:`bcrt`,pubKeyHash:111,scriptHash:196,validWitnessVersions:[0]},u={bech32:`sb`,pubKeyHash:63,scriptHash:123,validWitnessVersions:[0]},d=[`option_data_loss_protect`,`initial_routing_sync`,`option_upfront_shutdown_script`,`gossip_queries`,`var_onion_optin`,`gossip_queries_ex`,`option_static_remotekey`,`payment_secret`,`basic_mpp`,`option_support_large_channel`],f={m:BigInt(1e3),u:BigInt(1e6),n:BigInt(1e9),p:BigInt(0xe8d4a51000)},p=BigInt(`2100000000000000000`),m=BigInt(1e11),h={payment_hash:1,payment_secret:16,description:13,payee:19,description_hash:23,expiry:6,min_final_cltv_expiry:24,fallback_address:9,route_hint:3,feature_bits:5,metadata:27},g={};for(let e=0,t=Object.keys(h);e<t.length;e++){let n=t[e],r=h[t[e]].toString();g[r]=n}let _={1:e=>i.encode(r.fromWordsUnsafe(e)),16:e=>i.encode(r.fromWordsUnsafe(e)),13:e=>a.encode(r.fromWordsUnsafe(e)),19:e=>i.encode(r.fromWordsUnsafe(e)),23:e=>i.encode(r.fromWordsUnsafe(e)),27:e=>i.encode(r.fromWordsUnsafe(e)),6:y,24:y,3:function(e){let t=[],n,a,o,s,c,l=r.fromWordsUnsafe(e);for(;l.length>0;)n=i.encode(l.slice(0,33)),a=i.encode(l.slice(33,41)),o=parseInt(i.encode(l.slice(41,45)),16),s=parseInt(i.encode(l.slice(45,49)),16),c=parseInt(i.encode(l.slice(49,51)),16),l=l.slice(51),t.push({pubkey:n,short_channel_id:a,fee_base_msat:o,fee_proportional_millionths:s,cltv_expiry_delta:c});return t},5:function(e){let t=e.slice().reverse().map((e=>[!!(1&e),!!(2&e),!!(4&e),!!(8&e),!!(16&e)])).reduce(((e,t)=>e.concat(t)),[]);for(;t.length<2*d.length;)t.push(!1);let n={};d.forEach(((e,r)=>{let i;i=t[2*r]?`required`:t[2*r+1]?`supported`:`unsupported`,n[e]=i}));let r=t.slice(2*d.length);return n.extra_bits={start_bit:2*d.length,bits:r,has_required:r.reduce(((e,t,n)=>n%2==0?e||t:e||!1),!1)},n}};function v(e){return t=>({tagCode:parseInt(e),words:r.encode(`unknown`,t,2**53-1)})}function y(e){return e.reverse().reduce(((e,t,n)=>e+t*32**n),0)}function b(e,t){let n,r;if(e.slice(-1).match(/^[munp]$/))n=e.slice(-1),r=e.slice(0,-1);else{if(e.slice(-1).match(/^[^munp0-9]$/))throw Error(`Not a valid multiplier for the amount`);r=e}if(!r.match(/^\d+$/))throw Error(`Not a valid human readable amount`);let i=BigInt(r),a=n?i*m/f[n]:i*m;if(n===`p`&&i%BigInt(10)!==BigInt(0)||a>p)throw Error(`Amount is outside of valid range`);return t?a.toString():a}e.exports={decode:function(e,t){if(typeof e!=`string`)throw Error(`Lightning Payment Request must be string`);if(e.slice(0,2).toLowerCase()!==`ln`)throw Error(`Not a proper lightning payment request`);let n=[],a=r.decode(e,2**53-1);e=e.toLowerCase();let d=a.prefix,f=a.words,p=e.slice(d.length+1),m=f.slice(-104);f=f.slice(0,-104);let x=d.match(/^ln(\S+?)(\d*)([a-zA-Z]?)$/);if(x&&!x[2]&&(x=d.match(/^ln(\S+)$/)),!x)throw Error(`Not a proper lightning payment request`);n.push({name:`lightning_network`,letters:`ln`});let S=x[1],C;if(t){if(t.bech32===void 0||t.pubKeyHash===void 0||t.scriptHash===void 0||!Array.isArray(t.validWitnessVersions))throw Error(`Invalid network`);C=t}else switch(S){case o.bech32:C=o;break;case s.bech32:C=s;break;case c.bech32:C=c;break;case l.bech32:C=l;break;case u.bech32:C=u}if(!C||C.bech32!==S)throw Error(`Unknown coin bech32 prefix`);n.push({name:`coin_network`,letters:S,value:C});let w=x[2],T;w?(T=b(w+x[3],!0),n.push({name:`amount`,letters:x[2]+x[3],value:T})):T=null,n.push({name:`separator`,letters:`1`});let E=y(f.slice(0,7)),D,O,k,A;for(f=f.slice(7),n.push({name:`timestamp`,letters:p.slice(0,7),value:E}),p=p.slice(7);f.length>0;){let e=f[0].toString();D=g[e]||`unknown_tag`,O=_[e]||v(e),f=f.slice(1),k=y(f.slice(0,2)),f=f.slice(2),A=f.slice(0,k),f=f.slice(k),n.push({name:D,tag:p[0],letters:p.slice(0,3+k),value:O(A)}),p=p.slice(3+k)}n.push({name:`signature`,letters:p.slice(0,104),value:i.encode(r.fromWordsUnsafe(m))}),p=p.slice(104),n.push({name:`checksum`,letters:p});let j={paymentRequest:e,sections:n,get expiry(){let e=n.find((e=>e.name===`expiry`));if(e)return M(`timestamp`)+e.value},get route_hints(){return n.filter((e=>e.name===`route_hint`)).map((e=>e.value))}};for(let e in h)e!==`route_hint`&&Object.defineProperty(j,e,{get:()=>M(e)});return j;function M(e){let t=n.find((t=>t.name===e));return t?t.value:void 0}},hrpToMillisat:b}},0:(e,t,n)=>{var r=n(540);r&&r.__esModule&&(r=r.default),e.exports=typeof r==`string`?r:r.toString()}},t={};function n(r){var i=t[r];if(i!==void 0)return i.exports;var a=t[r]={id:r,exports:{}};return e[r](a,a.exports,n),a.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{typeof Symbol<`u`&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:`Module`}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};n.d(r,{vQ:()=>U,ZM:()=>Is,yk:()=>W,h0:()=>Rc,n_:()=>Kc,Xz:()=>qc,Uv:()=>Ac,fU:()=>Lc,Dw:()=>Bc});var i={};n.r(i),n.d(i,{OG:()=>te,My:()=>j,Ph:()=>P,lX:()=>F,Id:()=>ee,fg:()=>ie,qj:()=>R,aT:()=>N,lq:()=>I,z:()=>L,Q5:()=>oe});var a={};n.r(a),n.d(a,{Relay:()=>Ea,SimplePool:()=>Oa,finalizeEvent:()=>kr,fj:()=>da,generateSecretKey:()=>Dr,getEventHash:()=>Tr,getFilterLimit:()=>ua,getPublicKey:()=>Or,kinds:()=>jr,matchFilter:()=>sa,matchFilters:()=>ca,mergeFilters:()=>la,nip04:()=>Ka,nip05:()=>Xa,nip10:()=>io,nip11:()=>oo,nip13:()=>lo,nip18:()=>mo,nip19:()=>ka,nip21:()=>vo,nip25:()=>So,nip27:()=>To,nip28:()=>ko,nip30:()=>Fo,nip39:()=>Vo,nip42:()=>va,nip44:()=>Wo,nip47:()=>ts,nip57:()=>as,nip59:()=>ds,nip98:()=>ws,parseReferences:()=>Ga,serializeEvent:()=>wr,sortEvents:()=>mr,utils:()=>hr,validateEvent:()=>pr,verifiedSymbol:()=>dr,verifyEvent:()=>Ar});var o=n(705);function s(e){if(!Number.isSafeInteger(e)||e<0)throw Error(`Wrong positive integer: ${e}`)}function c(e,...t){if(!(e instanceof Uint8Array))throw Error(`Expected Uint8Array`);if(t.length>0&&!t.includes(e.length))throw Error(`Expected Uint8Array of length ${t}, not of length=${e.length}`)}function l(e){if(typeof e!=`function`||typeof e.create!=`function`)throw Error(`Hash should be wrapped by utils.wrapConstructor`);s(e.outputLen),s(e.blockLen)}function u(e,t=!0){if(e.destroyed)throw Error(`Hash instance has been destroyed`);if(t&&e.finished)throw Error(`Hash#digest() has already been called`)}function d(e,t){c(e);let n=t.outputLen;if(e.length<n)throw Error(`digestInto() expects output buffer of length at least ${n}`)}var f=typeof globalThis==`object`&&`crypto`in globalThis?globalThis.crypto:void 0,p=e=>e instanceof Uint8Array,m=e=>new DataView(e.buffer,e.byteOffset,e.byteLength),h=(e,t)=>e<<32-t|e>>>t;if(new Uint8Array(new Uint32Array([287454020]).buffer)[0]!==68)throw Error(`Non little-endian hardware is not supported`);function g(e){if(typeof e==`string`&&(e=function(e){if(typeof e!=`string`)throw Error(`utf8ToBytes expected string, got `+typeof e);return new Uint8Array(new TextEncoder().encode(e))}(e)),!p(e))throw Error(`expected Uint8Array, got `+typeof e);return e}var _=class{clone(){return this._cloneInto()}};function v(e){let t=t=>e().update(g(t)).digest(),n=e();return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=()=>e(),t}function y(e=32){if(f&&typeof f.getRandomValues==`function`)return f.getRandomValues(new Uint8Array(e));throw Error(`crypto.getRandomValues must be defined`)}var b=class extends _{constructor(e,t,n,r){super(),this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=r,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(e),this.view=m(this.buffer)}update(e){u(this);let{view:t,buffer:n,blockLen:r}=this,i=(e=g(e)).length;for(let a=0;a<i;){let o=Math.min(r-this.pos,i-a);if(o!==r)n.set(e.subarray(a,a+o),this.pos),this.pos+=o,a+=o,this.pos===r&&(this.process(t,0),this.pos=0);else{let t=m(e);for(;r<=i-a;a+=r)this.process(t,a)}}return this.length+=e.length,this.roundClean(),this}digestInto(e){u(this),d(e,this),this.finished=!0;let{buffer:t,view:n,blockLen:r,isLE:i}=this,{pos:a}=this;t[a++]=128,this.buffer.subarray(a).fill(0),this.padOffset>r-a&&(this.process(n,0),a=0);for(let e=a;e<r;e++)t[e]=0;(function(e,t,n,r){if(typeof e.setBigUint64==`function`)return e.setBigUint64(t,n,r);let i=BigInt(32),a=BigInt(4294967295),o=Number(n>>i&a),s=Number(n&a),c=r?4:0,l=r?0:4;e.setUint32(t+c,o,r),e.setUint32(t+l,s,r)})(n,r-8,BigInt(8*this.length),i),this.process(n,0);let o=m(e),s=this.outputLen;if(s%4)throw Error(`_sha2: outputLen should be aligned to 32bit`);let c=s/4,l=this.get();if(c>l.length)throw Error(`_sha2: outputLen bigger than state`);for(let e=0;e<c;e++)o.setUint32(4*e,l[e],i)}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}_cloneInto(e){e||=new this.constructor,e.set(...this.get());let{blockLen:t,buffer:n,length:r,finished:i,destroyed:a,pos:o}=this;return e.length=r,e.pos=o,e.finished=i,e.destroyed=a,r%t&&e.buffer.set(n),e}},x=(e,t,n)=>e&t^e&n^t&n,S=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),C=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),w=new Uint32Array(64),T=class extends b{constructor(){super(64,32,8,!1),this.A=0|C[0],this.B=0|C[1],this.C=0|C[2],this.D=0|C[3],this.E=0|C[4],this.F=0|C[5],this.G=0|C[6],this.H=0|C[7]}get(){let{A:e,B:t,C:n,D:r,E:i,F:a,G:o,H:s}=this;return[e,t,n,r,i,a,o,s]}set(e,t,n,r,i,a,o,s){this.A=0|e,this.B=0|t,this.C=0|n,this.D=0|r,this.E=0|i,this.F=0|a,this.G=0|o,this.H=0|s}process(e,t){for(let n=0;n<16;n++,t+=4)w[n]=e.getUint32(t,!1);for(let e=16;e<64;e++){let t=w[e-15],n=w[e-2],r=h(t,7)^h(t,18)^t>>>3,i=h(n,17)^h(n,19)^n>>>10;w[e]=i+w[e-7]+r+w[e-16]|0}let{A:n,B:r,C:i,D:a,E:o,F:s,G:c,H:l}=this;for(let e=0;e<64;e++){let t=l+(h(o,6)^h(o,11)^h(o,25))+((u=o)&s^~u&c)+S[e]+w[e]|0,d=(h(n,2)^h(n,13)^h(n,22))+x(n,r,i)|0;l=c,c=s,s=o,o=a+t|0,a=i,i=r,r=n,n=t+d|0}var u;n=n+this.A|0,r=r+this.B|0,i=i+this.C|0,a=a+this.D|0,o=o+this.E|0,s=s+this.F|0,c=c+this.G|0,l=l+this.H|0,this.set(n,r,i,a,o,s,c,l)}roundClean(){w.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}},E=v((()=>new T)),D=BigInt(1),O=BigInt(2),k=e=>e instanceof Uint8Array,A=Array.from({length:256},((e,t)=>t.toString(16).padStart(2,`0`)));function j(e){if(!k(e))throw Error(`Uint8Array expected`);let t=``;for(let n=0;n<e.length;n++)t+=A[e[n]];return t}function M(e){if(typeof e!=`string`)throw Error(`hex string expected, got `+typeof e);return BigInt(e===``?`0`:`0x${e}`)}function N(e){if(typeof e!=`string`)throw Error(`hex string expected, got `+typeof e);let t=e.length;if(t%2)throw Error(`padded hex string expected, got unpadded hex of length `+t);let n=new Uint8Array(t/2);for(let t=0;t<n.length;t++){let r=2*t,i=e.slice(r,r+2),a=Number.parseInt(i,16);if(Number.isNaN(a)||a<0)throw Error(`Invalid byte sequence`);n[t]=a}return n}function P(e){return M(j(e))}function F(e){if(!k(e))throw Error(`Uint8Array expected`);return M(j(Uint8Array.from(e).reverse()))}function I(e,t){return N(e.toString(16).padStart(2*t,`0`))}function L(e,t){return I(e,t).reverse()}function R(e,t,n){let r;if(typeof t==`string`)try{r=N(t)}catch(n){throw Error(`${e} must be valid hex string, got "${t}". Cause: ${n}`)}else{if(!k(t))throw Error(`${e} must be hex string or Uint8Array`);r=Uint8Array.from(t)}let i=r.length;if(typeof n==`number`&&i!==n)throw Error(`${e} expected ${n} bytes, got ${i}`);return r}function ee(...e){let t=new Uint8Array(e.reduce(((e,t)=>e+t.length),0)),n=0;return e.forEach((e=>{if(!k(e))throw Error(`Uint8Array expected`);t.set(e,n),n+=e.length})),t}var te=e=>(O<<BigInt(e-1))-D,ne=e=>new Uint8Array(e),re=e=>Uint8Array.from(e);function ie(e,t,n){if(typeof e!=`number`||e<2)throw Error(`hashLen must be a number`);if(typeof t!=`number`||t<2)throw Error(`qByteLen must be a number`);if(typeof n!=`function`)throw Error(`hmacFn must be a function`);let r=ne(e),i=ne(e),a=0,o=()=>{r.fill(1),i.fill(0),a=0},s=(...e)=>n(i,r,...e),c=(e=ne())=>{i=s(re([0]),e),r=s(),e.length!==0&&(i=s(re([1]),e),r=s())},l=()=>{if(a++>=1e3)throw Error(`drbg: tried 1000 values`);let e=0,n=[];for(;e<t;){r=s();let t=r.slice();n.push(t),e+=r.length}return ee(...n)};return(e,t)=>{let n;for(o(),c(e);!(n=t(l()));)c();return o(),n}}var ae={bigint:e=>typeof e==`bigint`,function:e=>typeof e==`function`,boolean:e=>typeof e==`boolean`,string:e=>typeof e==`string`,stringOrUint8Array:e=>typeof e==`string`||e instanceof Uint8Array,isSafeInteger:e=>Number.isSafeInteger(e),array:e=>Array.isArray(e),field:(e,t)=>t.Fp.isValid(e),hash:e=>typeof e==`function`&&Number.isSafeInteger(e.outputLen)};function oe(e,t,n={}){let r=(t,n,r)=>{let i=ae[n];if(typeof i!=`function`)throw Error(`Invalid validator "${n}", expected function`);let a=e[t];if(!(r&&a===void 0||i(a,e)))throw Error(`Invalid param ${String(t)}=${a} (${typeof a}), expected ${n}`)};for(let[e,n]of Object.entries(t))r(e,n,!1);for(let[e,t]of Object.entries(n))r(e,t,!0);return e}var se=BigInt(0),z=BigInt(1),ce=BigInt(2),le=BigInt(3),ue=BigInt(4),de=BigInt(5),fe=BigInt(8);function pe(e,t){let n=e%t;return n>=se?n:t+n}function me(e,t,n){if(n<=se||t<se)throw Error(`Expected power/modulo > 0`);if(n===z)return se;let r=z;for(;t>se;)t&z&&(r=r*e%n),e=e*e%n,t>>=z;return r}function he(e,t,n){let r=e;for(;t-->se;)r*=r,r%=n;return r}function ge(e,t){if(e===se||t<=se)throw Error(`invert: expected positive integers, got n=${e} mod=${t}`);let n=pe(e,t),r=t,i=se,a=z,o=z,s=se;for(;n!==se;){let e=r/n,t=r%n,c=i-o*e,l=a-s*e;r=n,n=t,i=o,a=s,o=c,s=l}if(r!==z)throw Error(`invert: does not exist`);return pe(i,t)}function _e(e){if(e%ue===le){let t=(e+z)/ue;return function(e,n){let r=e.pow(n,t);if(!e.eql(e.sqr(r),n))throw Error(`Cannot find square root`);return r}}if(e%fe===de){let t=(e-de)/fe;return function(e,n){let r=e.mul(n,ce),i=e.pow(r,t),a=e.mul(n,i),o=e.mul(e.mul(a,ce),i),s=e.mul(a,e.sub(o,e.ONE));if(!e.eql(e.sqr(s),n))throw Error(`Cannot find square root`);return s}}return function(e){let t=(e-z)/ce,n,r,i;for(n=e-z,r=0;n%ce===se;n/=ce,r++);for(i=ce;i<e&&me(i,t,e)!==e-z;i++);if(r===1){let t=(e+z)/ue;return function(e,n){let r=e.pow(n,t);if(!e.eql(e.sqr(r),n))throw Error(`Cannot find square root`);return r}}let a=(n+z)/ce;return function(e,o){if(e.pow(o,t)===e.neg(e.ONE))throw Error(`Cannot find square root`);let s=r,c=e.pow(e.mul(e.ONE,i),n),l=e.pow(o,a),u=e.pow(o,n);for(;!e.eql(u,e.ONE);){if(e.eql(u,e.ZERO))return e.ZERO;let t=1;for(let n=e.sqr(u);t<s&&!e.eql(n,e.ONE);t++)n=e.sqr(n);let n=e.pow(c,z<<BigInt(s-t-1));c=e.sqr(n),l=e.mul(l,n),u=e.mul(u,c),s=t}return l}}(e)}var ve=[`create`,`isValid`,`is0`,`neg`,`inv`,`sqrt`,`sqr`,`eql`,`add`,`sub`,`mul`,`pow`,`div`,`addN`,`subN`,`mulN`,`sqrN`];function ye(e,t){let n=t===void 0?e.toString(2).length:t;return{nBitLength:n,nByteLength:Math.ceil(n/8)}}function be(e){if(typeof e!=`bigint`)throw Error(`field order must be bigint`);let t=e.toString(2).length;return Math.ceil(t/8)}function xe(e){let t=be(e);return t+Math.ceil(t/2)}var Se=class extends _{constructor(e,t){super(),this.finished=!1,this.destroyed=!1,l(e);let n=g(t);if(this.iHash=e.create(),typeof this.iHash.update!=`function`)throw Error(`Expected instance of class which extends utils.Hash`);this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let r=this.blockLen,i=new Uint8Array(r);i.set(n.length>r?e.create().update(n).digest():n);for(let e=0;e<i.length;e++)i[e]^=54;this.iHash.update(i),this.oHash=e.create();for(let e=0;e<i.length;e++)i[e]^=106;this.oHash.update(i),i.fill(0)}update(e){return u(this),this.iHash.update(e),this}digestInto(e){u(this),c(e,this.outputLen),this.finished=!0,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy()}digest(){let e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});let{oHash:t,iHash:n,finished:r,destroyed:i,blockLen:a,outputLen:o}=this;return e.finished=r,e.destroyed=i,e.blockLen=a,e.outputLen=o,e.oHash=t._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}},Ce=(e,t,n)=>new Se(e,t).update(n).digest();Ce.create=(e,t)=>new Se(e,t);var we=BigInt(0),Te=BigInt(1);function Ee(e){return oe(e.Fp,ve.reduce(((e,t)=>(e[t]=`function`,e)),{ORDER:`bigint`,MASK:`bigint`,BYTES:`isSafeInteger`,BITS:`isSafeInteger`})),oe(e,{n:`bigint`,h:`bigint`,Gx:`field`,Gy:`field`},{nBitLength:`isSafeInteger`,nByteLength:`isSafeInteger`}),Object.freeze({...ye(e.n,e.nBitLength),...e,p:e.Fp.ORDER})}var{Ph:De,aT:Oe}=i,ke={Err:class extends Error{constructor(e=``){super(e)}},_parseInt(e){let{Err:t}=ke;if(e.length<2||e[0]!==2)throw new t(`Invalid signature integer tag`);let n=e[1],r=e.subarray(2,n+2);if(!n||r.length!==n)throw new t(`Invalid signature integer: wrong length`);if(128&r[0])throw new t(`Invalid signature integer: negative`);if(r[0]===0&&!(128&r[1]))throw new t(`Invalid signature integer: unnecessary leading zero`);return{d:De(r),l:e.subarray(n+2)}},toSig(e){let{Err:t}=ke,n=typeof e==`string`?Oe(e):e;if(!(n instanceof Uint8Array))throw Error(`ui8a expected`);let r=n.length;if(r<2||n[0]!=48)throw new t(`Invalid signature tag`);if(n[1]!==r-2)throw new t(`Invalid signature: incorrect length`);let{d:i,l:a}=ke._parseInt(n.subarray(2)),{d:o,l:s}=ke._parseInt(a);if(s.length)throw new t(`Invalid signature: left bytes after parsing`);return{r:i,s:o}},hexFromSig(e){let t=e=>8&Number.parseInt(e[0],16)?`00`+e:e,n=e=>{let t=e.toString(16);return 1&t.length?`0${t}`:t},r=t(n(e.s)),i=t(n(e.r)),a=r.length/2,o=i.length/2,s=n(a),c=n(o);return`30${n(o+a+4)}02${c}${i}02${s}${r}`}},Ae=BigInt(0),je=BigInt(1),Me=BigInt(3);function Ne(e){let t=function(e){let t=Ee(e);oe(t,{a:`field`,b:`field`},{allowedPrivateKeyLengths:`array`,wrapPrivateKey:`boolean`,isTorsionFree:`function`,clearCofactor:`function`,allowInfinityPoint:`boolean`,fromBytes:`function`,toBytes:`function`});let{endo:n,Fp:r,a:i}=t;if(n){if(!r.eql(i,r.ZERO))throw Error(`Endomorphism can only be defined for Koblitz curves that have a=0`);if(typeof n!=`object`||typeof n.beta!=`bigint`||typeof n.splitScalar!=`function`)throw Error(`Expected endomorphism with beta: bigint and splitScalar: function`)}return Object.freeze({...t})}(e),{Fp:n}=t,r=t.toBytes||((e,t,r)=>{let i=t.toAffine();return ee(Uint8Array.from([4]),n.toBytes(i.x),n.toBytes(i.y))}),i=t.fromBytes||(e=>{let t=e.subarray(1);return{x:n.fromBytes(t.subarray(0,n.BYTES)),y:n.fromBytes(t.subarray(n.BYTES,2*n.BYTES))}});function a(e){let{a:r,b:i}=t,a=n.sqr(e),o=n.mul(a,e);return n.add(n.add(o,n.mul(e,r)),i)}if(!n.eql(n.sqr(t.Gy),a(t.Gx)))throw Error(`bad generator point: equation left != right`);function o(e){return typeof e==`bigint`&&Ae<e&&e<t.n}function s(e){if(!o(e))throw Error(`Expected valid bigint: 0 < bigint < curve.n`)}function c(e){let{allowedPrivateKeyLengths:n,nByteLength:r,wrapPrivateKey:i,n:a}=t;if(n&&typeof e!=`bigint`){if(e instanceof Uint8Array&&(e=j(e)),typeof e!=`string`||!n.includes(e.length))throw Error(`Invalid key`);e=e.padStart(2*r,`0`)}let o;try{o=typeof e==`bigint`?e:P(R(`private key`,e,r))}catch{throw Error(`private key must be ${r} bytes, hex or bigint, not ${typeof e}`)}return i&&(o=pe(o,a)),s(o),o}let l=new Map;function u(e){if(!(e instanceof d))throw Error(`ProjectivePoint expected`)}class d{constructor(e,t,r){if(this.px=e,this.py=t,this.pz=r,e==null||!n.isValid(e))throw Error(`x required`);if(t==null||!n.isValid(t))throw Error(`y required`);if(r==null||!n.isValid(r))throw Error(`z required`)}static fromAffine(e){let{x:t,y:r}=e||{};if(!e||!n.isValid(t)||!n.isValid(r))throw Error(`invalid affine point`);if(e instanceof d)throw Error(`projective point not allowed`);let i=e=>n.eql(e,n.ZERO);return i(t)&&i(r)?d.ZERO:new d(t,r,n.ONE)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}static normalizeZ(e){let t=n.invertBatch(e.map((e=>e.pz)));return e.map(((e,n)=>e.toAffine(t[n]))).map(d.fromAffine)}static fromHex(e){let t=d.fromAffine(i(R(`pointHex`,e)));return t.assertValidity(),t}static fromPrivateKey(e){return d.BASE.multiply(c(e))}_setWindowSize(e){this._WINDOW_SIZE=e,l.delete(this)}assertValidity(){if(this.is0()){if(t.allowInfinityPoint&&!n.is0(this.py))return;throw Error(`bad point: ZERO`)}let{x:e,y:r}=this.toAffine();if(!n.isValid(e)||!n.isValid(r))throw Error(`bad point: x or y not FE`);let i=n.sqr(r),o=a(e);if(!n.eql(i,o))throw Error(`bad point: equation left != right`);if(!this.isTorsionFree())throw Error(`bad point: not in prime-order subgroup`)}hasEvenY(){let{y:e}=this.toAffine();if(n.isOdd)return!n.isOdd(e);throw Error(`Field doesn't support isOdd`)}equals(e){u(e);let{px:t,py:r,pz:i}=this,{px:a,py:o,pz:s}=e,c=n.eql(n.mul(t,s),n.mul(a,i)),l=n.eql(n.mul(r,s),n.mul(o,i));return c&&l}negate(){return new d(this.px,n.neg(this.py),this.pz)}double(){let{a:e,b:r}=t,i=n.mul(r,Me),{px:a,py:o,pz:s}=this,c=n.ZERO,l=n.ZERO,u=n.ZERO,f=n.mul(a,a),p=n.mul(o,o),m=n.mul(s,s),h=n.mul(a,o);return h=n.add(h,h),u=n.mul(a,s),u=n.add(u,u),c=n.mul(e,u),l=n.mul(i,m),l=n.add(c,l),c=n.sub(p,l),l=n.add(p,l),l=n.mul(c,l),c=n.mul(h,c),u=n.mul(i,u),m=n.mul(e,m),h=n.sub(f,m),h=n.mul(e,h),h=n.add(h,u),u=n.add(f,f),f=n.add(u,f),f=n.add(f,m),f=n.mul(f,h),l=n.add(l,f),m=n.mul(o,s),m=n.add(m,m),f=n.mul(m,h),c=n.sub(c,f),u=n.mul(m,p),u=n.add(u,u),u=n.add(u,u),new d(c,l,u)}add(e){u(e);let{px:r,py:i,pz:a}=this,{px:o,py:s,pz:c}=e,l=n.ZERO,f=n.ZERO,p=n.ZERO,m=t.a,h=n.mul(t.b,Me),g=n.mul(r,o),_=n.mul(i,s),v=n.mul(a,c),y=n.add(r,i),b=n.add(o,s);y=n.mul(y,b),b=n.add(g,_),y=n.sub(y,b),b=n.add(r,a);let x=n.add(o,c);return b=n.mul(b,x),x=n.add(g,v),b=n.sub(b,x),x=n.add(i,a),l=n.add(s,c),x=n.mul(x,l),l=n.add(_,v),x=n.sub(x,l),p=n.mul(m,b),l=n.mul(h,v),p=n.add(l,p),l=n.sub(_,p),p=n.add(_,p),f=n.mul(l,p),_=n.add(g,g),_=n.add(_,g),v=n.mul(m,v),b=n.mul(h,b),_=n.add(_,v),v=n.sub(g,v),v=n.mul(m,v),b=n.add(b,v),g=n.mul(_,b),f=n.add(f,g),g=n.mul(x,b),l=n.mul(y,l),l=n.sub(l,g),g=n.mul(y,_),p=n.mul(x,p),p=n.add(p,g),new d(l,f,p)}subtract(e){return this.add(e.negate())}is0(){return this.equals(d.ZERO)}wNAF(e){return p.wNAFCached(this,l,e,(e=>{let t=n.invertBatch(e.map((e=>e.pz)));return e.map(((e,n)=>e.toAffine(t[n]))).map(d.fromAffine)}))}multiplyUnsafe(e){let r=d.ZERO;if(e===Ae)return r;if(s(e),e===je)return this;let{endo:i}=t;if(!i)return p.unsafeLadder(this,e);let{k1neg:a,k1:o,k2neg:c,k2:l}=i.splitScalar(e),u=r,f=r,m=this;for(;o>Ae||l>Ae;)o&je&&(u=u.add(m)),l&je&&(f=f.add(m)),m=m.double(),o>>=je,l>>=je;return a&&(u=u.negate()),c&&(f=f.negate()),f=new d(n.mul(f.px,i.beta),f.py,f.pz),u.add(f)}multiply(e){s(e);let r,i,a=e,{endo:o}=t;if(o){let{k1neg:e,k1:t,k2neg:s,k2:c}=o.splitScalar(a),{p:l,f:u}=this.wNAF(t),{p:f,f:m}=this.wNAF(c);l=p.constTimeNegate(e,l),f=p.constTimeNegate(s,f),f=new d(n.mul(f.px,o.beta),f.py,f.pz),r=l.add(f),i=u.add(m)}else{let{p:e,f:t}=this.wNAF(a);r=e,i=t}return d.normalizeZ([r,i])[0]}multiplyAndAddUnsafe(e,t,n){let r=d.BASE,i=(e,t)=>t!==Ae&&t!==je&&e.equals(r)?e.multiply(t):e.multiplyUnsafe(t),a=i(this,t).add(i(e,n));return a.is0()?void 0:a}toAffine(e){let{px:t,py:r,pz:i}=this,a=this.is0();e??=a?n.ONE:n.inv(i);let o=n.mul(t,e),s=n.mul(r,e),c=n.mul(i,e);if(a)return{x:n.ZERO,y:n.ZERO};if(!n.eql(c,n.ONE))throw Error(`invZ was invalid`);return{x:o,y:s}}isTorsionFree(){let{h:e,isTorsionFree:n}=t;if(e===je)return!0;if(n)return n(d,this);throw Error(`isTorsionFree() has not been declared for the elliptic curve`)}clearCofactor(){let{h:e,clearCofactor:n}=t;return e===je?this:n?n(d,this):this.multiplyUnsafe(t.h)}toRawBytes(e=!0){return this.assertValidity(),r(d,this,e)}toHex(e=!0){return j(this.toRawBytes(e))}}d.BASE=new d(t.Gx,t.Gy,n.ONE),d.ZERO=new d(n.ZERO,n.ONE,n.ZERO);let f=t.nBitLength,p=function(e,t){let n=(e,t)=>{let n=t.negate();return e?n:t},r=e=>({windows:Math.ceil(t/e)+1,windowSize:2**(e-1)});return{constTimeNegate:n,unsafeLadder(t,n){let r=e.ZERO,i=t;for(;n>we;)n&Te&&(r=r.add(i)),i=i.double(),n>>=Te;return r},precomputeWindow(e,t){let{windows:n,windowSize:i}=r(t),a=[],o=e,s=o;for(let e=0;e<n;e++){s=o,a.push(s);for(let e=1;e<i;e++)s=s.add(o),a.push(s);o=s.double()}return a},wNAF(t,i,a){let{windows:o,windowSize:s}=r(t),c=e.ZERO,l=e.BASE,u=BigInt(2**t-1),d=2**t,f=BigInt(t);for(let e=0;e<o;e++){let t=e*s,r=Number(a&u);a>>=f,r>s&&(r-=d,a+=Te);let o=t,p=t+Math.abs(r)-1,m=e%2!=0,h=r<0;r===0?l=l.add(n(m,i[o])):c=c.add(n(h,i[p]))}return{p:c,f:l}},wNAFCached(e,t,n,r){let i=e._WINDOW_SIZE||1,a=t.get(e);return a||(a=this.precomputeWindow(e,i),i!==1&&t.set(e,r(a))),this.wNAF(i,a,n)}}}(d,t.endo?Math.ceil(f/2):f);return{CURVE:t,ProjectivePoint:d,normPrivateKeyToScalar:c,weierstrassEquation:a,isWithinCurveOrder:o}}function Pe(e){let t=function(e){let t=Ee(e);return oe(t,{hash:`hash`,hmac:`function`,randomBytes:`function`},{bits2int:`function`,bits2int_modN:`function`,lowS:`boolean`}),Object.freeze({lowS:!0,...t})}(e),{Fp:n,n:r}=t,i=n.BYTES+1,a=2*n.BYTES+1;function o(e){return pe(e,r)}function s(e){return ge(e,r)}let{ProjectivePoint:c,normPrivateKeyToScalar:l,weierstrassEquation:u,isWithinCurveOrder:d}=Ne({...t,toBytes(e,t,r){let i=t.toAffine(),a=n.toBytes(i.x),o=ee;return r?o(Uint8Array.from([t.hasEvenY()?2:3]),a):o(Uint8Array.from([4]),a,n.toBytes(i.y))},fromBytes(e){let t=e.length,r=e[0],o=e.subarray(1);if(t!==i||r!==2&&r!==3){if(t===a&&r===4)return{x:n.fromBytes(o.subarray(0,n.BYTES)),y:n.fromBytes(o.subarray(n.BYTES,2*n.BYTES))};throw Error(`Point of length ${t} was invalid. Expected ${i} compressed bytes or ${a} uncompressed bytes`)}{let e=P(o);if(!(Ae<(s=e)&&s<n.ORDER))throw Error(`Point is not on curve`);let t=u(e),i=n.sqrt(t);return!(1&~r)!=((i&je)===je)&&(i=n.neg(i)),{x:e,y:i}}var s}}),f=e=>j(I(e,t.nByteLength));function p(e){return e>r>>je}let m=(e,t,n)=>P(e.slice(t,n));class h{constructor(e,t,n){this.r=e,this.s=t,this.recovery=n,this.assertValidity()}static fromCompact(e){let n=t.nByteLength;return e=R(`compactSignature`,e,2*n),new h(m(e,0,n),m(e,n,2*n))}static fromDER(e){let{r:t,s:n}=ke.toSig(R(`DER`,e));return new h(t,n)}assertValidity(){if(!d(this.r))throw Error(`r must be 0 < r < CURVE.n`);if(!d(this.s))throw Error(`s must be 0 < s < CURVE.n`)}addRecoveryBit(e){return new h(this.r,this.s,e)}recoverPublicKey(e){let{r,s:i,recovery:a}=this,l=y(R(`msgHash`,e));if(a==null||![0,1,2,3].includes(a))throw Error(`recovery id invalid`);let u=a===2||a===3?r+t.n:r;if(u>=n.ORDER)throw Error(`recovery id 2 or 3 invalid`);let d=1&a?`03`:`02`,p=c.fromHex(d+f(u)),m=s(u),h=o(-l*m),g=o(i*m),_=c.BASE.multiplyAndAddUnsafe(p,h,g);if(!_)throw Error(`point at infinify`);return _.assertValidity(),_}hasHighS(){return p(this.s)}normalizeS(){return this.hasHighS()?new h(this.r,o(-this.s),this.recovery):this}toDERRawBytes(){return N(this.toDERHex())}toDERHex(){return ke.hexFromSig({r:this.r,s:this.s})}toCompactRawBytes(){return N(this.toCompactHex())}toCompactHex(){return f(this.r)+f(this.s)}}let g={isValidPrivateKey(e){try{return l(e),!0}catch{return!1}},normPrivateKeyToScalar:l,randomPrivateKey:()=>{let e=xe(t.n);return function(e,t,n=!1){let r=e.length,i=be(t),a=xe(t);if(r<16||r<a||r>1024)throw Error(`expected ${a}-1024 bytes of input, got ${r}`);let o=pe(n?P(e):F(e),t-z)+z;return n?L(o,i):I(o,i)}(t.randomBytes(e),t.n)},precompute:(e=8,t=c.BASE)=>(t._setWindowSize(e),t.multiply(BigInt(3)),t)};function _(e){let t=e instanceof Uint8Array,n=typeof e==`string`,r=(t||n)&&e.length;return t?r===i||r===a:n?r===2*i||r===2*a:e instanceof c}let v=t.bits2int||function(e){let n=P(e),r=8*e.length-t.nBitLength;return r>0?n>>BigInt(r):n},y=t.bits2int_modN||function(e){return o(v(e))},b=te(t.nBitLength);function x(e){if(typeof e!=`bigint`)throw Error(`bigint expected`);if(!(Ae<=e&&e<b))throw Error(`bigint expected < 2^${t.nBitLength}`);return I(e,t.nByteLength)}function S(e,r,i=C){if([`recovered`,`canonical`].some((e=>e in i)))throw Error(`sign() legacy options not supported`);let{hash:a,randomBytes:u}=t,{lowS:f,prehash:m,extraEntropy:g}=i;f??=!0,e=R(`msgHash`,e),m&&(e=R(`prehashed msgHash`,a(e)));let _=y(e),b=l(r),S=[x(b),x(_)];if(g!=null){let e=!0===g?u(n.BYTES):g;S.push(R(`extraEntropy`,e))}let w=ee(...S),T=_;return{seed:w,k2sig:function(e){let t=v(e);if(!d(t))return;let n=s(t),r=c.BASE.multiply(t).toAffine(),i=o(r.x);if(i===Ae)return;let a=o(n*o(T+i*b));if(a===Ae)return;let l=(r.x===i?0:2)|Number(r.y&je),u=a;return f&&p(a)&&(u=function(e){return p(e)?o(-e):e}(a),l^=1),new h(i,u,l)}}}let C={lowS:t.lowS,prehash:!1},w={lowS:t.lowS,prehash:!1};return c.BASE._setWindowSize(8),{CURVE:t,getPublicKey:function(e,t=!0){return c.fromPrivateKey(e).toRawBytes(t)},getSharedSecret:function(e,t,n=!0){if(_(e))throw Error(`first arg must be private key`);if(!_(t))throw Error(`second arg must be public key`);return c.fromHex(t).multiply(l(e)).toRawBytes(n)},sign:function(e,n,r=C){let{seed:i,k2sig:a}=S(e,n,r),o=t;return ie(o.hash.outputLen,o.nByteLength,o.hmac)(i,a)},verify:function(e,n,r,i=w){let a=e;if(n=R(`msgHash`,n),r=R(`publicKey`,r),`strict`in i)throw Error(`options.strict was renamed to lowS`);let{lowS:l,prehash:u}=i,d,f;try{if(typeof a==`string`||a instanceof Uint8Array)try{d=h.fromDER(a)}catch(e){if(!(e instanceof ke.Err))throw e;d=h.fromCompact(a)}else{if(typeof a!=`object`||typeof a.r!=`bigint`||typeof a.s!=`bigint`)throw Error(`PARSE`);{let{r:e,s:t}=a;d=new h(e,t)}}f=c.fromHex(r)}catch(e){if(e.message===`PARSE`)throw Error(`signature must be Signature instance, Uint8Array or hex string`);return!1}if(l&&d.hasHighS())return!1;u&&(n=t.hash(n));let{r:p,s:m}=d,g=y(n),_=s(m),v=o(g*_),b=o(p*_),x=c.BASE.multiplyAndAddUnsafe(f,v,b)?.toAffine();return!!x&&o(x.x)===p},ProjectivePoint:c,Signature:h,utils:g}}function Fe(e){return{hash:e,hmac:(t,...n)=>Ce(e,t,function(...e){let t=new Uint8Array(e.reduce(((e,t)=>e+t.length),0)),n=0;return e.forEach((e=>{if(!p(e))throw Error(`Uint8Array expected`);t.set(e,n),n+=e.length})),t}(...n)),randomBytes:y}}var Ie=BigInt(`0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f`),Le=BigInt(`0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141`),Re=BigInt(1),ze=BigInt(2),Be=(e,t)=>(e+t/ze)/t;function Ve(e){let t=Ie,n=BigInt(3),r=BigInt(6),i=BigInt(11),a=BigInt(22),o=BigInt(23),s=BigInt(44),c=BigInt(88),l=e*e*e%t,u=l*l*e%t,d=he(he(he(u,n,t)*u%t,n,t)*u%t,ze,t)*l%t,f=he(d,i,t)*d%t,p=he(f,a,t)*f%t,m=he(p,s,t)*p%t,h=he(he(he(he(he(he(m,c,t)*m%t,s,t)*p%t,n,t)*u%t,o,t)*f%t,r,t)*l%t,ze,t);if(!He.eql(He.sqr(h),e))throw Error(`Cannot find square root`);return h}var He=function(e,t,n=!1,r={}){if(e<=se)throw Error(`Expected Field ORDER > 0, got ${e}`);let{nBitLength:i,nByteLength:a}=ye(e,t);if(a>2048)throw Error(`Field lengths over 2048 bytes are not supported`);let o=_e(e),s=Object.freeze({ORDER:e,BITS:i,BYTES:a,MASK:te(i),ZERO:se,ONE:z,create:t=>pe(t,e),isValid:t=>{if(typeof t!=`bigint`)throw Error(`Invalid field element: expected bigint, got `+typeof t);return se<=t&&t<e},is0:e=>e===se,isOdd:e=>(e&z)===z,neg:t=>pe(-t,e),eql:(e,t)=>e===t,sqr:t=>pe(t*t,e),add:(t,n)=>pe(t+n,e),sub:(t,n)=>pe(t-n,e),mul:(t,n)=>pe(t*n,e),pow:(e,t)=>function(e,t,n){if(n<se)throw Error(`Expected power > 0`);if(n===se)return e.ONE;if(n===z)return t;let r=e.ONE,i=t;for(;n>se;)n&z&&(r=e.mul(r,i)),i=e.sqr(i),n>>=z;return r}(s,e,t),div:(t,n)=>pe(t*ge(n,e),e),sqrN:e=>e*e,addN:(e,t)=>e+t,subN:(e,t)=>e-t,mulN:(e,t)=>e*t,inv:t=>ge(t,e),sqrt:r.sqrt||(e=>o(s,e)),invertBatch:e=>function(e,t){let n=Array(t.length),r=t.reduce(((t,r,i)=>e.is0(r)?t:(n[i]=t,e.mul(t,r))),e.ONE),i=e.inv(r);return t.reduceRight(((t,r,i)=>e.is0(r)?t:(n[i]=e.mul(t,n[i]),e.mul(t,r))),i),n}(s,e),cmov:(e,t,n)=>n?t:e,toBytes:e=>n?L(e,a):I(e,a),fromBytes:e=>{if(e.length!==a)throw Error(`Fp.fromBytes: expected ${a}, got ${e.length}`);return n?F(e):P(e)}});return Object.freeze(s)}(Ie,void 0,void 0,{sqrt:Ve}),Ue=function(e,t){let n=t=>Pe({...e,...Fe(t)});return Object.freeze({...n(t),create:n})}({a:BigInt(0),b:BigInt(7),Fp:He,n:Le,Gx:BigInt(`55066263022277343669578718895168534326250603453777594175500187360389116729240`),Gy:BigInt(`32670510020758816978083085130507043184471273380659243275938904335757337482424`),h:BigInt(1),lowS:!0,endo:{beta:BigInt(`0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee`),splitScalar:e=>{let t=Le,n=BigInt(`0x3086d221a7d46bcde86c90e49284eb15`),r=-Re*BigInt(`0xe4437ed6010e88286f547fa90abfe4c3`),i=BigInt(`0x114ca50f7a8e2f3f657c1108d9d44cfd8`),a=n,o=BigInt(`0x100000000000000000000000000000000`),s=Be(a*e,t),c=Be(-r*e,t),l=pe(e-s*n-c*i,t),u=pe(-s*r-c*a,t),d=l>o,f=u>o;if(d&&(l=t-l),f&&(u=t-u),l>o||u>o)throw Error(`splitScalar: Endomorphism failed, k=`+e);return{k1neg:d,k1:l,k2neg:f,k2:u}}}},E),We=BigInt(0),Ge=e=>typeof e==`bigint`&&We<e&&e<Ie,Ke={};function qe(e,...t){let n=Ke[e];if(n===void 0){let t=E(Uint8Array.from(e,(e=>e.charCodeAt(0))));n=ee(t,t),Ke[e]=n}return E(ee(n,...t))}var Je=e=>e.toRawBytes(!0).slice(1),Ye=e=>I(e,32),Xe=e=>pe(e,Ie),Ze=e=>pe(e,Le),Qe=Ue.ProjectivePoint;function $e(e){let t=Ue.utils.normPrivateKeyToScalar(e),n=Qe.fromPrivateKey(t);return{scalar:n.hasEvenY()?t:Ze(-t),bytes:Je(n)}}function et(e){if(!Ge(e))throw Error(`bad x: need 0 < x < p`);let t=Ve(Xe(Xe(e*e)*e+BigInt(7)));t%ze!==We&&(t=Xe(-t));let n=new Qe(e,t,Re);return n.assertValidity(),n}function tt(...e){return Ze(P(qe(`BIP0340/challenge`,...e)))}function nt(e){return $e(e).bytes}function rt(e,t,n=y(32)){let r=R(`message`,e),{bytes:i,scalar:a}=$e(t),o=Ze(P(qe(`BIP0340/nonce`,Ye(a^P(qe(`BIP0340/aux`,R(`auxRand`,n,32)))),i,r)));if(o===We)throw Error(`sign failed: k is zero`);let{bytes:s,scalar:c}=$e(o),l=tt(s,i,r),u=new Uint8Array(64);if(u.set(s,0),u.set(Ye(Ze(c+l*a)),32),!it(u,r,i))throw Error(`sign: Invalid signature produced`);return u}function it(e,t,n){let r=R(`signature`,e,64),i=R(`message`,t),a=R(`publicKey`,n,32);try{let e=et(P(a)),t=P(r.subarray(0,32));if(!Ge(t))return!1;let n=P(r.subarray(32,64));if(!(typeof(l=n)==`bigint`&&We<l&&l<Le))return!1;let u=tt(Ye(t),Je(e),i),d=(o=e,s=n,c=Ze(-u),Qe.BASE.multiplyAndAddUnsafe(o,s,c));return!(!d||!d.hasEvenY()||d.toAffine().x!==t)}catch{return!1}var o,s,c,l}var at={getPublicKey:nt,sign:rt,verify:it,utils:{randomPrivateKey:Ue.utils.randomPrivateKey,lift_x:et,pointToBytes:Je,numberToBytesBE:I,bytesToNumberBE:P,taggedHash:qe,mod:pe}},ot=typeof globalThis==`object`&&`crypto`in globalThis?globalThis.crypto:void 0,st=e=>e instanceof Uint8Array,ct=e=>new DataView(e.buffer,e.byteOffset,e.byteLength),lt=(e,t)=>e<<32-t|e>>>t;if(new Uint8Array(new Uint32Array([287454020]).buffer)[0]!==68)throw Error(`Non little-endian hardware is not supported`);var ut=Array.from({length:256},((e,t)=>t.toString(16).padStart(2,`0`)));function dt(e){if(!st(e))throw Error(`Uint8Array expected`);let t=``;for(let n=0;n<e.length;n++)t+=ut[e[n]];return t}function ft(e){if(typeof e!=`string`)throw Error(`hex string expected, got `+typeof e);let t=e.length;if(t%2)throw Error(`padded hex string expected, got unpadded hex of length `+t);let n=new Uint8Array(t/2);for(let t=0;t<n.length;t++){let r=2*t,i=e.slice(r,r+2),a=Number.parseInt(i,16);if(Number.isNaN(a)||a<0)throw Error(`Invalid byte sequence`);n[t]=a}return n}function pt(e){if(typeof e==`string`&&(e=function(e){if(typeof e!=`string`)throw Error(`utf8ToBytes expected string, got `+typeof e);return new Uint8Array(new TextEncoder().encode(e))}(e)),!st(e))throw Error(`expected Uint8Array, got `+typeof e);return e}function mt(...e){let t=new Uint8Array(e.reduce(((e,t)=>e+t.length),0)),n=0;return e.forEach((e=>{if(!st(e))throw Error(`Uint8Array expected`);t.set(e,n),n+=e.length})),t}var ht=class{clone(){return this._cloneInto()}};function gt(e){let t=t=>e().update(pt(t)).digest(),n=e();return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=()=>e(),t}function _t(e=32){if(ot&&typeof ot.getRandomValues==`function`)return ot.getRandomValues(new Uint8Array(e));throw Error(`crypto.getRandomValues must be defined`)}function vt(e){if(!Number.isSafeInteger(e)||e<0)throw Error(`Wrong positive integer: ${e}`)}function yt(e,...t){if(!(e instanceof Uint8Array))throw Error(`Expected Uint8Array`);if(t.length>0&&!t.includes(e.length))throw Error(`Expected Uint8Array of length ${t}, not of length=${e.length}`)}var bt={number:vt,bool:function(e){if(typeof e!=`boolean`)throw Error(`Expected boolean, not ${e}`)},bytes:yt,hash:function(e){if(typeof e!=`function`||typeof e.create!=`function`)throw Error(`Hash should be wrapped by utils.wrapConstructor`);vt(e.outputLen),vt(e.blockLen)},exists:function(e,t=!0){if(e.destroyed)throw Error(`Hash instance has been destroyed`);if(t&&e.finished)throw Error(`Hash#digest() has already been called`)},output:function(e,t){yt(e);let n=t.outputLen;if(e.length<n)throw Error(`digestInto() expects output buffer of length at least ${n}`)}},xt=class extends ht{constructor(e,t,n,r){super(),this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=r,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(e),this.view=ct(this.buffer)}update(e){bt.exists(this);let{view:t,buffer:n,blockLen:r}=this,i=(e=pt(e)).length;for(let a=0;a<i;){let o=Math.min(r-this.pos,i-a);if(o!==r)n.set(e.subarray(a,a+o),this.pos),this.pos+=o,a+=o,this.pos===r&&(this.process(t,0),this.pos=0);else{let t=ct(e);for(;r<=i-a;a+=r)this.process(t,a)}}return this.length+=e.length,this.roundClean(),this}digestInto(e){bt.exists(this),bt.output(e,this),this.finished=!0;let{buffer:t,view:n,blockLen:r,isLE:i}=this,{pos:a}=this;t[a++]=128,this.buffer.subarray(a).fill(0),this.padOffset>r-a&&(this.process(n,0),a=0);for(let e=a;e<r;e++)t[e]=0;(function(e,t,n,r){if(typeof e.setBigUint64==`function`)return e.setBigUint64(t,n,r);let i=BigInt(32),a=BigInt(4294967295),o=Number(n>>i&a),s=Number(n&a),c=r?4:0,l=r?0:4;e.setUint32(t+c,o,r),e.setUint32(t+l,s,r)})(n,r-8,BigInt(8*this.length),i),this.process(n,0);let o=ct(e),s=this.outputLen;if(s%4)throw Error(`_sha2: outputLen should be aligned to 32bit`);let c=s/4,l=this.get();if(c>l.length)throw Error(`_sha2: outputLen bigger than state`);for(let e=0;e<c;e++)o.setUint32(4*e,l[e],i)}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}_cloneInto(e){e||=new this.constructor,e.set(...this.get());let{blockLen:t,buffer:n,length:r,finished:i,destroyed:a,pos:o}=this;return e.length=r,e.pos=o,e.finished=i,e.destroyed=a,r%t&&e.buffer.set(n),e}},St=(e,t,n)=>e&t^e&n^t&n,Ct=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),wt=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),Tt=new Uint32Array(64),Et=class extends xt{constructor(){super(64,32,8,!1),this.A=0|wt[0],this.B=0|wt[1],this.C=0|wt[2],this.D=0|wt[3],this.E=0|wt[4],this.F=0|wt[5],this.G=0|wt[6],this.H=0|wt[7]}get(){let{A:e,B:t,C:n,D:r,E:i,F:a,G:o,H:s}=this;return[e,t,n,r,i,a,o,s]}set(e,t,n,r,i,a,o,s){this.A=0|e,this.B=0|t,this.C=0|n,this.D=0|r,this.E=0|i,this.F=0|a,this.G=0|o,this.H=0|s}process(e,t){for(let n=0;n<16;n++,t+=4)Tt[n]=e.getUint32(t,!1);for(let e=16;e<64;e++){let t=Tt[e-15],n=Tt[e-2],r=lt(t,7)^lt(t,18)^t>>>3,i=lt(n,17)^lt(n,19)^n>>>10;Tt[e]=i+Tt[e-7]+r+Tt[e-16]|0}let{A:n,B:r,C:i,D:a,E:o,F:s,G:c,H:l}=this;for(let e=0;e<64;e++){let t=l+(lt(o,6)^lt(o,11)^lt(o,25))+((u=o)&s^~u&c)+Ct[e]+Tt[e]|0,d=(lt(n,2)^lt(n,13)^lt(n,22))+St(n,r,i)|0;l=c,c=s,s=o,o=a+t|0,a=i,i=r,r=n,n=t+d|0}var u;n=n+this.A|0,r=r+this.B|0,i=i+this.C|0,a=a+this.D|0,o=o+this.E|0,s=s+this.F|0,c=c+this.G|0,l=l+this.H|0,this.set(n,r,i,a,o,s,c,l)}roundClean(){Tt.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}},Dt=class extends Et{constructor(){super(),this.A=-1056596264,this.B=914150663,this.C=812702999,this.D=-150054599,this.E=-4191439,this.F=1750603025,this.G=1694076839,this.H=-1090891868,this.outputLen=28}},Ot=gt((()=>new Et));gt((()=>new Dt));function kt(e){if(!Number.isSafeInteger(e))throw Error(`Wrong integer: ${e}`)}function At(...e){let t=(e,t)=>n=>e(t(n));return{encode:Array.from(e).reverse().reduce(((e,n)=>e?t(e,n.encode):n.encode),void 0),decode:e.reduce(((e,n)=>e?t(e,n.decode):n.decode),void 0)}}function jt(e){return{encode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`number`)throw Error(`alphabet.encode input should be an array of numbers`);return t.map((t=>{if(kt(t),t<0||t>=e.length)throw Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);return e[t]}))},decode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`string`)throw Error(`alphabet.decode input should be array of strings`);return t.map((t=>{if(typeof t!=`string`)throw Error(`alphabet.decode: not string element=${t}`);let n=e.indexOf(t);if(n===-1)throw Error(`Unknown letter: "${t}". Allowed: ${e}`);return n}))}}}function Mt(e=``){if(typeof e!=`string`)throw Error(`join separator should be string`);return{encode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`string`)throw Error(`join.encode input should be array of strings`);for(let e of t)if(typeof e!=`string`)throw Error(`join.encode: non-string input=${e}`);return t.join(e)},decode:t=>{if(typeof t!=`string`)throw Error(`join.decode input should be string`);return t.split(e)}}}function Nt(e,t=`=`){if(kt(e),typeof t!=`string`)throw Error(`padding chr should be string`);return{encode(n){if(!Array.isArray(n)||n.length&&typeof n[0]!=`string`)throw Error(`padding.encode input should be array of strings`);for(let e of n)if(typeof e!=`string`)throw Error(`padding.encode: non-string input=${e}`);for(;n.length*e%8;)n.push(t);return n},decode(n){if(!Array.isArray(n)||n.length&&typeof n[0]!=`string`)throw Error(`padding.encode input should be array of strings`);for(let e of n)if(typeof e!=`string`)throw Error(`padding.decode: non-string input=${e}`);let r=n.length;if(r*e%8)throw Error(`Invalid padding: string should have whole number of bytes`);for(;r>0&&n[r-1]===t;r--)if(!((r-1)*e%8))throw Error(`Invalid padding: string has too much padding`);return n.slice(0,r)}}}function Pt(e){if(typeof e!=`function`)throw Error(`normalize fn should be function`);return{encode:e=>e,decode:t=>e(t)}}function Ft(e,t,n){if(t<2)throw Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);if(n<2)throw Error(`convertRadix: wrong to=${n}, base cannot be less than 2`);if(!Array.isArray(e))throw Error(`convertRadix: data should be array`);if(!e.length)return[];let r=0,i=[],a=Array.from(e);for(a.forEach((e=>{if(kt(e),e<0||e>=t)throw Error(`Wrong integer: ${e}`)}));;){let e=0,o=!0;for(let i=r;i<a.length;i++){let s=a[i],c=t*e+s;if(!Number.isSafeInteger(c)||t*e/t!==e||c-s!=t*e||(e=c%n,a[i]=Math.floor(c/n),!Number.isSafeInteger(a[i])||a[i]*n+e!==c))throw Error(`convertRadix: carry overflow`);o&&(a[i]?o=!1:r=i)}if(i.push(e),o)break}for(let t=0;t<e.length-1&&e[t]===0;t++)i.push(0);return i.reverse()}var It=(e,t)=>t?It(t,e%t):e,Lt=(e,t)=>e+(t-It(e,t));function Rt(e,t,n,r){if(!Array.isArray(e))throw Error(`convertRadix2: data should be array`);if(t<=0||t>32)throw Error(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw Error(`convertRadix2: wrong to=${n}`);if(Lt(t,n)>32)throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${Lt(t,n)}`);let i=0,a=0,o=2**n-1,s=[];for(let r of e){if(kt(r),r>=2**t)throw Error(`convertRadix2: invalid data word=${r} from=${t}`);if(i=i<<t|r,a+t>32)throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);for(a+=t;a>=n;a-=n)s.push((i>>a-n&o)>>>0);i&=2**a-1}if(i=i<<n-a&o,!r&&a>=t)throw Error(`Excess padding`);if(!r&&i)throw Error(`Non-zero padding: ${i}`);return r&&a>0&&s.push(i>>>0),s}function zt(e){return kt(e),{encode:t=>{if(!(t instanceof Uint8Array))throw Error(`radix.encode input should be Uint8Array`);return Ft(Array.from(t),256,e)},decode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`number`)throw Error(`radix.decode input should be array of strings`);return Uint8Array.from(Ft(t,e,256))}}}function Bt(e,t=!1){if(kt(e),e<=0||e>32)throw Error(`radix2: bits should be in (0..32]`);if(Lt(8,e)>32||Lt(e,8)>32)throw Error(`radix2: carry overflow`);return{encode:n=>{if(!(n instanceof Uint8Array))throw Error(`radix2.encode input should be Uint8Array`);return Rt(Array.from(n),8,e,!t)},decode:n=>{if(!Array.isArray(n)||n.length&&typeof n[0]!=`number`)throw Error(`radix2.decode input should be array of strings`);return Uint8Array.from(Rt(n,e,8,t))}}}function Vt(e){if(typeof e!=`function`)throw Error(`unsafeWrapper fn should be function`);return function(...t){try{return e.apply(null,t)}catch{}}}At(Bt(4),jt(`0123456789ABCDEF`),Mt(``)),At(Bt(5),jt(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),Nt(5),Mt(``));var Ht=(At(Bt(5),jt(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),Nt(5),Mt(``)),At(Bt(5),jt(`0123456789ABCDEFGHJKMNPQRSTVWXYZ`),Mt(``),Pt((e=>e.toUpperCase().replace(/O/g,`0`).replace(/[IL]/g,`1`)))),At(Bt(6),jt(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),Nt(6),Mt(``)));At(Bt(6),jt(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),Nt(6),Mt(``));var Ut=e=>At(zt(58),jt(e),Mt(``));Ut(`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`),Ut(`123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ`),Ut(`rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`);var Wt=At(jt(`qpzry9x8gf2tvdw0s3jn54khce6mua7l`),Mt(``)),Gt=[996825010,642813549,513874426,1027748829,705979059];function Kt(e){let t=e>>25,n=(33554431&e)<<5;for(let e=0;e<Gt.length;e++)(t>>e&1)==1&&(n^=Gt[e]);return n}function qt(e,t,n=1){let r=e.length,i=1;for(let t=0;t<r;t++){let n=e.charCodeAt(t);if(n<33||n>126)throw Error(`Invalid prefix (${e})`);i=Kt(i)^n>>5}i=Kt(i);for(let t=0;t<r;t++)i=Kt(i)^31&e.charCodeAt(t);for(let e of t)i=Kt(i)^e;for(let e=0;e<6;e++)i=Kt(i);return i^=n,Wt.encode(Rt([i%2**30],30,5,!1))}function Jt(e){let t=e===`bech32`?1:734539939,n=Bt(5),r=n.decode,i=n.encode,a=Vt(r);function o(e,n=90){if(typeof e!=`string`)throw Error(`bech32.decode input should be string, not `+typeof e);if(e.length<8||!1!==n&&e.length>n)throw TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${n})`);let r=e.toLowerCase();if(e!==r&&e!==e.toUpperCase())throw Error(`String must be lowercase or uppercase`);let i=(e=r).lastIndexOf(`1`);if(i===0||i===-1)throw Error(`Letter "1" must be present between prefix and data only`);let a=e.slice(0,i),o=e.slice(i+1);if(o.length<6)throw Error(`Data must be at least 6 characters long`);let s=Wt.decode(o).slice(0,-6),c=qt(a,s,t);if(!o.endsWith(c))throw Error(`Invalid checksum in ${e}: expected "${c}"`);return{prefix:a,words:s}}return{encode:function(e,n,r=90){if(typeof e!=`string`)throw Error(`bech32.encode prefix should be string, not `+typeof e);if(!Array.isArray(n)||n.length&&typeof n[0]!=`number`)throw Error(`bech32.encode words should be array of numbers, not `+typeof n);let i=e.length+7+n.length;if(!1!==r&&i>r)throw TypeError(`Length ${i} exceeds limit ${r}`);return`${e=e.toLowerCase()}1${Wt.encode(n)}${qt(e,n,t)}`},decode:o,decodeToBytes:function(e){let{prefix:t,words:n}=o(e,!1);return{prefix:t,words:n,bytes:r(n)}},decodeUnsafe:Vt(o),fromWords:r,fromWordsUnsafe:a,toWords:i}}var Yt=Jt(`bech32`);Jt(`bech32m`),At(Bt(4),jt(`0123456789abcdef`),Mt(``),Pt((e=>{if(typeof e!=`string`||e.length%2)throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);return e.toLowerCase()})));function Xt(e){if(!Number.isSafeInteger(e)||e<0)throw Error(`positive integer expected, not ${e}`)}function Zt(e){if(typeof e!=`boolean`)throw Error(`boolean expected, not ${e}`)}function Qt(e){return e instanceof Uint8Array||typeof e==`object`&&!!e&&e.constructor.name===`Uint8Array`}function B(e,...t){if(!Qt(e))throw Error(`Uint8Array expected`);if(t.length>0&&!t.includes(e.length))throw Error(`Uint8Array expected of length ${t}, not of length=${e.length}`)}function $t(e,t=!0){if(e.destroyed)throw Error(`Hash instance has been destroyed`);if(t&&e.finished)throw Error(`Hash#digest() has already been called`)}function en(e,t){B(e);let n=t.outputLen;if(e.length<n)throw Error(`digestInto() expects output buffer of length at least ${n}`)}var tn=e=>new Uint8Array(e.buffer,e.byteOffset,e.byteLength),V=e=>new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4)),nn=e=>new DataView(e.buffer,e.byteOffset,e.byteLength);if(new Uint8Array(new Uint32Array([287454020]).buffer)[0]!==68)throw Error(`Non little-endian hardware is not supported`);function rn(e){if(typeof e==`string`)e=function(e){if(typeof e!=`string`)throw Error(`string expected, got `+typeof e);return new Uint8Array(new TextEncoder().encode(e))}(e);else{if(!Qt(e))throw Error(`Uint8Array expected, got `+typeof e);e=e.slice()}return e}function an(e,t){if(e.length!==t.length)return!1;let n=0;for(let r=0;r<e.length;r++)n|=e[r]^t[r];return n===0}var on=(e,t)=>(Object.assign(t,e),t);function sn(e,t,n,r){if(typeof e.setBigUint64==`function`)return e.setBigUint64(t,n,r);let i=BigInt(32),a=BigInt(4294967295),o=Number(n>>i&a),s=Number(n&a),c=r?4:0,l=r?0:4;e.setUint32(t+c,o,r),e.setUint32(t+l,s,r)}var cn=16,ln=new Uint8Array(16),un=V(ln),dn=e=>(e>>>0&255)<<24|(e>>>8&255)<<16|(e>>>16&255)<<8|e>>>24&255,fn=class{constructor(e,t){this.blockLen=cn,this.outputLen=cn,this.s0=0,this.s1=0,this.s2=0,this.s3=0,this.finished=!1,B(e=rn(e),16);let n=nn(e),r=n.getUint32(0,!1),i=n.getUint32(4,!1),a=n.getUint32(8,!1),o=n.getUint32(12,!1),s=[];for(let e=0;e<128;e++)s.push({s0:dn(r),s1:dn(i),s2:dn(a),s3:dn(o)}),{s0:r,s1:i,s2:a,s3:o}={s3:(u=a)<<31|(d=o)>>>1,s2:(l=i)<<31|u>>>1,s1:(c=r)<<31|l>>>1,s0:c>>>1^225<<24&-(1&d)};var c,l,u,d;let f=(e=>e>65536?8:e>1024?4:2)(t||1024);if(![1,2,4,8].includes(f))throw Error(`ghash: wrong window size=${f}, should be 2, 4 or 8`);this.W=f;let p=128/f,m=this.windowSize=2**f,h=[];for(let e=0;e<p;e++)for(let t=0;t<m;t++){let n=0,r=0,i=0,a=0;for(let o=0;o<f;o++){if(!(t>>>f-o-1&1))continue;let{s0:c,s1:l,s2:u,s3:d}=s[f*e+o];n^=c,r^=l,i^=u,a^=d}h.push({s0:n,s1:r,s2:i,s3:a})}this.t=h}_updateBlock(e,t,n,r){e^=this.s0,t^=this.s1,n^=this.s2,r^=this.s3;let{W:i,t:a,windowSize:o}=this,s=0,c=0,l=0,u=0,d=(1<<i)-1,f=0;for(let p of[e,t,n,r])for(let e=0;e<4;e++){let t=p>>>8*e&255;for(let e=8/i-1;e>=0;e--){let n=t>>>i*e&d,{s0:r,s1:p,s2:m,s3:h}=a[f*o+n];s^=r,c^=p,l^=m,u^=h,f+=1}}this.s0=s,this.s1=c,this.s2=l,this.s3=u}update(e){e=rn(e),$t(this);let t=V(e),n=Math.floor(e.length/cn),r=e.length%cn;for(let e=0;e<n;e++)this._updateBlock(t[4*e+0],t[4*e+1],t[4*e+2],t[4*e+3]);return r&&(ln.set(e.subarray(n*cn)),this._updateBlock(un[0],un[1],un[2],un[3]),un.fill(0)),this}destroy(){let{t:e}=this;for(let t of e)t.s0=0,t.s1=0,t.s2=0,t.s3=0}digestInto(e){$t(this),en(e,this),this.finished=!0;let{s0:t,s1:n,s2:r,s3:i}=this,a=V(e);return a[0]=t,a[1]=n,a[2]=r,a[3]=i,e}digest(){let e=new Uint8Array(cn);return this.digestInto(e),this.destroy(),e}},pn=class extends fn{constructor(e,t){let n=function(e){e.reverse();let t=1&e[15],n=0;for(let t=0;t<e.length;t++){let r=e[t];e[t]=r>>>1|n,n=(1&r)<<7}return e[0]^=225&-t,e}((e=rn(e)).slice());super(n,t),n.fill(0)}update(e){e=rn(e),$t(this);let t=V(e),n=e.length%cn,r=Math.floor(e.length/cn);for(let e=0;e<r;e++)this._updateBlock(dn(t[4*e+3]),dn(t[4*e+2]),dn(t[4*e+1]),dn(t[4*e+0]));return n&&(ln.set(e.subarray(r*cn)),this._updateBlock(dn(un[3]),dn(un[2]),dn(un[1]),dn(un[0])),un.fill(0)),this}digestInto(e){$t(this),en(e,this),this.finished=!0;let{s0:t,s1:n,s2:r,s3:i}=this,a=V(e);return a[0]=t,a[1]=n,a[2]=r,a[3]=i,e.reverse()}};function mn(e){let t=(t,n)=>e(n,t.length).update(rn(t)).digest(),n=e(new Uint8Array(16),0);return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=(t,n)=>e(t,n),t}var hn=mn(((e,t)=>new fn(e,t))),gn=mn(((e,t)=>new pn(e,t))),_n=16,vn=new Uint8Array(_n);function yn(e){return e<<1^283&-(e>>7)}function bn(e,t){let n=0;for(;t>0;t>>=1)n^=e&-(1&t),e=yn(e);return n}var xn=(()=>{let e=new Uint8Array(256);for(let t=0,n=1;t<256;t++,n^=yn(n))e[t]=n;let t=new Uint8Array(256);t[0]=99;for(let n=0;n<255;n++){let r=e[255-n];r|=r<<8,t[e[n]]=255&(r^r>>4^r>>5^r>>6^r>>7^99)}return t})(),Sn=xn.map(((e,t)=>xn.indexOf(t))),Cn=e=>e<<8|e>>>24;function wn(e,t){if(e.length!==256)throw Error(`Wrong sbox length`);let n=new Uint32Array(256).map(((n,r)=>t(e[r]))),r=n.map(Cn),i=r.map(Cn),a=i.map(Cn),o=new Uint32Array(65536),s=new Uint32Array(65536),c=new Uint16Array(65536);for(let t=0;t<256;t++)for(let l=0;l<256;l++){let u=256*t+l;o[u]=n[t]^r[l],s[u]=i[t]^a[l],c[u]=e[t]<<8|e[l]}return{sbox:e,sbox2:c,T0:n,T1:r,T2:i,T3:a,T01:o,T23:s}}var Tn=wn(xn,(e=>bn(e,3)<<24|e<<16|e<<8|bn(e,2))),En=wn(Sn,(e=>bn(e,11)<<24|bn(e,13)<<16|bn(e,9)<<8|bn(e,14))),Dn=(()=>{let e=new Uint8Array(16);for(let t=0,n=1;t<16;t++,n=yn(n))e[t]=n;return e})();function On(e){B(e);let t=e.length;if(![16,24,32].includes(t))throw Error(`aes: wrong key size: should be 16, 24 or 32, got: ${t}`);let{sbox2:n}=Tn,r=V(e),i=r.length,a=e=>jn(n,e,e,e,e),o=new Uint32Array(t+28);o.set(r);for(let e=i;e<o.length;e++){let t=o[e-1];e%i==0?t=a((s=t)<<24|s>>>8)^Dn[e/i-1]:i>6&&e%i==4&&(t=a(t)),o[e]=o[e-i]^t}var s;return o}function kn(e){let t=On(e),n=t.slice(),r=t.length,{sbox2:i}=Tn,{T0:a,T1:o,T2:s,T3:c}=En;for(let e=0;e<r;e+=4)for(let i=0;i<4;i++)n[e+i]=t[r-e-4+i];t.fill(0);for(let e=4;e<r-4;e++){let t=n[e],r=jn(i,t,t,t,t);n[e]=a[255&r]^o[r>>>8&255]^s[r>>>16&255]^c[r>>>24]}return n}function An(e,t,n,r,i,a){return e[n<<8&65280|r>>>8&255]^t[i>>>8&65280|a>>>24&255]}function jn(e,t,n,r,i){return e[255&t|65280&n]|e[r>>>16&255|i>>>16&65280]<<16}function Mn(e,t,n,r,i){let{sbox2:a,T01:o,T23:s}=Tn,c=0;t^=e[c++],n^=e[c++],r^=e[c++],i^=e[c++];let l=e.length/4-2;for(let a=0;a<l;a++){let a=e[c++]^An(o,s,t,n,r,i),l=e[c++]^An(o,s,n,r,i,t),u=e[c++]^An(o,s,r,i,t,n),d=e[c++]^An(o,s,i,t,n,r);t=a,n=l,r=u,i=d}return{s0:e[c++]^jn(a,t,n,r,i),s1:e[c++]^jn(a,n,r,i,t),s2:e[c++]^jn(a,r,i,t,n),s3:e[c++]^jn(a,i,t,n,r)}}function Nn(e,t,n,r,i){let{sbox2:a,T01:o,T23:s}=En,c=0;t^=e[c++],n^=e[c++],r^=e[c++],i^=e[c++];let l=e.length/4-2;for(let a=0;a<l;a++){let a=e[c++]^An(o,s,t,i,r,n),l=e[c++]^An(o,s,n,t,i,r),u=e[c++]^An(o,s,r,n,t,i),d=e[c++]^An(o,s,i,r,n,t);t=a,n=l,r=u,i=d}return{s0:e[c++]^jn(a,t,i,r,n),s1:e[c++]^jn(a,n,t,i,r),s2:e[c++]^jn(a,r,n,t,i),s3:e[c++]^jn(a,i,r,n,t)}}function Pn(e,t){if(!t)return new Uint8Array(e);if(B(t),t.length<e)throw Error(`aes: wrong destination length, expected at least ${e}, got: ${t.length}`);return t}function Fn(e,t,n,r){B(t,_n),B(n);let i=n.length;r=Pn(i,r);let a=t,o=V(a),{s0:s,s1:c,s2:l,s3:u}=Mn(e,o[0],o[1],o[2],o[3]),d=V(n),f=V(r);for(let t=0;t+4<=d.length;t+=4){f[t+0]=d[t+0]^s,f[t+1]=d[t+1]^c,f[t+2]=d[t+2]^l,f[t+3]=d[t+3]^u;let n=1;for(let e=a.length-1;e>=0;e--)n=n+(255&a[e])|0,a[e]=255&n,n>>>=8;({s0:s,s1:c,s2:l,s3:u}=Mn(e,o[0],o[1],o[2],o[3]))}let p=_n*Math.floor(d.length/4);if(p<i){let e=tn(new Uint32Array([s,c,l,u]));for(let t=p,a=0;t<i;t++,a++)r[t]=n[t]^e[a]}return r}function In(e,t,n,r,i){B(n,_n),B(r),i=Pn(r.length,i);let a=n,o=V(a),s=nn(a),c=V(r),l=V(i),u=t?0:12,d=r.length,f=s.getUint32(u,t),{s0:p,s1:m,s2:h,s3:g}=Mn(e,o[0],o[1],o[2],o[3]);for(let n=0;n+4<=c.length;n+=4)l[n+0]=c[n+0]^p,l[n+1]=c[n+1]^m,l[n+2]=c[n+2]^h,l[n+3]=c[n+3]^g,f=f+1>>>0,s.setUint32(u,f,t),{s0:p,s1:m,s2:h,s3:g}=Mn(e,o[0],o[1],o[2],o[3]);let _=_n*Math.floor(c.length/4);if(_<d){let e=tn(new Uint32Array([p,m,h,g]));for(let t=_,n=0;t<d;t++,n++)i[t]=r[t]^e[n]}return i}on({blockSize:16,nonceLength:16},(function(e,t){function n(n,r){let i=On(e),a=t.slice(),o=Fn(i,a,n,r);return i.fill(0),a.fill(0),o}return B(e),B(t,_n),{encrypt:(e,t)=>n(e,t),decrypt:(e,t)=>n(e,t)}}));function Ln(e){if(B(e),e.length%_n!=0)throw Error(`aes/(cbc-ecb).decrypt ciphertext should consist of blocks with size 16`)}function Rn(e,t,n){let r=e.length,i=r%_n;if(!t&&i!==0)throw Error(`aec/(cbc-ecb): unpadded plaintext with disabled padding`);let a=V(e);if(t){let e=_n-i;e||=_n,r+=e}let o=Pn(r,n);return{b:a,o:V(o),out:o}}function zn(e,t){if(!t)return e;let n=e.length;if(!n)throw Error(`aes/pcks5: empty ciphertext not allowed`);let r=e[n-1];if(r<=0||r>16)throw Error(`aes/pcks5: wrong padding byte: ${r}`);let i=e.subarray(0,-r);for(let t=0;t<r;t++)if(e[n-t-1]!==r)throw Error(`aes/pcks5: wrong padding`);return i}function Bn(e){let t=new Uint8Array(16),n=V(t);t.set(e);let r=_n-e.length;for(let e=_n-r;e<_n;e++)t[e]=r;return n}on({blockSize:16},(function(e,t={}){B(e);let n=!t.disablePadding;return{encrypt:(t,r)=>{B(t);let{b:i,o:a,out:o}=Rn(t,n,r),s=On(e),c=0;for(;c+4<=i.length;){let{s0:e,s1:t,s2:n,s3:r}=Mn(s,i[c+0],i[c+1],i[c+2],i[c+3]);a[c++]=e,a[c++]=t,a[c++]=n,a[c++]=r}if(n){let e=Bn(t.subarray(4*c)),{s0:n,s1:r,s2:i,s3:o}=Mn(s,e[0],e[1],e[2],e[3]);a[c++]=n,a[c++]=r,a[c++]=i,a[c++]=o}return s.fill(0),o},decrypt:(t,r)=>{Ln(t);let i=kn(e),a=Pn(t.length,r),o=V(t),s=V(a);for(let e=0;e+4<=o.length;){let{s0:t,s1:n,s2:r,s3:a}=Nn(i,o[e+0],o[e+1],o[e+2],o[e+3]);s[e++]=t,s[e++]=n,s[e++]=r,s[e++]=a}return i.fill(0),zn(a,n)}}}));var Vn=on({blockSize:16,nonceLength:16},(function(e,t,n={}){B(e),B(t,16);let r=!n.disablePadding;return{encrypt:(n,i)=>{let a=On(e),{b:o,o:s,out:c}=Rn(n,r,i),l=V(t),u=l[0],d=l[1],f=l[2],p=l[3],m=0;for(;m+4<=o.length;)u^=o[m+0],d^=o[m+1],f^=o[m+2],p^=o[m+3],{s0:u,s1:d,s2:f,s3:p}=Mn(a,u,d,f,p),s[m++]=u,s[m++]=d,s[m++]=f,s[m++]=p;if(r){let e=Bn(n.subarray(4*m));u^=e[0],d^=e[1],f^=e[2],p^=e[3],{s0:u,s1:d,s2:f,s3:p}=Mn(a,u,d,f,p),s[m++]=u,s[m++]=d,s[m++]=f,s[m++]=p}return a.fill(0),c},decrypt:(n,i)=>{Ln(n);let a=kn(e),o=V(t),s=Pn(n.length,i),c=V(n),l=V(s),u=o[0],d=o[1],f=o[2],p=o[3];for(let e=0;e+4<=c.length;){let t=u,n=d,r=f,i=p;u=c[e+0],d=c[e+1],f=c[e+2],p=c[e+3];let{s0:o,s1:s,s2:m,s3:h}=Nn(a,u,d,f,p);l[e++]=o^t,l[e++]=s^n,l[e++]=m^r,l[e++]=h^i}return a.fill(0),zn(s,r)}}}));on({blockSize:16,nonceLength:16},(function(e,t){function n(n,r,i){let a=On(e),o=n.length;i=Pn(o,i);let s=V(n),c=V(i),l=r?c:s,u=V(t),d=u[0],f=u[1],p=u[2],m=u[3];for(let e=0;e+4<=s.length;){let{s0:t,s1:n,s2:r,s3:i}=Mn(a,d,f,p,m);c[e+0]=s[e+0]^t,c[e+1]=s[e+1]^n,c[e+2]=s[e+2]^r,c[e+3]=s[e+3]^i,d=l[e++],f=l[e++],p=l[e++],m=l[e++]}let h=_n*Math.floor(s.length/4);if(h<o){({s0:d,s1:f,s2:p,s3:m}=Mn(a,d,f,p,m));let e=tn(new Uint32Array([d,f,p,m]));for(let t=h,r=0;t<o;t++,r++)i[t]=n[t]^e[r];e.fill(0)}return a.fill(0),i}return B(e),B(t,16),{encrypt:(e,t)=>n(e,!0,t),decrypt:(e,t)=>n(e,!1,t)}}));function Hn(e,t,n,r,i){let a=e.create(n,r.length+(i?.length||0));i&&a.update(i),a.update(r);let o=new Uint8Array(16),s=nn(o);return i&&sn(s,0,BigInt(8*i.length),t),sn(s,8,BigInt(8*r.length),t),a.update(o),a.digest()}on({blockSize:16,nonceLength:12,tagLength:16},(function(e,t,n){if(B(t),t.length===0)throw Error(`aes/gcm: empty nonce`);function r(e,t,r){let i=Hn(hn,!1,e,r,n);for(let e=0;e<t.length;e++)i[e]^=t[e];return i}function i(){let n=On(e),r=vn.slice(),i=vn.slice();if(In(n,!1,i,i,r),t.length===12)i.set(t);else{let e=vn.slice();sn(nn(e),8,BigInt(8*t.length),!1),hn.create(r).update(t).update(e).digestInto(i)}return{xk:n,authKey:r,counter:i,tagMask:In(n,!1,i,vn)}}return{encrypt:e=>{B(e);let{xk:t,authKey:n,counter:a,tagMask:o}=i(),s=new Uint8Array(e.length+16);In(t,!1,a,e,s);let c=r(n,o,s.subarray(0,s.length-16));return s.set(c,e.length),t.fill(0),s},decrypt:e=>{if(B(e),e.length<16)throw Error(`aes/gcm: ciphertext less than tagLen (16)`);let{xk:t,authKey:n,counter:a,tagMask:o}=i(),s=e.subarray(0,-16),c=e.subarray(-16);if(!an(r(n,o,s),c))throw Error(`aes/gcm: invalid ghash tag`);let l=In(t,!1,a,s);return n.fill(0),o.fill(0),t.fill(0),l}}}));var Un=(e,t,n)=>r=>{if(!Number.isSafeInteger(r)||t>r||r>n)throw Error(`${e}: invalid value=${r}, must be [${t}..${n}]`)};on({blockSize:16,nonceLength:12,tagLength:16},(function(e,t,n){let r=Un(`AAD`,0,2**36),i=Un(`plaintext`,0,2**36),a=Un(`nonce`,12,12),o=Un(`ciphertext`,16,2**36+16);function s(){let n=e.length;if(n!==16&&n!==24&&n!==32)throw Error(`key length must be 16, 24 or 32 bytes, got: ${n} bytes`);let r=On(e),i=new Uint8Array(n),a=new Uint8Array(16),o=V(t),s=0,c=o[0],l=o[1],u=o[2],d=0;for(let e of[a,i].map(V)){let t=V(e);for(let e=0;e<t.length;e+=2){let{s0:n,s1:i}=Mn(r,s,c,l,u);t[e+0]=n,t[e+1]=i,s=++d}}return r.fill(0),{authKey:a,encKey:On(i)}}function c(e,r,i){let a=Hn(gn,!0,r,i,n);for(let e=0;e<12;e++)a[e]^=t[e];a[15]&=127;let o=V(a),s=o[0],c=o[1],l=o[2],u=o[3];return{s0:s,s1:c,s2:l,s3:u}=Mn(e,s,c,l,u),o[0]=s,o[1]=c,o[2]=l,o[3]=u,a}function l(e,t,n){let r=t.slice();return r[15]|=128,In(e,!0,r,n)}return B(t),a(t.length),n&&(B(n),r(n.length)),{encrypt:e=>{B(e),i(e.length);let{encKey:t,authKey:n}=s(),r=c(t,n,e),a=new Uint8Array(e.length+16);return a.set(r,e.length),a.set(l(t,r,e)),t.fill(0),n.fill(0),a},decrypt:e=>{B(e),o(e.length);let t=e.subarray(-16),{encKey:n,authKey:r}=s(),i=l(n,t,e.subarray(0,-16)),a=c(n,r,i);if(n.fill(0),r.fill(0),!an(t,a))throw Error(`invalid polyval tag`);return i}}}));var Wn=(e,t)=>255&e[t++]|(255&e[t++])<<8,Gn=class{constructor(e){this.blockLen=16,this.outputLen=16,this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.pos=0,this.finished=!1,B(e=rn(e),32);let t=Wn(e,0),n=Wn(e,2),r=Wn(e,4),i=Wn(e,6),a=Wn(e,8),o=Wn(e,10),s=Wn(e,12),c=Wn(e,14);this.r[0]=8191&t,this.r[1]=8191&(t>>>13|n<<3),this.r[2]=7939&(n>>>10|r<<6),this.r[3]=8191&(r>>>7|i<<9),this.r[4]=255&(i>>>4|a<<12),this.r[5]=a>>>1&8190,this.r[6]=8191&(a>>>14|o<<2),this.r[7]=8065&(o>>>11|s<<5),this.r[8]=8191&(s>>>8|c<<8),this.r[9]=c>>>5&127;for(let t=0;t<8;t++)this.pad[t]=Wn(e,16+2*t)}process(e,t,n=!1){let r=n?0:2048,{h:i,r:a}=this,o=a[0],s=a[1],c=a[2],l=a[3],u=a[4],d=a[5],f=a[6],p=a[7],m=a[8],h=a[9],g=Wn(e,t+0),_=Wn(e,t+2),v=Wn(e,t+4),y=Wn(e,t+6),b=Wn(e,t+8),x=Wn(e,t+10),S=Wn(e,t+12),C=Wn(e,t+14),w=i[0]+(8191&g),T=i[1]+(8191&(g>>>13|_<<3)),E=i[2]+(8191&(_>>>10|v<<6)),D=i[3]+(8191&(v>>>7|y<<9)),O=i[4]+(8191&(y>>>4|b<<12)),k=i[5]+(b>>>1&8191),A=i[6]+(8191&(b>>>14|x<<2)),j=i[7]+(8191&(x>>>11|S<<5)),M=i[8]+(8191&(S>>>8|C<<8)),N=i[9]+(C>>>5|r),P=0,F=P+w*o+5*h*T+5*m*E+5*p*D+5*f*O;P=F>>>13,F&=8191,F+=5*d*k+5*u*A+5*l*j+5*c*M+5*s*N,P+=F>>>13,F&=8191;let I=P+w*s+T*o+5*h*E+5*m*D+5*p*O;P=I>>>13,I&=8191,I+=5*f*k+5*d*A+5*u*j+5*l*M+5*c*N,P+=I>>>13,I&=8191;let L=P+w*c+T*s+E*o+5*h*D+5*m*O;P=L>>>13,L&=8191,L+=5*p*k+5*f*A+5*d*j+5*u*M+5*l*N,P+=L>>>13,L&=8191;let R=P+w*l+T*c+E*s+D*o+5*h*O;P=R>>>13,R&=8191,R+=5*m*k+5*p*A+5*f*j+5*d*M+5*u*N,P+=R>>>13,R&=8191;let ee=P+w*u+T*l+E*c+D*s+O*o;P=ee>>>13,ee&=8191,ee+=5*h*k+5*m*A+5*p*j+5*f*M+5*d*N,P+=ee>>>13,ee&=8191;let te=P+w*d+T*u+E*l+D*c+O*s;P=te>>>13,te&=8191,te+=k*o+5*h*A+5*m*j+5*p*M+5*f*N,P+=te>>>13,te&=8191;let ne=P+w*f+T*d+E*u+D*l+O*c;P=ne>>>13,ne&=8191,ne+=k*s+A*o+5*h*j+5*m*M+5*p*N,P+=ne>>>13,ne&=8191;let re=P+w*p+T*f+E*d+D*u+O*l;P=re>>>13,re&=8191,re+=k*c+A*s+j*o+5*h*M+5*m*N,P+=re>>>13,re&=8191;let ie=P+w*m+T*p+E*f+D*d+O*u;P=ie>>>13,ie&=8191,ie+=k*l+A*c+j*s+M*o+5*h*N,P+=ie>>>13,ie&=8191;let ae=P+w*h+T*m+E*p+D*f+O*d;P=ae>>>13,ae&=8191,ae+=k*u+A*l+j*c+M*s+N*o,P+=ae>>>13,ae&=8191,P=(P<<2)+P|0,P=P+F|0,F=8191&P,P>>>=13,I+=P,i[0]=F,i[1]=I,i[2]=L,i[3]=R,i[4]=ee,i[5]=te,i[6]=ne,i[7]=re,i[8]=ie,i[9]=ae}finalize(){let{h:e,pad:t}=this,n=new Uint16Array(10),r=e[1]>>>13;e[1]&=8191;for(let t=2;t<10;t++)e[t]+=r,r=e[t]>>>13,e[t]&=8191;e[0]+=5*r,r=e[0]>>>13,e[0]&=8191,e[1]+=r,r=e[1]>>>13,e[1]&=8191,e[2]+=r,n[0]=e[0]+5,r=n[0]>>>13,n[0]&=8191;for(let t=1;t<10;t++)n[t]=e[t]+r,r=n[t]>>>13,n[t]&=8191;n[9]-=8192;let i=(1^r)-1;for(let e=0;e<10;e++)n[e]&=i;i=~i;for(let t=0;t<10;t++)e[t]=e[t]&i|n[t];e[0]=65535&(e[0]|e[1]<<13),e[1]=65535&(e[1]>>>3|e[2]<<10),e[2]=65535&(e[2]>>>6|e[3]<<7),e[3]=65535&(e[3]>>>9|e[4]<<4),e[4]=65535&(e[4]>>>12|e[5]<<1|e[6]<<14),e[5]=65535&(e[6]>>>2|e[7]<<11),e[6]=65535&(e[7]>>>5|e[8]<<8),e[7]=65535&(e[8]>>>8|e[9]<<5);let a=e[0]+t[0];e[0]=65535&a;for(let n=1;n<8;n++)a=(e[n]+t[n]|0)+(a>>>16)|0,e[n]=65535&a}update(e){$t(this);let{buffer:t,blockLen:n}=this,r=(e=rn(e)).length;for(let i=0;i<r;){let a=Math.min(n-this.pos,r-i);if(a!==n)t.set(e.subarray(i,i+a),this.pos),this.pos+=a,i+=a,this.pos===n&&(this.process(t,0,!1),this.pos=0);else for(;n<=r-i;i+=n)this.process(e,i)}return this}destroy(){this.h.fill(0),this.r.fill(0),this.buffer.fill(0),this.pad.fill(0)}digestInto(e){$t(this),en(e,this),this.finished=!0;let{buffer:t,h:n}=this,{pos:r}=this;if(r){for(t[r++]=1;r<16;r++)t[r]=0;this.process(t,0,!0)}this.finalize();let i=0;for(let t=0;t<8;t++)e[i++]=n[t]>>>0,e[i++]=n[t]>>>8;return e}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}};(function(e){let t=(t,n)=>e(n).update(rn(t)).digest(),n=e(new Uint8Array(32));return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=t=>e(t),t})((e=>new Gn(e)));var Kn=e=>Uint8Array.from(e.split(``).map((e=>e.charCodeAt(0)))),qn=Kn(`expand 16-byte k`),Jn=Kn(`expand 32-byte k`),Yn=V(qn),Xn=V(Jn);Xn.slice();function H(e,t){return e<<t|e>>>32-t}function Zn(e){return e.byteOffset%4==0}var Qn=2**32-1,$n=new Uint32Array;function er(e,t){let{allowShortKeys:n,extendNonceFn:r,counterLength:i,counterRight:a,rounds:o}=function(e,t){if(typeof t!=`object`||!t)throw Error(`options must be defined`);return Object.assign(e,t)}({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},t);if(typeof e!=`function`)throw Error(`core must be a function`);return Xt(i),Xt(o),Zt(a),Zt(n),(t,s,c,l,u=0)=>{B(t),B(s),B(c);let d=c.length;if(l||=new Uint8Array(d),B(l),Xt(u),u<0||u>=Qn)throw Error(`arx: counter overflow`);if(l.length<d)throw Error(`arx: output (${l.length}) is shorter than data (${d})`);let f=[],p,m,h=t.length;if(h===32)p=t.slice(),f.push(p),m=Xn;else{if(h!==16||!n)throw Error(`arx: invalid 32-byte key, got length=${h}`);p=new Uint8Array(32),p.set(t),p.set(t,16),m=Yn,f.push(p)}Zn(s)||(s=s.slice(),f.push(s));let g=V(p);if(r){if(s.length!==24)throw Error(`arx: extended nonce must be 24 bytes`);r(m,g,V(s.subarray(0,16)),g),s=s.subarray(16)}let _=16-i;if(_!==s.length)throw Error(`arx: nonce must be ${_} or 16 bytes`);if(_!==12){let e=new Uint8Array(12);e.set(s,a?0:12-s.length),s=e,f.push(s)}let v=V(s);for(function(e,t,n,r,i,a,o,s){let c=i.length,l=new Uint8Array(64),u=V(l),d=Zn(i)&&Zn(a),f=d?V(i):$n,p=d?V(a):$n;for(let m=0;m<c;o++){if(e(t,n,r,u,o,s),o>=Qn)throw Error(`arx: counter overflow`);let h=Math.min(64,c-m);if(d&&h===64){let e=m/4;if(m%4!=0)throw Error(`arx: invalid block position`);for(let t,n=0;n<16;n++)t=e+n,p[t]=f[t]^u[n];m+=64}else{for(let e,t=0;t<h;t++)e=m+t,a[e]=i[e]^l[t];m+=h}}}(e,m,g,v,c,l,u,o);f.length>0;)f.pop().fill(0);return l}}function tr(e,t,n,r,i,a=20){let o=e[0],s=e[1],c=e[2],l=e[3],u=t[0],d=t[1],f=t[2],p=t[3],m=t[4],h=t[5],g=t[6],_=t[7],v=i,y=n[0],b=n[1],x=n[2],S=o,C=s,w=c,T=l,E=u,D=d,O=f,k=p,A=m,j=h,M=g,N=_,P=v,F=y,I=b,L=x;for(let e=0;e<a;e+=2)S=S+E|0,P=H(P^S,16),A=A+P|0,E=H(E^A,12),S=S+E|0,P=H(P^S,8),A=A+P|0,E=H(E^A,7),C=C+D|0,F=H(F^C,16),j=j+F|0,D=H(D^j,12),C=C+D|0,F=H(F^C,8),j=j+F|0,D=H(D^j,7),w=w+O|0,I=H(I^w,16),M=M+I|0,O=H(O^M,12),w=w+O|0,I=H(I^w,8),M=M+I|0,O=H(O^M,7),T=T+k|0,L=H(L^T,16),N=N+L|0,k=H(k^N,12),T=T+k|0,L=H(L^T,8),N=N+L|0,k=H(k^N,7),S=S+D|0,L=H(L^S,16),M=M+L|0,D=H(D^M,12),S=S+D|0,L=H(L^S,8),M=M+L|0,D=H(D^M,7),C=C+O|0,P=H(P^C,16),N=N+P|0,O=H(O^N,12),C=C+O|0,P=H(P^C,8),N=N+P|0,O=H(O^N,7),w=w+k|0,F=H(F^w,16),A=A+F|0,k=H(k^A,12),w=w+k|0,F=H(F^w,8),A=A+F|0,k=H(k^A,7),T=T+E|0,I=H(I^T,16),j=j+I|0,E=H(E^j,12),T=T+E|0,I=H(I^T,8),j=j+I|0,E=H(E^j,7);let R=0;r[R++]=o+S|0,r[R++]=s+C|0,r[R++]=c+w|0,r[R++]=l+T|0,r[R++]=u+E|0,r[R++]=d+D|0,r[R++]=f+O|0,r[R++]=p+k|0,r[R++]=m+A|0,r[R++]=h+j|0,r[R++]=g+M|0,r[R++]=_+N|0,r[R++]=v+P|0,r[R++]=y+F|0,r[R++]=b+I|0,r[R++]=x+L|0}var nr=er(tr,{counterRight:!1,counterLength:4,allowShortKeys:!1});er(tr,{counterRight:!1,counterLength:8,extendNonceFn:function(e,t,n,r){let i=e[0],a=e[1],o=e[2],s=e[3],c=t[0],l=t[1],u=t[2],d=t[3],f=t[4],p=t[5],m=t[6],h=t[7],g=n[0],_=n[1],v=n[2],y=n[3];for(let e=0;e<20;e+=2)i=i+c|0,g=H(g^i,16),f=f+g|0,c=H(c^f,12),i=i+c|0,g=H(g^i,8),f=f+g|0,c=H(c^f,7),a=a+l|0,_=H(_^a,16),p=p+_|0,l=H(l^p,12),a=a+l|0,_=H(_^a,8),p=p+_|0,l=H(l^p,7),o=o+u|0,v=H(v^o,16),m=m+v|0,u=H(u^m,12),o=o+u|0,v=H(v^o,8),m=m+v|0,u=H(u^m,7),s=s+d|0,y=H(y^s,16),h=h+y|0,d=H(d^h,12),s=s+d|0,y=H(y^s,8),h=h+y|0,d=H(d^h,7),i=i+l|0,y=H(y^i,16),m=m+y|0,l=H(l^m,12),i=i+l|0,y=H(y^i,8),m=m+y|0,l=H(l^m,7),a=a+u|0,g=H(g^a,16),h=h+g|0,u=H(u^h,12),a=a+u|0,g=H(g^a,8),h=h+g|0,u=H(u^h,7),o=o+d|0,_=H(_^o,16),f=f+_|0,d=H(d^f,12),o=o+d|0,_=H(_^o,8),f=f+_|0,d=H(d^f,7),s=s+c|0,v=H(v^s,16),p=p+v|0,c=H(c^p,12),s=s+c|0,v=H(v^s,8),p=p+v|0,c=H(c^p,7);let b=0;r[b++]=i,r[b++]=a,r[b++]=o,r[b++]=s,r[b++]=g,r[b++]=_,r[b++]=v,r[b++]=y},allowShortKeys:!1});var rr=class extends ht{constructor(e,t){super(),this.finished=!1,this.destroyed=!1,bt.hash(e);let n=pt(t);if(this.iHash=e.create(),typeof this.iHash.update!=`function`)throw Error(`Expected instance of class which extends utils.Hash`);this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let r=this.blockLen,i=new Uint8Array(r);i.set(n.length>r?e.create().update(n).digest():n);for(let e=0;e<i.length;e++)i[e]^=54;this.iHash.update(i),this.oHash=e.create();for(let e=0;e<i.length;e++)i[e]^=106;this.oHash.update(i),i.fill(0)}update(e){return bt.exists(this),this.iHash.update(e),this}digestInto(e){bt.exists(this),bt.bytes(e,this.outputLen),this.finished=!0,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy()}digest(){let e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});let{oHash:t,iHash:n,finished:r,destroyed:i,blockLen:a,outputLen:o}=this;return e.finished=r,e.destroyed=i,e.blockLen=a,e.outputLen=o,e.oHash=t._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}},ir=(e,t,n)=>new rr(e,t).update(n).digest();function ar(e,t,n){return bt.hash(e),n===void 0&&(n=new Uint8Array(e.outputLen)),ir(e,pt(n),pt(t))}ir.create=(e,t)=>new rr(e,t);var or=new Uint8Array([0]),sr=new Uint8Array;function cr(e,t,n,r=32){if(bt.hash(e),bt.number(r),r>255*e.outputLen)throw Error(`Length should be <= 255*HashLen`);let i=Math.ceil(r/e.outputLen);n===void 0&&(n=sr);let a=new Uint8Array(i*e.outputLen),o=ir.create(e,t),s=o._cloneInto(),c=new Uint8Array(o.outputLen);for(let t=0;t<i;t++)or[0]=t+1,s.update(t===0?sr:c).update(n).update(or).digestInto(c),a.set(c,e.outputLen*t),o._cloneInto(s);return o.destroy(),s.destroy(),c.fill(0),or.fill(0),a.slice(0,r)}var lr=Object.defineProperty,ur=(e,t)=>{for(var n in t)lr(e,n,{get:t[n],enumerable:!0})},dr=Symbol(`verified`),fr=e=>e instanceof Object;function pr(e){if(!fr(e)||typeof e.kind!=`number`||typeof e.content!=`string`||typeof e.created_at!=`number`||typeof e.pubkey!=`string`||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let e=0;e<n.length;e++)if(typeof n[e]==`object`)return!1}return!0}function mr(e){return e.sort(((e,t)=>e.created_at===t.created_at?e.id.localeCompare(t.id):t.created_at-e.created_at))}var hr={};ur(hr,{Queue:()=>Cr,QueueNode:()=>Sr,binarySearch:()=>xr,insertEventIntoAscendingList:()=>br,insertEventIntoDescendingList:()=>yr,normalizeURL:()=>vr,utf8Decoder:()=>gr,utf8Encoder:()=>_r});var gr=new TextDecoder(`utf-8`),_r=new TextEncoder;function vr(e){e.indexOf(`://`)===-1&&(e=`wss://`+e);let t=new URL(e);return t.pathname=t.pathname.replace(/\/+/g,`/`),t.pathname.endsWith(`/`)&&(t.pathname=t.pathname.slice(0,-1)),(t.port===`80`&&t.protocol===`ws:`||t.port===`443`&&t.protocol===`wss:`)&&(t.port=``),t.searchParams.sort(),t.hash=``,t.toString()}function yr(e,t){let[n,r]=xr(e,(e=>t.id===e.id?0:t.created_at===e.created_at?-1:e.created_at-t.created_at));return r||e.splice(n,0,t),e}function br(e,t){let[n,r]=xr(e,(e=>t.id===e.id?0:t.created_at===e.created_at?-1:t.created_at-e.created_at));return r||e.splice(n,0,t),e}function xr(e,t){let n=0,r=e.length-1;for(;n<=r;){let i=Math.floor((n+r)/2),a=t(e[i]);if(a===0)return[i,!0];a<0?r=i-1:n=i+1}return[n,!1]}var Sr=class{value;next=null;prev=null;constructor(e){this.value=e}},Cr=class{first;last;constructor(){this.first=null,this.last=null}enqueue(e){let t=new Sr(e);return this.last?this.last===this.first?(this.last=t,this.last.prev=this.first,this.first.next=t):(t.prev=this.last,this.last.next=t,this.last=t):(this.first=t,this.last=t),!0}dequeue(){if(!this.first)return null;if(this.first===this.last){let e=this.first;return this.first=null,this.last=null,e.value}let e=this.first;return this.first=e.next,e.value}};function wr(e){if(!pr(e))throw Error(`can't serialize event with wrong or missing properties`);return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function Tr(e){return dt(Ot(_r.encode(wr(e))))}var Er=new class{generateSecretKey(){return at.utils.randomPrivateKey()}getPublicKey(e){return dt(at.getPublicKey(e))}finalizeEvent(e,t){let n=e;return n.pubkey=dt(at.getPublicKey(t)),n.id=Tr(n),n.sig=dt(at.sign(Tr(n),t)),n[dr]=!0,n}verifyEvent(e){if(typeof e[dr]==`boolean`)return e[dr];let t=Tr(e);if(t!==e.id)return e[dr]=!1,!1;try{let n=at.verify(e.sig,t,e.pubkey);return e[dr]=n,n}catch{return e[dr]=!1,!1}}},Dr=Er.generateSecretKey,Or=Er.getPublicKey,kr=Er.finalizeEvent,Ar=Er.verifyEvent,jr={};function Mr(e){return 1e3<=e&&e<1e4||[1,2,4,5,6,7,8,16,40,41,42,43,44].includes(e)}function Nr(e){return[0,3].includes(e)||1e4<=e&&e<2e4}function Pr(e){return 2e4<=e&&e<3e4}function Fr(e){return 3e4<=e&&e<4e4}function Ir(e){return Mr(e)?`regular`:Nr(e)?`replaceable`:Pr(e)?`ephemeral`:Fr(e)?`parameterized`:`unknown`}function Lr(e,t){let n=t instanceof Array?t:[t];return pr(e)&&n.includes(e.kind)||!1}ur(jr,{Application:()=>Yi,BadgeAward:()=>Kr,BadgeDefinition:()=>Hi,BlockedRelaysList:()=>Ci,BookmarkList:()=>bi,Bookmarksets:()=>zi,Calendar:()=>na,CalendarEventRSVP:()=>ra,ChannelCreation:()=>Xr,ChannelHideMessage:()=>$r,ChannelMessage:()=>Qr,ChannelMetadata:()=>Zr,ChannelMuteUser:()=>ei,ClassifiedListing:()=>Qi,ClientAuth:()=>ji,CommunitiesList:()=>xi,CommunityDefinition:()=>oa,CommunityPostApproval:()=>li,Contacts:()=>Vr,CreateOrUpdateProduct:()=>Gi,CreateOrUpdateStall:()=>Wi,Curationsets:()=>Bi,Date:()=>ea,DirectMessageRelaysList:()=>Di,DraftClassifiedListing:()=>$i,DraftLong:()=>qi,Emojisets:()=>Ji,EncryptedDirectMessage:()=>Hr,EventDeletion:()=>Ur,FileMetadata:()=>ri,FileServerPreference:()=>Oi,Followsets:()=>Ii,GenericRepost:()=>Yr,Genericlists:()=>Li,GiftWrap:()=>ni,HTTPAuth:()=>Fi,Handlerinformation:()=>aa,Handlerrecommendation:()=>ia,Highlights:()=>gi,InterestsList:()=>Ti,Interestsets:()=>Ui,JobFeedback:()=>fi,JobRequest:()=>ui,JobResult:()=>di,Label:()=>ci,LightningPubRPC:()=>Ai,LiveChatMessage:()=>ii,LiveEvent:()=>Xi,LongFormArticle:()=>Ki,Metadata:()=>Rr,Mutelist:()=>_i,NWCWalletInfo:()=>ki,NWCWalletRequest:()=>Mi,NWCWalletResponse:()=>Ni,NostrConnect:()=>Pi,OpenTimestamps:()=>ti,Pinlist:()=>vi,PrivateDirectMessage:()=>Jr,ProblemTracker:()=>ai,ProfileBadges:()=>Vi,PublicChatsList:()=>Si,Reaction:()=>Gr,RecommendRelay:()=>Br,RelayList:()=>yi,Relaysets:()=>Ri,Report:()=>oi,Reporting:()=>si,Repost:()=>Wr,Seal:()=>qr,SearchRelaysList:()=>wi,ShortTextNote:()=>zr,Time:()=>ta,UserEmojiList:()=>Ei,UserStatuses:()=>Zi,Zap:()=>hi,ZapGoal:()=>pi,ZapRequest:()=>mi,classifyKind:()=>Ir,isEphemeralKind:()=>Pr,isKind:()=>Lr,isParameterizedReplaceableKind:()=>Fr,isRegularKind:()=>Mr,isReplaceableKind:()=>Nr});var Rr=0,zr=1,Br=2,Vr=3,Hr=4,Ur=5,Wr=6,Gr=7,Kr=8,qr=13,Jr=14,Yr=16,Xr=40,Zr=41,Qr=42,$r=43,ei=44,ti=1040,ni=1059,ri=1063,ii=1311,ai=1971,oi=1984,si=1984,ci=1985,li=4550,ui=5999,di=6999,fi=7e3,pi=9041,mi=9734,hi=9735,gi=9802,_i=1e4,vi=10001,yi=10002,bi=10003,xi=10004,Si=10005,Ci=10006,wi=10007,Ti=10015,Ei=10030,Di=10050,Oi=10096,ki=13194,Ai=21e3,ji=22242,Mi=23194,Ni=23195,Pi=24133,Fi=27235,Ii=3e4,Li=30001,Ri=30002,zi=30003,Bi=30004,Vi=30008,Hi=30009,Ui=30015,Wi=30017,Gi=30018,Ki=30023,qi=30024,Ji=30030,Yi=30078,Xi=30311,Zi=30315,Qi=30402,$i=30403,ea=31922,ta=31923,na=31924,ra=31925,ia=31989,aa=31990,oa=34550;function sa(e,t){if(e.ids&&e.ids.indexOf(t.id)===-1||e.kinds&&e.kinds.indexOf(t.kind)===-1||e.authors&&e.authors.indexOf(t.pubkey)===-1)return!1;for(let n in e)if(n[0]===`#`){let r=e[`#${n.slice(1)}`];if(r&&!t.tags.find((([e,t])=>e===n.slice(1)&&r.indexOf(t)!==-1)))return!1}return!(e.since&&t.created_at<e.since)&&!(e.until&&t.created_at>e.until)}function ca(e,t){for(let n=0;n<e.length;n++)if(sa(e[n],t))return!0;return!1}function la(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];Object.entries(r).forEach((([e,n])=>{if(e===`kinds`||e===`ids`||e===`authors`||e[0]===`#`){t[e]=t[e]||[];for(let r=0;r<n.length;r++){let i=n[r];t[e].includes(i)||t[e].push(i)}}})),r.limit&&(!t.limit||r.limit>t.limit)&&(t.limit=r.limit),r.until&&(!t.until||r.until>t.until)&&(t.until=r.until),r.since&&(!t.since||r.since<t.since)&&(t.since=r.since)}return t}function ua(e){if(e.ids&&!e.ids.length||e.kinds&&!e.kinds.length||e.authors&&!e.authors.length)return 0;for(let[t,n]of Object.entries(e))if(t[0]===`#`&&Array.isArray(n)&&!n.length)return 0;return Math.min(Math.max(0,e.limit??1/0),e.ids?.length??1/0,e.authors?.length&&e.kinds?.every((e=>Nr(e)))?e.authors.length*e.kinds.length:1/0,e.authors?.length&&e.kinds?.every((e=>Fr(e)))&&e[`#d`]?.length?e.authors.length*e.kinds.length*e[`#d`].length:1/0)}var da={};function fa(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,i=e.slice(r).indexOf(`"`)+r+1;return e.slice(i,i+64)}function pa(e,t){let n=t.length,r=e.indexOf(`"${t}":`)+n+3,i=e.slice(r),a=Math.min(i.indexOf(`,`),i.indexOf(`}`));return parseInt(i.slice(0,a),10)}function ma(e){let t=e.slice(0,22).indexOf(`"EVENT"`);if(t===-1)return null;let n=e.slice(t+7+1).indexOf(`"`);if(n===-1)return null;let r=t+7+1+n,i=e.slice(r+1,80).indexOf(`"`);if(i===-1)return null;let a=r+1+i;return e.slice(r+1,a)}function ha(e,t){return t===fa(e,`id`)}function ga(e,t){return t===fa(e,`pubkey`)}function _a(e,t){return t===pa(e,`kind`)}ur(da,{getHex64:()=>fa,getInt:()=>pa,getSubscriptionId:()=>ma,matchEventId:()=>ha,matchEventKind:()=>_a,matchEventPubkey:()=>ga});var va={};function ya(e,t){return{kind:ji,created_at:Math.floor(Date.now()/1e3),tags:[[`relay`,e],[`challenge`,t]],content:``}}async function ba(){return new Promise((e=>{let t=new MessageChannel,n=()=>{t.port1.removeEventListener(`message`,n),e()};t.port1.addEventListener(`message`,n),t.port2.postMessage(0),t.port1.start()}))}ur(va,{makeAuthEvent:()=>ya});var xa,Sa=e=>(e[dr]=!0,!0),Ca=class{url;_connected=!1;onclose=null;onnotice=e=>{};_onauth=null;baseEoseTimeout=4400;connectionTimeout=4400;publishTimeout=4400;openSubs=new Map;connectionTimeoutHandle;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;incomingMessageQueue=new Cr;queueRunning=!1;challenge;serial=0;verifyEvent;_WebSocket;constructor(e,t){this.url=vr(e),this.verifyEvent=t.verifyEvent,this._WebSocket=t.websocketImplementation||WebSocket}static async connect(e,t){let n=new Ca(e,t);return await n.connect(),n}closeAllSubscriptions(e){for(let[t,n]of this.openSubs)n.close(e);this.openSubs.clear();for(let[t,n]of this.openEventPublishes)n.reject(Error(e));this.openEventPublishes.clear();for(let[t,n]of this.openCountRequests)n.reject(Error(e));this.openCountRequests.clear()}get connected(){return this._connected}async connect(){return this.connectionPromise||=(this.challenge=void 0,new Promise(((e,t)=>{this.connectionTimeoutHandle=setTimeout((()=>{t(`connection timed out`),this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions(`relay connection timed out`)}),this.connectionTimeout);try{this.ws=new this._WebSocket(this.url)}catch(e){t(e);return}this.ws.onopen=()=>{clearTimeout(this.connectionTimeoutHandle),this._connected=!0,e()},this.ws.onerror=e=>{t(e.message||`websocket error`),this._connected&&(this._connected=!1,this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions(`relay connection errored`))},this.ws.onclose=async()=>{this._connected&&(this._connected=!1,this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions(`relay connection closed`))},this.ws.onmessage=this._onmessage.bind(this)}))),this.connectionPromise}async runQueue(){for(this.queueRunning=!0;!1!==this.handleNext();)await ba();this.queueRunning=!1}handleNext(){let e=this.incomingMessageQueue.dequeue();if(!e)return!1;let t=ma(e);if(t){let n=this.openSubs.get(t);if(!n)return;let r=fa(e,`id`),i=n.alreadyHaveEvent?.(r);if(n.receivedEvent?.(this,r),i)return}try{let t=JSON.parse(e);switch(t[0]){case`EVENT`:{let e=this.openSubs.get(t[1]),n=t[2];this.verifyEvent(n)&&ca(e.filters,n)&&e.onevent(n);return}case`COUNT`:{let e=t[1],n=t[2],r=this.openCountRequests.get(e);r&&(r.resolve(n.count),this.openCountRequests.delete(e));return}case`EOSE`:{let e=this.openSubs.get(t[1]);if(!e)return;e.receivedEose();return}case`OK`:{let e=t[1],n=t[2],r=t[3],i=this.openEventPublishes.get(e);i&&(n?i.resolve(r):i.reject(Error(r)),this.openEventPublishes.delete(e));return}case`CLOSED`:{let e=t[1],n=this.openSubs.get(e);if(!n)return;n.closed=!0,n.close(t[2]);return}case`NOTICE`:this.onnotice(t[1]);return;case`AUTH`:this.challenge=t[1],this._onauth?.(t[1]);return}}catch{return}}async send(e){if(!this.connectionPromise)throw Error(`sending on closed connection`);this.connectionPromise.then((()=>{this.ws?.send(e)}))}async auth(e){if(!this.challenge)throw Error(`can't perform auth, no challenge was received`);let t=await e(ya(this.url,this.challenge)),n=new Promise(((e,n)=>{this.openEventPublishes.set(t.id,{resolve:e,reject:n})}));return this.send(`["AUTH",`+JSON.stringify(t)+`]`),n}async publish(e){let t=new Promise(((t,n)=>{this.openEventPublishes.set(e.id,{resolve:t,reject:n})}));return this.send(`["EVENT",`+JSON.stringify(e)+`]`),setTimeout((()=>{let t=this.openEventPublishes.get(e.id);t&&(t.reject(Error(`publish timed out`)),this.openEventPublishes.delete(e.id))}),this.publishTimeout),t}async count(e,t){this.serial++;let n=t?.id||`count:`+this.serial,r=new Promise(((e,t)=>{this.openCountRequests.set(n,{resolve:e,reject:t})}));return this.send(`["COUNT","`+n+`",`+JSON.stringify(e).substring(1)),r}subscribe(e,t){let n=this.prepareSubscription(e,t);return n.fire(),n}prepareSubscription(e,t){this.serial++;let n=t.id||`sub:`+this.serial,r=new wa(this,n,e,t);return this.openSubs.set(n,r),r}close(){this.closeAllSubscriptions(`relay connection closed by us`),this._connected=!1,this.ws?.close()}_onmessage(e){this.incomingMessageQueue.enqueue(e.data),this.queueRunning||this.runQueue()}},wa=class{relay;id;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oneose;onclose;eoseTimeout;eoseTimeoutHandle;constructor(e,t,n,r){this.relay=e,this.filters=n,this.id=t,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||e.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.onevent=r.onevent||(e=>{})}fire(){this.relay.send(`["REQ","`+this.id+`",`+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(e=`closed by caller`){!this.closed&&this.relay.connected&&(this.relay.send(`["CLOSE",`+JSON.stringify(this.id)+`]`),this.closed=!0),this.relay.openSubs.delete(this.id),this.onclose?.(e)}};try{xa=WebSocket}catch{}var Ta,Ea=class extends Ca{constructor(e){super(e,{verifyEvent:Ar,websocketImplementation:xa})}static async connect(e){let t=new Ea(e);return await t.connect(),t}},Da=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;trustedRelayURLs=new Set;_WebSocket;constructor(e){this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation}async ensureRelay(e,t){e=vr(e);let n=this.relays.get(e);return n||(n=new Ca(e,{verifyEvent:this.trustedRelayURLs.has(e)?Sa:this.verifyEvent,websocketImplementation:this._WebSocket}),t?.connectionTimeout&&(n.connectionTimeout=t.connectionTimeout),this.relays.set(e,n)),await n.connect(),n}close(e){e.map(vr).forEach((e=>{this.relays.get(e)?.close()}))}subscribeMany(e,t,n){return this.subscribeManyMap(Object.fromEntries(e.map((e=>[e,t]))),n)}subscribeManyMap(e,t){this.trackRelays&&(t.receivedEvent=(e,t)=>{let n=this.seenOn.get(t);n||(n=new Set,this.seenOn.set(t,n)),n.add(e)});let n=new Set,r=[],i=Object.keys(e).length,a=[],o=e=>{a[e]=!0,a.filter((e=>e)).length===i&&(t.oneose?.(),o=()=>{})},s=[],c=(e,n)=>{o(e),s[e]=n,s.filter((e=>e)).length===i&&(t.onclose?.(s),c=()=>{})},l=e=>{if(t.alreadyHaveEvent?.(e))return!0;let r=n.has(e);return n.add(e),r},u=Promise.all(Object.entries(e).map((async(e,n,i)=>{if(i.indexOf(e)!==n)return void c(n,`duplicate url`);let a,[s,u]=e;s=vr(s);try{a=await this.ensureRelay(s,{connectionTimeout:t.maxWait?Math.max(.8*t.maxWait,t.maxWait-1e3):void 0})}catch(e){c(n,e?.message||String(e));return}let d=a.subscribe(u,{...t,oneose:()=>o(n),onclose:e=>c(n,e),alreadyHaveEvent:l,eoseTimeout:t.maxWait});r.push(d)})));return{async close(){await u,r.forEach((e=>{e.close()}))}}}subscribeManyEose(e,t,n){let r=this.subscribeMany(e,t,{...n,oneose(){r.close()}});return r}async querySync(e,t,n){return new Promise((async r=>{let i=[];this.subscribeManyEose(e,[t],{...n,onevent(e){i.push(e)},onclose(e){r(i)}})}))}async get(e,t,n){t.limit=1;let r=await this.querySync(e,t,n);return r.sort(((e,t)=>t.created_at-e.created_at)),r[0]||null}publish(e,t){return e.map(vr).map((async(e,n,r)=>{if(r.indexOf(e)!==n)return Promise.reject(`duplicate url`);let i=await this.ensureRelay(e);return i.publish(t).then((e=>{if(this.trackRelays){let e=this.seenOn.get(t.id);e||(e=new Set,this.seenOn.set(t.id,e)),e.add(i)}return e}))}))}listConnectionStatus(){let e=new Map;return this.relays.forEach(((t,n)=>e.set(n,t.connected))),e}destroy(){this.relays.forEach((e=>e.close())),this.relays=new Map}};try{Ta=WebSocket}catch{}var Oa=class extends Da{constructor(){super({verifyEvent:Ar,websocketImplementation:Ta})}},ka={};ur(ka,{BECH32_REGEX:()=>Ma,Bech32MaxSize:()=>ja,NostrTypeGuard:()=>Aa,decode:()=>Na,encodeBytes:()=>za,naddrEncode:()=>Ha,neventEncode:()=>Va,noteEncode:()=>La,nprofileEncode:()=>Ba,npubEncode:()=>Ia,nsecEncode:()=>Fa});var Aa={isNProfile:e=>/^nprofile1[a-z\d]+$/.test(e||``),isNEvent:e=>/^nevent1[a-z\d]+$/.test(e||``),isNAddr:e=>/^naddr1[a-z\d]+$/.test(e||``),isNSec:e=>/^nsec1[a-z\d]{58}$/.test(e||``),isNPub:e=>/^npub1[a-z\d]{58}$/.test(e||``),isNote:e=>/^note1[a-z\d]+$/.test(e||``),isNcryptsec:e=>/^ncryptsec1[a-z\d]+$/.test(e||``)},ja=5e3,Ma=/[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;function Na(e){let{prefix:t,words:n}=Yt.decode(e,ja),r=new Uint8Array(Yt.fromWords(n));switch(t){case`nprofile`:{let e=Pa(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nprofile`);if(e[0][0].length!==32)throw Error(`TLV 0 should be 32 bytes`);return{type:`nprofile`,data:{pubkey:dt(e[0][0]),relays:e[1]?e[1].map((e=>gr.decode(e))):[]}}}case`nevent`:{let e=Pa(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nevent`);if(e[0][0].length!==32)throw Error(`TLV 0 should be 32 bytes`);if(e[2]&&e[2][0].length!==32)throw Error(`TLV 2 should be 32 bytes`);if(e[3]&&e[3][0].length!==4)throw Error(`TLV 3 should be 4 bytes`);return{type:`nevent`,data:{id:dt(e[0][0]),relays:e[1]?e[1].map((e=>gr.decode(e))):[],author:e[2]?.[0]?dt(e[2][0]):void 0,kind:e[3]?.[0]?parseInt(dt(e[3][0]),16):void 0}}}case`naddr`:{let e=Pa(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for naddr`);if(!e[2]?.[0])throw Error(`missing TLV 2 for naddr`);if(e[2][0].length!==32)throw Error(`TLV 2 should be 32 bytes`);if(!e[3]?.[0])throw Error(`missing TLV 3 for naddr`);if(e[3][0].length!==4)throw Error(`TLV 3 should be 4 bytes`);return{type:`naddr`,data:{identifier:gr.decode(e[0][0]),pubkey:dt(e[2][0]),kind:parseInt(dt(e[3][0]),16),relays:e[1]?e[1].map((e=>gr.decode(e))):[]}}}case`nsec`:return{type:t,data:r};case`npub`:case`note`:return{type:t,data:dt(r)};default:throw Error(`unknown prefix ${t}`)}}function Pa(e){let t={},n=e;for(;n.length>0;){let e=n[0],r=n[1],i=n.slice(2,2+r);if(n=n.slice(2+r),i.length<r)throw Error(`not enough data to read on TLV ${e}`);t[e]=t[e]||[],t[e].push(i)}return t}function Fa(e){return za(`nsec`,e)}function Ia(e){return za(`npub`,ft(e))}function La(e){return za(`note`,ft(e))}function Ra(e,t){let n=Yt.toWords(t);return Yt.encode(e,n,ja)}function za(e,t){return Ra(e,t)}function Ba(e){return Ra(`nprofile`,Ua({0:[ft(e.pubkey)],1:(e.relays||[]).map((e=>_r.encode(e)))}))}function Va(e){let t;return e.kind!==void 0&&(t=function(e){let t=new Uint8Array(4);return t[0]=e>>24&255,t[1]=e>>16&255,t[2]=e>>8&255,t[3]=255&e,t}(e.kind)),Ra(`nevent`,Ua({0:[ft(e.id)],1:(e.relays||[]).map((e=>_r.encode(e))),2:e.author?[ft(e.author)]:[],3:t?[new Uint8Array(t)]:[]}))}function Ha(e){let t=new ArrayBuffer(4);return new DataView(t).setUint32(0,e.kind,!1),Ra(`naddr`,Ua({0:[_r.encode(e.identifier)],1:(e.relays||[]).map((e=>_r.encode(e))),2:[ft(e.pubkey)],3:[new Uint8Array(t)]}))}function Ua(e){let t=[];return Object.entries(e).reverse().forEach((([e,n])=>{n.forEach((n=>{let r=new Uint8Array(n.length+2);r.set([parseInt(e)],0),r.set([n.length],1),r.set(n,2),t.push(r)}))})),mt(...t)}var Wa=/\bnostr:((note|npub|naddr|nevent|nprofile)1\w+)\b|#\[(\d+)\]/g;function Ga(e){let t=[];for(let n of e.content.matchAll(Wa))if(n[2])try{let{type:e,data:r}=Na(n[1]);switch(e){case`npub`:t.push({text:n[0],profile:{pubkey:r,relays:[]}});break;case`nprofile`:t.push({text:n[0],profile:r});break;case`note`:t.push({text:n[0],event:{id:r,relays:[]}});break;case`nevent`:t.push({text:n[0],event:r});break;case`naddr`:t.push({text:n[0],address:r})}}catch{}else if(n[3]){let r=parseInt(n[3],10),i=e.tags[r];if(!i)continue;switch(i[0]){case`p`:t.push({text:n[0],profile:{pubkey:i[1],relays:i[2]?[i[2]]:[]}});break;case`e`:t.push({text:n[0],event:{id:i[1],relays:i[2]?[i[2]]:[]}});break;case`a`:try{let[e,r,a]=i[1].split(`:`);t.push({text:n[0],address:{identifier:a,pubkey:r,kind:parseInt(e,10),relays:i[2]?[i[2]]:[]}})}catch{}}}return t}var Ka={};async function qa(e,t,n){let r=e instanceof Uint8Array?dt(e):e,i=Ya(Ue.getSharedSecret(r,`02`+t)),a=Uint8Array.from(_t(16)),o=_r.encode(n),s=Vn(i,a).encrypt(o);return`${Ht.encode(new Uint8Array(s))}?iv=${Ht.encode(new Uint8Array(a.buffer))}`}async function Ja(e,t,n){let r=e instanceof Uint8Array?dt(e):e,[i,a]=n.split(`?iv=`),o=Ya(Ue.getSharedSecret(r,`02`+t)),s=Ht.decode(a),c=Ht.decode(i),l=Vn(o,s).decrypt(c);return gr.decode(l)}function Ya(e){return e.slice(1,33)}ur(Ka,{decrypt:()=>Ja,encrypt:()=>qa});var Xa={};ur(Xa,{NIP05_REGEX:()=>Qa,isNip05:()=>$a,isValid:()=>ro,queryProfile:()=>no,searchDomain:()=>to,useFetchImplementation:()=>eo});var Za,Qa=/^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/,$a=e=>Qa.test(e||``);try{Za=fetch}catch{}function eo(e){Za=e}async function to(e,t=``){try{let n=`https://${e}/.well-known/nostr.json?name=${t}`,r=await Za(n,{redirect:`manual`});if(r.status!==200)throw Error(`Wrong response code`);return(await r.json()).names}catch{return{}}}async function no(e){let t=e.match(Qa);if(!t)return null;let[,n=`_`,r]=t;try{let e=`https://${r}/.well-known/nostr.json?name=${n}`,t=await Za(e,{redirect:`manual`});if(t.status!==200)throw Error(`Wrong response code`);let i=await t.json(),a=i.names[n];return a?{pubkey:a,relays:i.relays?.[a]}:null}catch{return null}}async function ro(e,t){let n=await no(t);return!!n&&n.pubkey===e}var io={};function ao(e){let t={reply:void 0,root:void 0,mentions:[],profiles:[],quotes:[]},n,r;for(let i=e.tags.length-1;i>=0;i--){let a=e.tags[i];if(a[0]===`e`&&a[1]){let[e,i,o,s,c]=a,l={id:i,relays:o?[o]:[],author:c};if(s===`root`){t.root=l;continue}if(s===`reply`){t.reply=l;continue}if(s===`mention`){t.mentions.push(l);continue}n?r=l:n=l,t.mentions.push(l)}else{if(a[0]===`q`&&a[1]){let[e,n,r]=a;t.quotes.push({id:n,relays:r?[r]:[]})}a[0]===`p`&&a[1]&&t.profiles.push({pubkey:a[1],relays:a[2]?[a[2]]:[]})}}return t.root||=r||n||t.reply,t.reply||=n||t.root,[t.reply,t.root].forEach((e=>{if(!e)return;let n=t.mentions.indexOf(e);if(n!==-1&&t.mentions.splice(n,1),e.author){let n=t.profiles.find((t=>t.pubkey===e.author));n&&n.relays&&(e.relays||=[],n.relays.forEach((t=>{e.relays?.indexOf(t)===-1&&e.relays.push(t)})),n.relays=e.relays)}})),t.mentions.forEach((e=>{if(e.author){let n=t.profiles.find((t=>t.pubkey===e.author));n&&n.relays&&(e.relays||=[],n.relays.forEach((t=>{e.relays.indexOf(t)===-1&&e.relays.push(t)})),n.relays=e.relays)}})),t}ur(io,{parse:()=>ao});var oo={};ur(oo,{fetchRelayInformation:()=>co,useFetchImplementation:()=>so});function so(e){}async function co(e){return await(await fetch(e.replace(`ws://`,`http://`).replace(`wss://`,`https://`),{headers:{Accept:`application/nostr+json`}})).json()}var lo={};function uo(e){let t=0;for(let n=0;n<64;n+=8){let r=parseInt(e.substring(n,n+8),16);if(r!==0){t+=Math.clz32(r);break}t+=32}return t}function fo(e,t){let n=0,r=e,i=[`nonce`,n.toString(),t.toString()];for(r.tags.push(i);;){let e=Math.floor(new Date().getTime()/1e3);if(e!==r.created_at&&(n=0,r.created_at=e),i[1]=(++n).toString(),r.id=po(r),uo(r.id)>=t)break}return r}function po(e){return dt(Ot(_r.encode(JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content]))))}ur(lo,{fastEventHash:()=>po,getPow:()=>uo,minePow:()=>fo});var mo={};function ho(e,t,n,r){return kr({kind:Wr,tags:[...e.tags??[],[`e`,t.id,n],[`p`,t.pubkey]],content:e.content===``?``:JSON.stringify(t),created_at:e.created_at},r)}function go(e){if(e.kind!==Wr)return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){let i=e.tags[r];i.length>=2&&(i[0]===`e`&&t===void 0?t=i:i[0]===`p`&&n===void 0&&(n=i))}return t===void 0?void 0:{id:t[1],relays:[t[2],n?.[2]].filter((e=>typeof e==`string`)),author:n?.[1]}}function _o(e,{skipVerification:t}={}){let n=go(e);if(n===void 0||e.content===``)return;let r;try{r=JSON.parse(e.content)}catch{return}return r.id===n.id&&(t||Ar(r))?r:void 0}ur(mo,{finishRepostEvent:()=>ho,getRepostedEvent:()=>_o,getRepostedEventPointer:()=>go});var vo={};ur(vo,{NOSTR_URI_REGEX:()=>yo,parse:()=>xo,test:()=>bo});var yo=RegExp(`nostr:(${Ma.source})`);function bo(e){return typeof e==`string`&&RegExp(`^${yo.source}$`).test(e)}function xo(e){let t=e.match(RegExp(`^${yo.source}$`));if(!t)throw Error(`Invalid Nostr URI: ${e}`);return{uri:t[0],value:t[1],decoded:Na(t[1])}}var So={};function Co(e,t,n){let r=t.tags.filter((e=>e.length>=2&&(e[0]===`e`||e[0]===`p`)));return kr({...e,kind:Gr,tags:[...e.tags??[],...r,[`e`,t.id],[`p`,t.pubkey]],content:e.content??`+`},n)}function wo(e){if(e.kind!==Gr)return;let t,n;for(let r=e.tags.length-1;r>=0&&(t===void 0||n===void 0);r--){let i=e.tags[r];i.length>=2&&(i[0]===`e`&&t===void 0?t=i:i[0]===`p`&&n===void 0&&(n=i))}return t!==void 0&&n!==void 0?{id:t[1],relays:[t[2],n[2]].filter((e=>e!==void 0)),author:n[1]}:void 0}ur(So,{finishReactionEvent:()=>Co,getReactedEventPointer:()=>wo});var To={};ur(To,{matchAll:()=>Do,regex:()=>Eo,replaceAll:()=>Oo});var Eo=()=>RegExp(`\\b${yo.source}\\b`,`g`);function*Do(e){let t=e.matchAll(Eo());for(let e of t)try{let[t,n]=e;yield{uri:t,value:n,decoded:Na(n),start:e.index,end:e.index+t.length}}catch{}}function Oo(e,t){return e.replaceAll(Eo(),((e,n)=>t({uri:e,value:n,decoded:Na(n)})))}var ko={};ur(ko,{channelCreateEvent:()=>Ao,channelHideMessageEvent:()=>No,channelMessageEvent:()=>Mo,channelMetadataEvent:()=>jo,channelMuteUserEvent:()=>Po});var Ao=(e,t)=>{let n;if(typeof e.content==`object`)n=JSON.stringify(e.content);else{if(typeof e.content!=`string`)return;n=e.content}return kr({kind:Xr,tags:[...e.tags??[]],content:n,created_at:e.created_at},t)},jo=(e,t)=>{let n;if(typeof e.content==`object`)n=JSON.stringify(e.content);else{if(typeof e.content!=`string`)return;n=e.content}return kr({kind:Zr,tags:[[`e`,e.channel_create_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},Mo=(e,t)=>{let n=[[`e`,e.channel_create_event_id,e.relay_url,`root`]];return e.reply_to_channel_message_event_id&&n.push([`e`,e.reply_to_channel_message_event_id,e.relay_url,`reply`]),kr({kind:Qr,tags:[...n,...e.tags??[]],content:e.content,created_at:e.created_at},t)},No=(e,t)=>{let n;if(typeof e.content==`object`)n=JSON.stringify(e.content);else{if(typeof e.content!=`string`)return;n=e.content}return kr({kind:$r,tags:[[`e`,e.channel_message_event_id],...e.tags??[]],content:n,created_at:e.created_at},t)},Po=(e,t)=>{let n;if(typeof e.content==`object`)n=JSON.stringify(e.content);else{if(typeof e.content!=`string`)return;n=e.content}return kr({kind:ei,tags:[[`p`,e.pubkey_to_mute],...e.tags??[]],content:n,created_at:e.created_at},t)},Fo={};ur(Fo,{EMOJI_SHORTCODE_REGEX:()=>Io,matchAll:()=>Ro,regex:()=>Lo,replaceAll:()=>zo});var Io=/:(\w+):/,Lo=()=>RegExp(`\\B${Io.source}\\B`,`g`);function*Ro(e){let t=e.matchAll(Lo());for(let e of t)try{let[t,n]=e;yield{shortcode:t,name:n,start:e.index,end:e.index+t.length}}catch{}}function zo(e,t){return e.replaceAll(Lo(),((e,n)=>t({shortcode:e,name:n})))}var Bo,Vo={};ur(Vo,{useFetchImplementation:()=>Ho,validateGithub:()=>Uo});try{Bo=fetch}catch{}function Ho(e){Bo=e}async function Uo(e,t,n){try{return await(await Bo(`https://gist.github.com/${t}/${n}/raw`)).text()===`Verifying that I control the following Nostr public key: ${e}`}catch{return!1}}var Wo={};ur(Wo,{decrypt:()=>$o,encrypt:()=>Qo,getConversationKey:()=>qo,v2:()=>es});var Go=1,Ko=65535;function qo(e,t){return ar(Ot,Ue.getSharedSecret(e,`02`+t).subarray(1,33),`nip44-v2`)}function Jo(e,t){let n=cr(Ot,e,t,76);return{chacha_key:n.subarray(0,32),chacha_nonce:n.subarray(32,44),hmac_key:n.subarray(44,76)}}function Yo(e){if(!Number.isSafeInteger(e)||e<1)throw Error(`expected positive integer`);if(e<=32)return 32;let t=1<<Math.floor(Math.log2(e-1))+1,n=t<=256?32:t/8;return n*(Math.floor((e-1)/n)+1)}function Xo(e){let t=_r.encode(e),n=t.length;return mt(function(e){if(!Number.isSafeInteger(e)||e<Go||e>Ko)throw Error(`invalid plaintext size: must be between 1 and 65535 bytes`);let t=new Uint8Array(2);return new DataView(t.buffer).setUint16(0,e,!1),t}(n),t,new Uint8Array(Yo(n)-n))}function Zo(e,t,n){if(n.length!==32)throw Error(`AAD associated data must be 32 bytes`);return ir(Ot,e,mt(n,t))}function Qo(e,t,n=_t(32)){let{chacha_key:r,chacha_nonce:i,hmac_key:a}=Jo(t,n),o=nr(r,i,Xo(e)),s=Zo(a,o,n);return Ht.encode(mt(new Uint8Array([2]),n,o,s))}function $o(e,t){let{nonce:n,ciphertext:r,mac:i}=function(e){if(typeof e!=`string`)throw Error(`payload must be a valid string`);let t=e.length;if(t<132||t>87472)throw Error(`invalid payload length: `+t);if(e[0]===`#`)throw Error(`unknown encryption version`);let n;try{n=Ht.decode(e)}catch(e){throw Error(`invalid base64: `+e.message)}let r=n.length;if(r<99||r>65603)throw Error(`invalid data length: `+r);let i=n[0];if(i!==2)throw Error(`unknown encryption version `+i);return{nonce:n.subarray(1,33),ciphertext:n.subarray(33,-32),mac:n.subarray(-32)}}(e),{chacha_key:a,chacha_nonce:o,hmac_key:s}=Jo(t,n);if(!an(Zo(s,r,n),i))throw Error(`invalid MAC`);return function(e){let t=new DataView(e.buffer).getUint16(0),n=e.subarray(2,2+t);if(t<Go||t>Ko||n.length!==t||e.length!==2+Yo(t))throw Error(`invalid padding`);return gr.decode(n)}(nr(a,o,r))}var es={utils:{getConversationKey:qo,calcPaddedLen:Yo},encrypt:Qo,decrypt:$o},ts={};function ns(e){let{pathname:t,searchParams:n}=new URL(e),r=t,i=n.get(`relay`),a=n.get(`secret`);if(!r||!i||!a)throw Error(`invalid connection string`);return{pubkey:r,relay:i,secret:a}}async function rs(e,t,n){let r=await qa(t,e,JSON.stringify({method:`pay_invoice`,params:{invoice:n}}));return kr({kind:Mi,created_at:Math.round(Date.now()/1e3),content:r,tags:[[`p`,e]]},t)}ur(ts,{makeNwcRequestEvent:()=>rs,parseConnectionString:()=>ns});var is,as={};ur(as,{getZapEndpoint:()=>ss,makeZapReceipt:()=>us,makeZapRequest:()=>cs,useFetchImplementation:()=>os,validateZapRequest:()=>ls});try{is=fetch}catch{}function os(e){is=e}async function ss(e){try{let t=``,{lud06:n,lud16:r}=JSON.parse(e.content);if(n){let{words:e}=Yt.decode(n,1e3),r=Yt.fromWords(e);t=gr.decode(r)}else{if(!r)return null;{let[e,n]=r.split(`@`);t=new URL(`/.well-known/lnurlp/${e}`,`https://${n}`).toString()}}let i=await(await is(t)).json();if(i.allowsNostr&&i.nostrPubkey)return i.callback}catch{}return null}function cs({profile:e,event:t,amount:n,relays:r,comment:i=``}){if(!n)throw Error(`amount not given`);if(!e)throw Error(`profile not given`);let a={kind:9734,created_at:Math.round(Date.now()/1e3),content:i,tags:[[`p`,e],[`amount`,n.toString()],[`relays`,...r]]};return t&&a.tags.push([`e`,t]),a}function ls(e){let t;try{t=JSON.parse(e)}catch{return`Invalid zap request JSON.`}if(!pr(t))return`Zap request is not a valid Nostr event.`;if(!Ar(t))return`Invalid signature on zap request.`;let n=t.tags.find((([e,t])=>e===`p`&&t));if(!n)return`Zap request doesn't have a 'p' tag.`;if(!n[1].match(/^[a-f0-9]{64}$/))return`Zap request 'p' tag is not valid hex.`;let r=t.tags.find((([e,t])=>e===`e`&&t));return r&&!r[1].match(/^[a-f0-9]{64}$/)?`Zap request 'e' tag is not valid hex.`:t.tags.find((([e,t])=>e===`relays`&&t))?null:`Zap request doesn't have a 'relays' tag.`}function us({zapRequest:e,preimage:t,bolt11:n,paidAt:r}){let i=JSON.parse(e),a=i.tags.filter((([e])=>e===`e`||e===`p`||e===`a`)),o={kind:9735,created_at:Math.round(r.getTime()/1e3),content:``,tags:[...a,[`P`,i.pubkey],[`bolt11`,n],[`description`,e]]};return t&&o.tags.push([`preimage`,t]),o}var ds={};ur(ds,{createRumor:()=>_s,createSeal:()=>vs,createWrap:()=>ys,unwrapEvent:()=>Ss,unwrapManyEvents:()=>Cs,wrapEvent:()=>bs,wrapManyEvents:()=>xs});var fs=()=>Math.round(Date.now()/1e3),ps=()=>Math.round(fs()-172800*Math.random()),ms=(e,t)=>qo(e,t),hs=(e,t,n)=>Qo(JSON.stringify(e),ms(t,n)),gs=(e,t)=>JSON.parse($o(e.content,ms(t,e.pubkey)));function _s(e,t){let n={created_at:fs(),content:``,tags:[],...e,pubkey:Or(t)};return n.id=Tr(n),n}function vs(e,t,n){return kr({kind:qr,content:hs(e,t,n),created_at:ps(),tags:[]},t)}function ys(e,t){let n=Dr();return kr({kind:ni,content:hs(e,n,t),created_at:ps(),tags:[[`p`,t]]},n)}function bs(e,t,n){return ys(vs(_s(e,t),t,n),n)}function xs(e,t,n){if(!n||n.length===0)throw Error(`At least one recipient is required.`);let r=[bs(e,t,Or(t))];return n.forEach((n=>{r.push(bs(e,t,n))})),r}function Ss(e,t){return gs(gs(e,t),t)}function Cs(e,t){let n=[];return e.forEach((e=>{n.push(Ss(e,t))})),n.sort(((e,t)=>e.created_at-t.created_at)),n}var ws={};ur(ws,{getToken:()=>Es,hashPayload:()=>Ns,unpackEventFromToken:()=>Os,validateEvent:()=>Fs,validateEventKind:()=>As,validateEventMethodTag:()=>Ms,validateEventPayloadTag:()=>Ps,validateEventTimestamp:()=>ks,validateEventUrlTag:()=>js,validateToken:()=>Ds});var Ts=`Nostr `;async function Es(e,t,n,r=!1,i){let a={kind:Fi,tags:[[`u`,e],[`method`,t]],created_at:Math.round(new Date().getTime()/1e3),content:``};i&&a.tags.push([`payload`,Ns(i)]);let o=await n(a);return(r?Ts:``)+Ht.encode(_r.encode(JSON.stringify(o)))}async function Ds(e,t,n){return await Fs(await Os(e).catch((e=>{throw e})),t,n).catch((e=>{throw e}))}async function Os(e){if(!e)throw Error(`Missing token`);e=e.replace(Ts,``);let t=gr.decode(Ht.decode(e));if(!t||t.length===0||!t.startsWith(`{`))throw Error(`Invalid token`);return JSON.parse(t)}function ks(e){return!!e.created_at&&Math.round(new Date().getTime()/1e3)-e.created_at<60}function As(e){return e.kind===Fi}function js(e,t){let n=e.tags.find((e=>e[0]===`u`));return!!n&&n.length>0&&n[1]===t}function Ms(e,t){let n=e.tags.find((e=>e[0]===`method`));return!!n&&n.length>0&&n[1].toLowerCase()===t.toLowerCase()}function Ns(e){return dt(Ot(_r.encode(JSON.stringify(e))))}function Ps(e,t){let n=e.tags.find((e=>e[0]===`payload`));if(!n)return!1;let r=Ns(t);return n.length>0&&n[1]===r}async function Fs(e,t,n,r){if(!Ar(e))throw Error(`Invalid nostr event, signature invalid`);if(!As(e))throw Error(`Invalid nostr event, kind invalid`);if(!ks(e))throw Error(`Invalid nostr event, created_at timestamp invalid`);if(!js(e,t))throw Error(`Invalid nostr event, url tag invalid`);if(!Ms(e,n))throw Error(`Invalid nostr event, method tag invalid`);if(r&&typeof r==`object`&&Object.keys(r).length>0&&!Ps(e,r))throw Error(`Invalid nostr event, payload tag does not match request body hash`);return!0}var U={LIBRARIES:{decodeBolt11:o.decode,NostrTools:a},DEFAULT_OPTIONS:{theme:`light`,colorMode:!0},BATCH_SIZE:5,REQ_CONFIG:{INITIAL_LOAD_COUNT:15,ADDITIONAL_LOAD_COUNT:20},LOAD_TIMEOUT:1e4,BUFFER_INTERVAL:500,BUFFER_MIN_INTERVAL:100,INFINITE_SCROLL:{ROOT_MARGIN:`400px`,THRESHOLD:.1,DEBOUNCE_TIME:500,RETRY_DELAY:500},ZAP_CONFIG:{DEFAULT_LIMIT:1,DEFAULT_COLOR_MODE:!0,ERRORS:{DIALOG_NOT_FOUND:`Zap dialog not found`,BUTTON_NOT_FOUND:`Fetch button not found`,DECODE_FAILED:`Failed to decode identifier`}},ZAP_AMOUNT_CONFIG:{DEFAULT_COLOR_MODE:!0,THRESHOLDS:[{value:1e4,className:`zap-amount-10k`},{value:5e3,className:`zap-amount-5k`},{value:2e3,className:`zap-amount-2k`},{value:1e3,className:`zap-amount-1k`},{value:500,className:`zap-amount-500`},{value:200,className:`zap-amount-200`},{value:100,className:`zap-amount-100`}],DEFAULT_CLASS:`default-color`,DISABLED_CLASS:``},DIALOG_CONFIG:{DEFAULT_TITLE:`To `,NO_ZAPS_MESSAGE:`No Zaps yet!<br>Send the first Zap!`,DEFAULT_NO_ZAPS_DELAY:1500,ZAP_LIST:{INITIAL_BATCH:30,REMAINING_BATCH:30,PROFILE_BATCH:30,MIN_HEIGHT:`100px`}},REQUEST_CONFIG:{METADATA_TIMEOUT:2e4,REQUEST_TIMEOUT:2e3,CACHE_DURATION:3e5},PROFILE_CONFIG:{BATCH_SIZE:20,BATCH_DELAY:100,RELAYS:[`wss://relay.nostr.band`,`wss://purplepag.es`,`wss://relay.damus.io`,`wss://nostr.wine`,`wss://directory.yabu.me`]},BATCH_CONFIG:{REFERENCE_PROCESSOR:{BATCH_SIZE:20,BATCH_DELAY:100},SUPPORTED_EVENT_KINDS:[1,30023,30030,30009,40,42,31990]},BATCH_PROCESSOR_CONFIG:{DEFAULT_BATCH_SIZE:20,DEFAULT_BATCH_DELAY:100,DEFAULT_MAX_CACHE_AGE:18e5,DEFAULT_RELAY_URLS:[],TIMEOUT_DURATION:500}},Is=class e{constructor(e,t,n=null){this.identifier=e,this.relayUrls=t,this.isColorModeEnabled=n===null?U.ZAP_CONFIG.DEFAULT_COLOR_MODE:String(n).toLowerCase()===`true`}static determineColorMode(e){if(!e||!e.hasAttribute(`data-zap-color-mode`))return U.ZAP_CONFIG.DEFAULT_COLOR_MODE;let t=e.getAttribute(`data-zap-color-mode`);return t.toLowerCase()!==`true`&&t.toLowerCase()!==`false`||t.toLowerCase()===`true`}static fromButton(t){if(!t)throw Error(U.ZAP_CONFIG.ERRORS.BUTTON_NOT_FOUND);let n=e.determineColorMode(t);return new e(t.getAttribute(`data-nzv-id`),t.getAttribute(`data-relay-urls`).split(`,`),n)}},Ls=class{constructor(e=1e3){this.cache=new Map,this.maxSize=e,this.accessOrder=new Map}set(e,t){if(this.cache.size>=this.maxSize&&!this.cache.has(e)){let e=this.accessOrder.keys().next().value;this.cache.delete(e),this.accessOrder.delete(e)}return this.cache.set(e,t),this.accessOrder.delete(e),this.accessOrder.set(e,Date.now()),t}get(e){if(!this.cache.has(e))return;let t=this.cache.get(e);return this.accessOrder.set(e,Date.now()),t}has(e){return this.cache.has(e)}delete(e){this.cache.delete(e)}clear(){this.cache.clear()}},Rs=class extends Ls{#e=new Map;setProfile(e,t){if(!e||!t)return;let n=this.get(e);n&&n._eventCreatedAt&&t._eventCreatedAt&&!(t._eventCreatedAt>n._eventCreatedAt)||(this.set(e,t),this.#t(e,t))}#t(e,t){this.#e.forEach((n=>{try{n(e,t)}catch{}}))}subscribe(e){if(typeof e!=`function`)return null;let t=Math.random().toString(36).substr(2,9);return this.#e.set(t,e),()=>this.#e.delete(t)}clearSubscriptions(){this.#e.clear()}},zs=class extends Ls{#e=new Map;initializeView(e){this.#e.set(e,{isInitialFetchComplete:!1,lastEventTime:null,isLoading:!1,batchProcessing:!1})}getViewState(e){return this.#e.get(e)||this.initializeView(e)}updateViewState(e,t){let n=this.getViewState(e);return this.#e.set(e,{...n,...t}),this.#e.get(e)}getEvents(e){return this.get(e)||[]}setEvents(e,t,n=!1){let r=n?this.getEvents(e):[],i=new Map(t.map((e=>[e.id,e]))),a=[...r.filter((e=>!i.has(e.id))),...t];this.set(e,a)}addEvent(e,t){if(!t?.id)return!1;let n=this.getEvents(e);return!this.#t(n,t)&&(n.push(t),n.sort(((e,t)=>t.created_at-e.created_at)),this.setEvents(e,n,!0),!0)}#t(e,t){return e.some((e=>e.id===t.id||e.kind===t.kind&&e.pubkey===t.pubkey&&e.content===t.content&&e.created_at===t.created_at))}},Bs=class extends Ls{#e=new Map;#t=new Map;async getOrFetch(e,t){let n=this.get(e);if(n)return n;let r=this.#e.get(e);if(r)return r;let i=t().then((t=>(t&&this.set(e,t),this.#e.delete(e),t))).catch((t=>(this.#e.delete(e),null)));return this.#e.set(e,i),i}clearPendingFetches(){this.#e.clear()}setComponent(e,t){this.#t.set(e,t)}getComponent(e){return this.#t.get(e)}clearComponents(){this.#t.clear()}clear(){super.clear(),this.clearPendingFetches(),this.clearComponents()}},Vs=class extends Ls{#e=new Map;#t=new Map;setCached(e,t,n){let r=`${e}:${t}`;this.set(r,{stats:n,timestamp:Date.now()}),this.updateViewStats(e,n)}getCached(e,t){let n=`${e}:${t}`;return this.get(n)}updateViewStats(e,t){t&&this.#e.set(e,{...t,lastUpdate:Date.now()})}getViewStats(e){return this.#e.get(e)}clearViewStats(e){this.#e.delete(e)}setNoZapsState(e,t){this.#t.set(e,t)}hasNoZaps(e){return this.#t.get(e)||!1}clearNoZapsState(e){this.#t.delete(e)}clear(){super.clear(),this.#e.clear(),this.#t.clear()}},Hs=class extends Ls{hasDecoded(e){return this.has(e)}setDecoded(e,t){this.set(e,t)}getDecoded(e){return this.get(e)}},Us=class extends Ls{initializeLoadState(e){let t={isInitialFetchComplete:!1,lastEventTime:null,isLoading:!1,currentCount:0};return this.set(e,t),t}getLoadState(e){return this.has(e)?this.get(e):this.initializeLoadState(e)}updateLoadState(e,t){let n={...this.getLoadState(e),...t};return this.set(e,n),n}canLoadMore(e){let t=this.getLoadState(e);return t&&!t.isLoading&&t.lastEventTime}updateLoadProgress(e,t){let n=this.getLoadState(e);return n.currentCount+=t,this.updateLoadState(e,{currentCount:n.currentCount}),n.currentCount}},Ws=class extends Ls{setZapInfo(e,t){this.set(e,t)}getZapInfo(e){return this.get(e)}clearZapInfo(e){this.delete(e)}},Gs=class extends Rs{setImage(e,t){e&&t&&this.set(e,{image:t,timestamp:Date.now()})}getImage(e){return this.get(e)?.image}hasImage(e){return this.has(e)}clearExpired(e=36e5){let t=Date.now();for(let[n,r]of this.cache.entries())t-r.timestamp>e&&this.delete(n)}},Ks=class extends Rs{#e=new Map;setNip05(e,t){e&&this.set(e,{value:t,timestamp:Date.now(),verified:!0})}getNip05(e){return this.get(e)?.value}setPendingVerification(e,t){this.#e.set(e,t)}getPendingVerification(e){return this.#e.get(e)}deletePendingVerification(e){this.#e.delete(e)}clearPendingVerifications(){this.#e.clear()}clear(){super.clear(),this.clearPendingVerifications()}},W=new class e{static#e=null;#t=null;#n={};constructor(){if(e.#e)return e.#e;this.profileCache=new Rs,this.zapEventCache=new zs,this.referenceCache=new Bs,this.statsCache=new Vs,this.decodedCache=new Hs,this.loadStateCache=new Us,this.zapInfoCache=new Ws,this.imageCache=new Gs,this.nip05Cache=new Ks,this.nip05PendingCache=new Ls,this.#n=[`zapInfo`,`uiComponent`,`decoded`,`nip05`,`nip05PendingFetches`,`zapLoadStates`,`imageCache`,`isEventIdentifier`].reduce(((e,t)=>(e[t]=new Ls,e)),{}),this.viewStats=new Map,this.viewStates=new Map,e.#e=this}setProfile(e,t){return this.profileCache.setProfile(e,t)}getProfile(e){return this.profileCache.get(e)}subscribeToProfileUpdates(e){return this.profileCache.subscribe(e)}initializeZapView(e){return this.zapEventCache.initializeView(e)}getZapEvents(e){return this.zapEventCache.getEvents(e)}setZapEvents(e,t,n){return this.zapEventCache.setEvents(e,t,n)}addZapEvent(e,t){return this.zapEventCache.addEvent(e,t)}getZapViewState(e){return this.zapEventCache.getViewState(e)}updateZapViewState(e,t){return this.zapEventCache.updateViewState(e,t)}setReference(e,t){return this.referenceCache.set(e,t)}getReference(e){return this.referenceCache.get(e)}getOrFetchReference(e,t){return this.referenceCache.getOrFetch(e,t)}getReferenceComponent(e){return this.referenceCache.getComponent(e)}setReferenceComponent(e,t){return this.referenceCache.setComponent(e,t)}getCachedStats(e,t){return this.statsCache.getCached(e,t)}updateStatsCache(e,t,n){this.statsCache.setCached(e,t,n),this.statsCache.updateViewStats(e,n)}getViewStats(e){return this.statsCache.getViewStats(e)}setNoZapsState(e,t){return this.statsCache.setNoZapsState(e,t)}hasNoZaps(e){return this.statsCache.hasNoZaps(e)}async processCachedData(e,t){this.setRelayUrls(t.relayUrls);let n=this.getZapEvents(e),r=n.some((e=>this.getReference(e.id)));return{stats:(await Promise.all([this.getCachedStats(e,t.identifier)]))[0],hasEnoughCachedEvents:n.length>=U.REQ_CONFIG.INITIAL_LOAD_COUNT,hasReferences:r}}hasDecoded(e){return this.decodedCache.hasDecoded(e)}setDecoded(e,t){return this.decodedCache.setDecoded(e,t)}getDecoded(e){return this.decodedCache.getDecoded(e)}initializeLoadState(e){return this.loadStateCache.initializeLoadState(e)}getLoadState(e){return this.loadStateCache.getLoadState(e)}updateLoadState(e,t){return this.loadStateCache.updateLoadState(e,t)}canLoadMore(e){return this.loadStateCache.canLoadMore(e)}updateLoadProgress(e,t){return this.loadStateCache.updateLoadProgress(e,t)}setZapInfo(e,t){return this.zapInfoCache.setZapInfo(e,t)}getZapInfo(e){return this.zapInfoCache.getZapInfo(e)}clearZapInfo(e){return this.zapInfoCache.clearZapInfo(e)}setImageCache(e,t){return this.imageCache.setImage(e,t)}getImageCache(e){return this.imageCache.getImage(e)}hasImageCache(e){return this.imageCache.hasImage(e)}setNip05(e,t){return this.nip05Cache.setNip05(e,t)}getNip05(e){return this.nip05Cache.getNip05(e)}setNip05PendingFetch(e,t){this.nip05Cache.setPendingVerification(e,t)}getNip05PendingFetch(e){return this.nip05Cache.getPendingVerification(e)}deleteNip05PendingFetch(e){this.nip05Cache.deletePendingVerification(e)}getOrCreateViewState(e,t={}){return this.viewStates.has(e)||this.viewStates.set(e,{currentStats:null,...t}),this.viewStates.get(e)}getViewState(e){return this.getOrCreateViewState(e)}updateViewState(e,t){let n=this.getOrCreateViewState(e);return this.viewStates.set(e,{...n,...t}),this.viewStates.get(e)}setCacheItem(e,t,n){let r=this.#n[e];return r&&t!==void 0?r.set(t,n):null}getCacheItem(e,t){let n=this.#n[e];return n&&t!==void 0?n.get(t):null}setRelayUrls(e){this.#t=e}getRelayUrls(){return this.#t}clearAll(){this.profileCache.clear(),this.profileCache.clearSubscriptions(),this.zapEventCache.clear(),this.referenceCache.clear(),this.referenceCache.clearPendingFetches(),this.referenceCache.clearComponents(),this.statsCache.clear(),this.decodedCache.clear(),this.loadStateCache.clear(),this.zapInfoCache.clear(),this.imageCache.clear(),this.nip05Cache.clear(),this.nip05Cache.clearPendingVerifications(),Object.values(this.#n).forEach((e=>e.clear())),this.viewStats.clear(),this.viewStates.clear()}},qs=`data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMDYuMzMgMjA2LjMzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICA8ZGVmcz4KICAgICAgPHN0eWxlPgogICAgICAgICAuY2xzLTEgewogICAgICAgICAgICBmaWxsOiBub25lOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTIgewogICAgICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgICB9CgogICAgICAgICAuY2xzLTMgewogICAgICAgICAgICBmaWxsOiAjNjY2OwogICAgICAgICB9CiAgICAgIDwvc3R5bGU+CiAgIDwvZGVmcz4KICAgPHBhdGggY2xhc3M9ImNscy0yIgogICAgICBkPSJtMjA2LjMzIDEzNC4zOWMwIDIwLjcxIDAgMzEuMDctMy41MyA0Mi4yMi00LjQzIDEyLjE3LTE0LjAyIDIxLjc2LTI2LjE5IDI2LjE5LTExLjE1IDMuNTMtMjEuNSAzLjUzLTQyLjIyIDMuNTNoLTYyLjQ2Yy0yMC43MSAwLTMxLjA2IDAtNDIuMjEtMy41My0xMi4xNy00LjQzLTIxLjc2LTE0LjAyLTI2LjE5LTI2LjE5LTMuNTMtMTEuMTUtMy41My0yMS41LTMuNTMtNDIuMjJ2LTYyLjQ2YzAtMjAuNzEgMC0zMS4wNyAzLjUzLTQyLjIyIDQuNDMtMTIuMTcgMTQuMDItMjEuNzYgMjYuMTktMjYuMTkgMTEuMTUtMy41MiAyMS41LTMuNTIgNDIuMjEtMy41Mmg2Mi40NmMyMC43MSAwIDMxLjA3IDAgNDIuMjIgMy41MiAxMi4xNyA0LjQzIDIxLjc2IDE0LjAyIDI2LjE5IDI2LjE5IDMuNTMgMTEuMTUgMy41MyAyMS41IDMuNTMgNDIuMjJ6IiAvPgogICA8cGF0aCBjbGFzcz0iY2xzLTMiCiAgICAgIGQ9Im0xODUuOTggOTEuMXY4My4yM2MwIDMuMTMtMi41NCA1LjY3LTUuNjcgNS42N2gtNjguMDRjLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNS41YzAuMzEtMTkgMi4zMi0zNy4yIDYuNTQtNDUuNDggMi41My00Ljk4IDYuNy03LjY5IDExLjQ5LTkuMTQgOS4wNS0yLjcyIDI0LjkzLTAuODYgMzEuNjctMS4xOCAwIDAgMjAuMzYgMC44MSAyMC4zNi0xMC43MiAwLTkuMjgtOS4xLTguNTUtOS4xLTguNTUtMTAuMDMgMC4yNi0xNy42Ny0wLjQyLTIyLjYyLTIuMzctOC4yOS0zLjI2LTguNTctOS4yNC04LjYtMTEuMjQtMC40MS0yMy4xLTM0LjQ3LTI1Ljg3LTY0LjQ4LTIwLjE0LTMyLjgxIDYuMjQgMC4zNiA1My4yNyAwLjM2IDExNi4wNXY4LjM4Yy0wLjA2IDMuMDgtMi41NSA1LjU3LTUuNjUgNS41N2gtMzMuNjljLTMuMTMgMC01LjY3LTIuNTQtNS42Ny01LjY3di0xNDMuOTVjMC0zLjEzIDIuNTQtNS42NyA1LjY3LTUuNjdoMzEuNjdjMy4xMyAwIDUuNjcgMi41NCA1LjY3IDUuNjcgMCA0LjY1IDUuMjMgNy4yNCA5LjAxIDQuNTMgMTEuMzktOC4xNiAyNi4wMS0xMi41MSA0Mi4zNy0xMi41MSAzNi42NSAwIDY0LjM2IDIxLjM2IDY0LjM2IDY4LjY5em0tNjAuODQtMTYuODljMC02LjctNS40My0xMi4xMy0xMi4xMy0xMi4xM3MtMTIuMTMgNS40My0xMi4xMyAxMi4xMyA1LjQzIDEyLjEzIDEyLjEzIDEyLjEzIDEyLjEzLTUuNDMgMTIuMTMtMTIuMTN6IiAvPgo8L3N2Zz4=`,Js=e=>typeof e==`string`&&e.length>0,Ys=e=>{try{return window.NostrTools.nip19.decode(e)}catch{return null}},Xs=(e,t,n)=>{let r={npub:()=>({kinds:[9735],"#p":[t]}),note:()=>({kinds:[9735],"#e":[t]}),nprofile:()=>({kinds:[9735],"#p":[t.pubkey]}),nevent:()=>({kinds:[9735],"#e":[t.id]}),naddr:()=>({kinds:[9735],"#a":[`${t.kind}:${t.pubkey}:${t.identifier}`]})}[e];if(!r)return null;let i=r();return i.limit=n?U.REQ_CONFIG.ADDITIONAL_LOAD_COUNT:U.REQ_CONFIG.INITIAL_LOAD_COUNT,n&&(i.until=n),{req:i}};function Zs(e,t=null){let n=`${e}:${t}`;if(W.hasDecoded(n))return W.getDecoded(n);if(!Js(e))throw Error(U.ZAP_CONFIG.ERRORS.DECODE_FAILED);let r=Ys(e);if(!r)return null;let i=Xs(r.type,r.data,t);return i&&W.setDecoded(n,i),i}function Qs(e){return e?.display_name||e?.name||`nameless`}async function $s(e,t){if(!e||!t)return null;try{return(await window.NostrTools.nip05.queryProfile(e))?.pubkey===t?e:null}catch{return null}}function ec(e){return new Intl.NumberFormat().format(e)}function tc(e){if(!e||typeof e!=`string`)return`unknown`;try{return`${window.NostrTools.nip19.decode(e).type.toLowerCase()}1${e.slice(5,11)}...${e.slice(-4)}`}catch{return`unknown`}}function nc(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function rc(e){try{return window.NostrTools.nip19.npubEncode(e)}catch{return null}}function ic(e){if(!e||typeof e!=`string`)return!1;let t=`isEventIdentifier:${e}`,n=W.getCacheItem(`isEventIdentifier`,t);if(n!==void 0)return n;let r=e.startsWith(`note1`)||e.startsWith(`nevent1`)||e.startsWith(`naddr1`);return W.setCacheItem(`isEventIdentifier`,t,r),r}async function ac(e){let{pubkey:t,content:n}=function(e){let t=e.tags.find((e=>e[0]===`description`))?.[1];if(!t)return{pubkey:null,content:``};try{let e=sc(t),n;try{n=JSON.parse(e)}catch{let t=e.match(/"pubkey"\s*:\s*"([^"]+)"|"content"\s*:\s*"([^"]+)"/g);if(!t)throw Error(`Invalid JSON structure`);n={},t.forEach((e=>{let[t,r]=e.split(`:`).map((e=>e.trim().replace(/"/g,``)));n[t]=r}))}let r=null;return n.pubkey&&(r=typeof n.pubkey==`string`?n.pubkey:String(n.pubkey)),{pubkey:r,content:typeof n.content==`string`?n.content.trim():``}}catch{return{pubkey:null,content:``}}}(e);return{pubkey:t,content:n,satsText:await async function(e){let t=e.tags.find((e=>e[0].toLowerCase()===`bolt11`))?.[1];if(!t)return`Amount: Unknown`;try{let e=window.decodeBolt11(t).sections.find((e=>e.name===`amount`))?.value;return e?`${ec(Math.floor(e/1e3))} sats`:`Amount: Unknown`}catch{return`Amount: Unknown`}}(e)}}function oc(e){try{return window.NostrTools.nip19.decode(e)}catch{return null}}function sc(e){return e.replace(/[\u0000-\u001F\u007F-\u009F]/g,``).replace(/\\\\/g,`\\`).replace(/\\(?!(["\\\/bfnrt]|u[0-9a-fA-F]{4}))/g,``).replace(/\\+(["\\/bfnrt])/g,`\\$1`).replace(/\\u(?![0-9a-fA-F]{4})/g,``)}var cc=class{constructor(e){this.root=e}displayStats(e){requestAnimationFrame((()=>{let t=this.root?.querySelector(`.zap-stats`);if(t)try{let n;n=e?e.skeleton?this.#e():e.error?this.createTimeoutStats():this.createNormalStats(e):this.createTimeoutStats(),t.innerHTML=n}catch{t.innerHTML=this.createTimeoutStats()}}))}#e(){return`
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
    `}createNormalStats(e){return`\n      <div class="stats-item">Total Count</div>\n      <div class="stats-item"><span class="number">${ec(e.count)}</span></div>\n      <div class="stats-item">times</div>\n      <div class="stats-item">Total Amount</div>\n      <div class="stats-item"><span class="number">${ec(Math.floor(e.msats/1e3))}</span></div>\n      <div class="stats-item">sats</div>\n      <div class="stats-item">Max Amount</div>\n      <div class="stats-item"><span class="number">${ec(Math.floor(e.maxMsats/1e3))}</span></div>\n      <div class="stats-item">sats</div>\n    `}},lc=class{constructor(e={}){this._validateOptions(e),this._initializeProperties(e)}_validateOptions(e){if(!e.pool?.ensureRelay)throw Error(`Invalid pool object: ensureRelay method is required`)}_initializeProperties(e){this.pool=e.pool,this.batchSize=e.batchSize||U.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_SIZE,this.batchDelay=e.batchDelay||U.BATCH_PROCESSOR_CONFIG.DEFAULT_BATCH_DELAY,this.relayUrls=e.relayUrls||U.BATCH_PROCESSOR_CONFIG.DEFAULT_RELAY_URLS,this.batchQueue=new Set,this.pendingFetches=new Map,this.resolvers=new Map,this.processingItems=new Set,this.batchTimer=null,this.eventCache=new Map,this.maxCacheAge=e.maxCacheAge||U.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE}getOrCreateFetchPromise(e){if(this.pendingFetches.has(e))return this.pendingFetches.get(e);let t=new Promise((t=>{this.resolvers.set(e,t)}));return this.pendingFetches.set(e,t),this.batchQueue.add(e),this._scheduleBatchProcess(),t}_scheduleBatchProcess(){this.batchTimer||=setTimeout((()=>{this.batchTimer=null,this._processBatchQueue()}),this.batchDelay)}async _processBatchQueue(){if(this.batchQueue.size===0)return;let e=this._getBatchItems();await this._processBatch(e),this.batchQueue.size>0&&this._scheduleBatchProcess()}_getBatchItems(){let e=Array.from(this.batchQueue).slice(0,this.batchSize);return e.forEach((e=>{this.batchQueue.delete(e),this.processingItems.add(e)})),e}async _processBatch(e){try{await this.onBatchProcess(e)}catch(t){this._handleBatchError(e,t)}finally{this._cleanupBatchItems(e)}}_handleBatchError(e,t){e.forEach((e=>this.resolveItem(e,null)))}_cleanupBatchItems(e){e.forEach((e=>{this.processingItems.delete(e),this.pendingFetches.delete(e),this.resolvers.delete(e)}))}resolveItem(e,t){let n=this.resolvers.get(e);n&&(n(t),this.resolvers.delete(e))}async onBatchProcess(e){throw Error(`onBatchProcess must be implemented by derived class`)}onBatchError(e,t){e.forEach((e=>this.resolveItem(e,null)))}_cleanup(e,t,n,r){clearTimeout(e),t&&t.close(),n.forEach((e=>{!r.has(e)&&this.resolvers.has(e)&&this.resolveItem(e,null)}))}_getSubscriptionPool(){return this.pool}async _createSubscriptionPromise(e,t,n,r){if(t?.length)return new Promise((i=>{let a=new Set,o=U.BATCH_PROCESSOR_CONFIG.TIMEOUT_DURATION,s,c,l=!1,u=()=>{l||(l=!0,s&&clearTimeout(s),c&&c.close(),e.forEach((e=>{a.has(e)||this.resolveItem(e,null)})),i())};c=this.pool.subscribeMany(t,n,{onevent:t=>{try{l||(r(t,a),a.size===e.length&&u())}catch{}},oneose:()=>{setTimeout(u,100)},onerror:e=>{}}),s=setTimeout((()=>{l||u()}),o)}));e.forEach((e=>this.resolveItem(e,null)))}setRelayUrls(e){this.relayUrls=Array.isArray(e)?e:[]}getCachedItem(e){let t=this.eventCache.get(e);return this._isValidCache(t)?t.event:(this.eventCache.delete(e),null)}_isValidCache(e){return!!e&&Date.now()-e.timestamp<=this.maxCacheAge}setCachedItem(e,t){this.eventCache.set(e,{event:t,timestamp:Date.now()})}},uc=class extends lc{constructor(e={}){super(e)}async onBatchProcess(e){if(!e?.length)return;let t=[{ids:e.slice(0,this.batchSize)}];await this._createSubscriptionPromise(e,this.relayUrls,t,((t,n)=>{if(e.includes(t.id)){let e=this.getCachedItem(t.id);(!e||t.created_at>e.created_at)&&(this.setCachedItem(t.id,t),this.resolveItem(t.id,t),n.add(t.id))}}))}},dc=class extends lc{constructor(e={}){super(e)}_parseAtagValue(e){let t=e.split(`:`);return t.length===3?{kind:parseInt(t[0]),pubkey:t[1],identifier:t[2]}:null}async onBatchProcess(e){if(!e?.length)return;let t=[],n={kinds:[],authors:[],"#d":[]};if(e.slice(0,this.batchSize).forEach((e=>{let r=this._parseAtagValue(e);r?(n.kinds.push(r.kind),n.authors.push(r.pubkey),n[`#d`].push(r.identifier),t.push(e)):this.resolveItem(e,null)})),t.length===0)return;let r=[n];await this._createSubscriptionPromise(t,this.relayUrls,r,((e,n)=>{let r=t.find((t=>{let n=this._parseAtagValue(t);return n&&e.kind===n.kind&&e.pubkey===n.pubkey&&e.tags.some((e=>e[0]===`d`&&e[1]===n.identifier))}));if(r){let t=this.getCachedItem(r);(!t||e.created_at>t.created_at)&&(this.setCachedItem(r,e),this.resolveItem(r,e),n.add(r))}}))}},fc=class extends lc{constructor(e={}){let{simplePool:t,config:n}=e;super({pool:t,batchSize:n.BATCH_SIZE||U.PROFILE_CONFIG.BATCH_SIZE,batchDelay:n.BATCH_DELAY||U.PROFILE_CONFIG.BATCH_DELAY,relayUrls:n.RELAYS||U.PROFILE_CONFIG.RELAYS,maxCacheAge:U.BATCH_PROCESSOR_CONFIG.DEFAULT_MAX_CACHE_AGE}),this.config=n}async onBatchProcess(e){if(!this.config.RELAYS?.length)throw Error(`No relays configured for profile fetch`);let t=e.filter((e=>{let t=this.getCachedItem(e);return!t||(this.resolveItem(e,t),!1)}));if(t.length===0)return;let n=[{kinds:[0],authors:t}],r=new Map,i=(e,t)=>{let n=r.get(e.pubkey);(!n||e.created_at>n.created_at)&&(r.set(e.pubkey,e),this.setCachedItem(e.pubkey,e)),t.add(e.pubkey)};try{await this._createSubscriptionPromise(t,this.config.RELAYS,n,i),t.forEach((e=>{let t=r.get(e);this.resolveItem(e,t||null)}))}catch(t){this.onBatchError(e,t)}}},pc=Symbol(`verified`);function mc(e){if(!(e instanceof Object)||typeof e.kind!=`number`||typeof e.content!=`string`||typeof e.created_at!=`number`||typeof e.pubkey!=`string`||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let e=0;e<n.length;e++)if(typeof n[e]==`object`)return!1}return!0}new TextDecoder(`utf-8`);var hc=new TextEncoder;function gc(e){e.indexOf(`://`)===-1&&(e=`wss://`+e);let t=new URL(e);return t.pathname=t.pathname.replace(/\/+/g,`/`),t.pathname.endsWith(`/`)&&(t.pathname=t.pathname.slice(0,-1)),(t.port===`80`&&t.protocol===`ws:`||t.port===`443`&&t.protocol===`wss:`)&&(t.port=``),t.searchParams.sort(),t.hash=``,t.toString()}var _c=class{value;next=null;prev=null;constructor(e){this.value=e}},vc=class{first;last;constructor(){this.first=null,this.last=null}enqueue(e){let t=new _c(e);return this.last?this.last===this.first?(this.last=t,this.last.prev=this.first,this.first.next=t):(t.prev=this.last,this.last.next=t,this.last=t):(this.first=t,this.last=t),!0}dequeue(){if(!this.first)return null;if(this.first===this.last){let e=this.first;return this.first=null,this.last=null,e.value}let e=this.first;return this.first=e.next,e.value}};function yc(e){return dt(Ot(hc.encode(function(e){if(!mc(e))throw Error(`can't serialize event with wrong or missing properties`);return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}(e))))}var bc=new class{generateSecretKey(){return at.utils.randomPrivateKey()}getPublicKey(e){return dt(at.getPublicKey(e))}finalizeEvent(e,t){let n=e;return n.pubkey=dt(at.getPublicKey(t)),n.id=yc(n),n.sig=dt(at.sign(yc(n),t)),n[pc]=!0,n}verifyEvent(e){if(typeof e[pc]==`boolean`)return e[pc];let t=yc(e);if(t!==e.id)return e[pc]=!1,!1;try{let n=at.verify(e.sig,t,e.pubkey);return e[pc]=n,n}catch{return e[pc]=!1,!1}}},xc=(bc.generateSecretKey,bc.getPublicKey,bc.finalizeEvent,bc.verifyEvent);function Sc(e,t){if(e.ids&&e.ids.indexOf(t.id)===-1||e.kinds&&e.kinds.indexOf(t.kind)===-1||e.authors&&e.authors.indexOf(t.pubkey)===-1)return!1;for(let n in e)if(n[0]===`#`){let r=e[`#${n.slice(1)}`];if(r&&!t.tags.find((([e,t])=>e===n.slice(1)&&r.indexOf(t)!==-1)))return!1}return!(e.since&&t.created_at<e.since)&&!(e.until&&t.created_at>e.until)}async function Cc(){return new Promise((e=>{let t=new MessageChannel,n=()=>{t.port1.removeEventListener(`message`,n),e()};t.port1.addEventListener(`message`,n),t.port2.postMessage(0),t.port1.start()}))}var wc,Tc=e=>(e[pc]=!0,!0),Ec=class{url;_connected=!1;onclose=null;onnotice=e=>{};_onauth=null;baseEoseTimeout=4400;connectionTimeout=4400;publishTimeout=4400;openSubs=new Map;connectionTimeoutHandle;connectionPromise;openCountRequests=new Map;openEventPublishes=new Map;ws;incomingMessageQueue=new vc;queueRunning=!1;challenge;serial=0;verifyEvent;_WebSocket;constructor(e,t){this.url=gc(e),this.verifyEvent=t.verifyEvent,this._WebSocket=t.websocketImplementation||WebSocket}static async connect(e,t){let n=new Ec(e,t);return await n.connect(),n}closeAllSubscriptions(e){for(let[t,n]of this.openSubs)n.close(e);this.openSubs.clear();for(let[t,n]of this.openEventPublishes)n.reject(Error(e));this.openEventPublishes.clear();for(let[t,n]of this.openCountRequests)n.reject(Error(e));this.openCountRequests.clear()}get connected(){return this._connected}async connect(){return this.connectionPromise||=(this.challenge=void 0,new Promise(((e,t)=>{this.connectionTimeoutHandle=setTimeout((()=>{t(`connection timed out`),this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions(`relay connection timed out`)}),this.connectionTimeout);try{this.ws=new this._WebSocket(this.url)}catch(e){t(e);return}this.ws.onopen=()=>{clearTimeout(this.connectionTimeoutHandle),this._connected=!0,e()},this.ws.onerror=e=>{t(e.message||`websocket error`),this._connected&&(this._connected=!1,this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions(`relay connection errored`))},this.ws.onclose=async()=>{this._connected&&(this._connected=!1,this.connectionPromise=void 0,this.onclose?.(),this.closeAllSubscriptions(`relay connection closed`))},this.ws.onmessage=this._onmessage.bind(this)}))),this.connectionPromise}async runQueue(){for(this.queueRunning=!0;!1!==this.handleNext();)await Cc();this.queueRunning=!1}handleNext(){let e=this.incomingMessageQueue.dequeue();if(!e)return!1;let t=function(e){let t=e.slice(0,22).indexOf(`"EVENT"`);if(t===-1)return null;let n=e.slice(t+7+1).indexOf(`"`);if(n===-1)return null;let r=t+7+1+n,i=e.slice(r+1,80).indexOf(`"`);if(i===-1)return null;let a=r+1+i;return e.slice(r+1,a)}(e);if(t){let n=this.openSubs.get(t);if(!n)return;let r=function(e,t){let n=e.indexOf(`"${t}":`)+5,r=e.slice(n).indexOf(`"`)+n+1;return e.slice(r,r+64)}(e,`id`),i=n.alreadyHaveEvent?.(r);if(n.receivedEvent?.(this,r),i)return}try{let t=JSON.parse(e);switch(t[0]){case`EVENT`:{let e=this.openSubs.get(t[1]),n=t[2];this.verifyEvent(n)&&function(e,t){for(let n=0;n<e.length;n++)if(Sc(e[n],t))return!0;return!1}(e.filters,n)&&e.onevent(n);return}case`COUNT`:{let e=t[1],n=t[2],r=this.openCountRequests.get(e);r&&(r.resolve(n.count),this.openCountRequests.delete(e));return}case`EOSE`:{let e=this.openSubs.get(t[1]);if(!e)return;e.receivedEose();return}case`OK`:{let e=t[1],n=t[2],r=t[3],i=this.openEventPublishes.get(e);i&&(n?i.resolve(r):i.reject(Error(r)),this.openEventPublishes.delete(e));return}case`CLOSED`:{let e=t[1],n=this.openSubs.get(e);if(!n)return;n.closed=!0,n.close(t[2]);return}case`NOTICE`:this.onnotice(t[1]);return;case`AUTH`:this.challenge=t[1],this._onauth?.(t[1]);return}}catch{return}}async send(e){if(!this.connectionPromise)throw Error(`sending on closed connection`);this.connectionPromise.then((()=>{this.ws?.send(e)}))}async auth(e){if(!this.challenge)throw Error(`can't perform auth, no challenge was received`);let t=await e(function(e,t){return{kind:22242,created_at:Math.floor(Date.now()/1e3),tags:[[`relay`,e],[`challenge`,t]],content:``}}(this.url,this.challenge)),n=new Promise(((e,n)=>{this.openEventPublishes.set(t.id,{resolve:e,reject:n})}));return this.send(`["AUTH",`+JSON.stringify(t)+`]`),n}async publish(e){let t=new Promise(((t,n)=>{this.openEventPublishes.set(e.id,{resolve:t,reject:n})}));return this.send(`["EVENT",`+JSON.stringify(e)+`]`),setTimeout((()=>{let t=this.openEventPublishes.get(e.id);t&&(t.reject(Error(`publish timed out`)),this.openEventPublishes.delete(e.id))}),this.publishTimeout),t}async count(e,t){this.serial++;let n=t?.id||`count:`+this.serial,r=new Promise(((e,t)=>{this.openCountRequests.set(n,{resolve:e,reject:t})}));return this.send(`["COUNT","`+n+`",`+JSON.stringify(e).substring(1)),r}subscribe(e,t){let n=this.prepareSubscription(e,t);return n.fire(),n}prepareSubscription(e,t){this.serial++;let n=t.id||`sub:`+this.serial,r=new Dc(this,n,e,t);return this.openSubs.set(n,r),r}close(){this.closeAllSubscriptions(`relay connection closed by us`),this._connected=!1,this.ws?.close()}_onmessage(e){this.incomingMessageQueue.enqueue(e.data),this.queueRunning||this.runQueue()}},Dc=class{relay;id;closed=!1;eosed=!1;filters;alreadyHaveEvent;receivedEvent;onevent;oneose;onclose;eoseTimeout;eoseTimeoutHandle;constructor(e,t,n,r){this.relay=e,this.filters=n,this.id=t,this.alreadyHaveEvent=r.alreadyHaveEvent,this.receivedEvent=r.receivedEvent,this.eoseTimeout=r.eoseTimeout||e.baseEoseTimeout,this.oneose=r.oneose,this.onclose=r.onclose,this.onevent=r.onevent||(e=>{})}fire(){this.relay.send(`["REQ","`+this.id+`",`+JSON.stringify(this.filters).substring(1)),this.eoseTimeoutHandle=setTimeout(this.receivedEose.bind(this),this.eoseTimeout)}receivedEose(){this.eosed||(clearTimeout(this.eoseTimeoutHandle),this.eosed=!0,this.oneose?.())}close(e=`closed by caller`){!this.closed&&this.relay.connected&&(this.relay.send(`["CLOSE",`+JSON.stringify(this.id)+`]`),this.closed=!0),this.relay.openSubs.delete(this.id),this.onclose?.(e)}},Oc=class{relays=new Map;seenOn=new Map;trackRelays=!1;verifyEvent;trustedRelayURLs=new Set;_WebSocket;constructor(e){this.verifyEvent=e.verifyEvent,this._WebSocket=e.websocketImplementation}async ensureRelay(e,t){e=gc(e);let n=this.relays.get(e);return n||(n=new Ec(e,{verifyEvent:this.trustedRelayURLs.has(e)?Tc:this.verifyEvent,websocketImplementation:this._WebSocket}),t?.connectionTimeout&&(n.connectionTimeout=t.connectionTimeout),this.relays.set(e,n)),await n.connect(),n}close(e){e.map(gc).forEach((e=>{this.relays.get(e)?.close()}))}subscribeMany(e,t,n){return this.subscribeManyMap(Object.fromEntries(e.map((e=>[e,t]))),n)}subscribeManyMap(e,t){this.trackRelays&&(t.receivedEvent=(e,t)=>{let n=this.seenOn.get(t);n||(n=new Set,this.seenOn.set(t,n)),n.add(e)});let n=new Set,r=[],i=Object.keys(e).length,a=[],o=e=>{a[e]=!0,a.filter((e=>e)).length===i&&(t.oneose?.(),o=()=>{})},s=[],c=(e,n)=>{o(e),s[e]=n,s.filter((e=>e)).length===i&&(t.onclose?.(s),c=()=>{})},l=e=>{if(t.alreadyHaveEvent?.(e))return!0;let r=n.has(e);return n.add(e),r},u=Promise.all(Object.entries(e).map((async(e,n,i)=>{if(i.indexOf(e)!==n)return void c(n,`duplicate url`);let a,[s,u]=e;s=gc(s);try{a=await this.ensureRelay(s,{connectionTimeout:t.maxWait?Math.max(.8*t.maxWait,t.maxWait-1e3):void 0})}catch(e){c(n,e?.message||String(e));return}let d=a.subscribe(u,{...t,oneose:()=>o(n),onclose:e=>c(n,e),alreadyHaveEvent:l,eoseTimeout:t.maxWait});r.push(d)})));return{async close(){await u,r.forEach((e=>{e.close()}))}}}subscribeManyEose(e,t,n){let r=this.subscribeMany(e,t,{...n,oneose(){r.close()}});return r}async querySync(e,t,n){return new Promise((async r=>{let i=[];this.subscribeManyEose(e,[t],{...n,onevent(e){i.push(e)},onclose(e){r(i)}})}))}async get(e,t,n){t.limit=1;let r=await this.querySync(e,t,n);return r.sort(((e,t)=>t.created_at-e.created_at)),r[0]||null}publish(e,t){return e.map(gc).map((async(e,n,r)=>{if(r.indexOf(e)!==n)return Promise.reject(`duplicate url`);let i=await this.ensureRelay(e);return i.publish(t).then((e=>{if(this.trackRelays){let e=this.seenOn.get(t.id);e||(e=new Set,this.seenOn.set(t.id,e)),e.add(i)}return e}))}))}listConnectionStatus(){let e=new Map;return this.relays.forEach(((t,n)=>e.set(n,t.connected))),e}destroy(){this.relays.forEach((e=>e.close())),this.relays=new Map}};try{wc=WebSocket}catch{}var kc=class extends Oc{constructor(){super({verifyEvent:xc,websocketImplementation:wc})}},Ac=new class e{static instance=null;#e;#t;#n=!0;#r;constructor(){return e.instance?e.instance:(this.#i(),e.instance=this,this)}#i(){if(this.#e=U.PROFILE_CONFIG,this.#t=new kc,!this.#t?.ensureRelay)throw Error(`Failed to initialize SimplePool`);this.#r=new fc({simplePool:this.#t,config:{...this.#e,RELAYS:this.#e.RELAYS||[]}})}get isInitialized(){return this.#n}async fetchProfiles(e){if(!Array.isArray(e)||e.length===0)return[];let t=Date.now(),n=Array(e.length),r=e.reduce(((e,r,i)=>{let a=W.getProfile(r);return this.#a(a,t)?n[i]=a:e.push({index:i,pubkey:r}),e}),[]);return r.length>0&&await this.#s(r,n,e),n}async processBatchProfiles(e){let t=this.#o(e);if(t.length!==0)try{await Promise.all([this.fetchProfiles(t),...t.map((e=>this.verifyNip05Async(e)))])}catch{}}async verifyNip05Async(e){let t=W.getNip05(e);if(t!==void 0)return t;let n=W.getNip05PendingFetch(e);if(n)return n;let r=this.#l(e);return W.setNip05PendingFetch(e,r),r}getNip05(e){return W.getNip05(e)}clearCache(){W.clearAll(),this.#r.clearPendingFetches()}#a(e,t){return e&&e._lastUpdated&&t-e._lastUpdated<18e5}#o(e){return[...new Set(e?.map((e=>e?.pubkey))?.filter((e=>e&&typeof e==`string`&&e.length===64)))]}async#s(e,t,n){if(!e.length)return;let r=Date.now(),i=e.filter((({pubkey:e})=>e&&typeof e==`string`&&e.length===64));if(i.length===0)return;let a=await Promise.all(i.map((({pubkey:e})=>this.#c(e,r))));i.forEach((({index:e},r)=>{e>=0&&e<t.length&&(t[e]=a[r],n[e]&&W.setProfile(n[e],a[r]))}))}async#c(e,t){if(!e||typeof e!=`string`||e.length!==64)return this.#u();try{let n={kinds:[0],authors:[e],limit:1},r=await this.#r.getOrCreateFetchPromise(e,n);if(!r?.content)return this.#u();let i;try{i=JSON.parse(r.content)}catch{return this.#u()}return{...i,name:Qs(i)||`nameless`,_lastUpdated:t,_eventCreatedAt:r.created_at}}catch{return this.#u()}}async#l(e){try{let[t]=await this.fetchProfiles([e]);if(!t?.nip05)return W.setNip05(e,null),null;let n=await Promise.race([$s(t.nip05,e),new Promise(((e,t)=>setTimeout((()=>t(Error(`NIP-05 timeout`))),5e3)))]);if(!n)return W.setNip05(e,null),null;let r=nc(n.startsWith(`_@`)?n.slice(1):n);return W.setNip05(e,r),r}catch{return W.setNip05(e,null),null}finally{W.deleteNip05PendingFetch(e)}}#u(){return{name:`anonymous`,display_name:`anonymous`}}},jc=class{async loadAndUpdate(e,t){if(e)try{let n=t.querySelector(`.sender-name`),r=t.querySelector(`.zap-placeholder-name`),i=t.querySelector(`.sender-icon`),a=i?.querySelector(`.zap-placeholder-icon`),o=t.querySelector(`.sender-pubkey`),s=W.getProfile(e),c=s?Qs(s)||`nameless`:`anonymous`,l=s?.picture?function(e){if(!e||typeof e!=`string`)return null;try{let t=new URL(e);return[`http:`,`https:`].includes(t.protocol)?t.href:null}catch{return null}}(s.picture):null;this.#e(r,n,c),this.#n(a,i,l,c),this.#r(o,e)}catch{this.#i(t)}}#e(e,t,n){e?e.replaceWith(Object.assign(document.createElement(`span`),{className:`sender-name`,textContent:n})):t&&(t.textContent=n)}#t(e,t=`anonymous user's icon`){let n=`https://robohash.org/${e}.png?set=set5&bgset=bg2&size=128x128`,r=W.getImageCache(n),i=Object.assign(document.createElement(`img`),{alt:t,loading:`lazy`,className:`profile-icon`});if(r)return i.src=n,i;let a=new Image;return a.onerror=()=>{i.src=qs,W.setImageCache(n,qs)},a.onload=()=>{W.setImageCache(n,a)},a.src=n,i.src=n,i}#n(e,t,n,r){if(e&&t){let i=n=>{e.remove();let i=t.querySelector(`img`),a=t.querySelector(`a`);i&&i.remove(),a&&a.remove();let o=n===`robohash`?this.#t(t.closest(`[data-pubkey]`)?.dataset.pubkey,`${nc(r)}'s icon`):Object.assign(document.createElement(`img`),{src:n,alt:`${nc(r)}'s icon`,loading:`lazy`,className:`profile-icon`}),s=t.closest(`[data-pubkey]`)?.dataset.pubkey;if(s){let e=function(e,t=[]){try{return window.NostrTools.nip19.nprofileEncode({pubkey:e,relays:t})}catch{return null}}(s),n=Object.assign(document.createElement(`a`),{href:`https://njump.me/${e}`,target:`_blank`,rel:`noopener noreferrer`});n.appendChild(o),t.appendChild(n)}else t.appendChild(o)};if(n){let e=new Image;e.onload=()=>{W.setImageCache(n,e),i(n)},e.onerror=()=>{i(`robohash`)},e.src=n}else i(`robohash`)}}#r(e,t){if(e&&!e.getAttribute(`data-nip05-updated`)){let n=Ac.getNip05(t);n?(e.textContent=n,e.setAttribute(`data-nip05-updated`,`true`)):Ac.verifyNip05Async(t).then((t=>{t&&(e.textContent=t,e.setAttribute(`data-nip05-updated`,`true`))}))}}#i(e){let t=e.querySelector(`.zap-placeholder-icon`);if(t){let n=t.parentElement,r=e.closest(`[data-pubkey]`)?.dataset.pubkey;t.remove(),n.appendChild(this.#t(r))}}async updateProfileElement(e,t){if(!e||!t)return;let n=e.querySelector(`.sender-icon img, .zap-placeholder-icon`);if(n){if(t.picture){let r=document.createElement(`img`);r.alt=t.name||`Profile Picture`,r.width=32,r.height=32,r.className=`profile-icon`,r.onerror=()=>{let n=e.getAttribute(`data-pubkey`);if(n){let e=this.#t(n,t.name||`anonymous user`);r.parentElement&&r.parentElement.replaceChild(e,r)}},r.src=t.picture,n.parentElement&&n.parentElement.replaceChild(r,n)}else{let r=e.getAttribute(`data-pubkey`);if(r){let e=this.#t(r,t.name||`anonymous user`);n.parentElement&&n.parentElement.replaceChild(e,n)}}}let r=e.querySelector(`.sender-name, .zap-placeholder-name`);if(r&&(r.textContent=t.display_name||t.name||`anonymous`,r.className=`sender-name`),t.nip05){let t=e.getAttribute(`data-pubkey`);if(t){let n=e.querySelector(`[data-nip05-target="true"]`);n&&await this.updateNip05Display(t,n)}}}},Mc=class e{static#e={1:`content`,30023:`title`,30030:`title`,30009:`name`,40:`content`,42:`name`,31990:`alt`};static createUIComponents(e,t,n){try{let r=this.viewConfigs?.get(t),i=n||r?.identifier,a=ic(i)?null:this.#o(e);return{iconComponent:this.#t(),nameComponent:this.#c(e),pubkeyComponent:this.#l(e,i),referenceComponent:this.#u(a)}}catch{return this.#n()}}static#t(){return`<div class="zap-placeholder-icon skeleton"></div>`}static#n(){return{iconComponent:`<div class="zap-placeholder-icon skeleton"></div>`,nameComponent:`<div class="zap-placeholder-name skeleton"></div>`,pubkeyComponent:``,referenceComponent:``}}static createReferenceComponent(e){return this.#u(this.#o({reference:e}))}static addReferenceToElement(e,t){if(!this.#r(e,t))return;let n=e.querySelector(`.zap-content`);this.#i(n,t)}static#r(e,t){return e&&t&&e.querySelector(`.zap-content`)}static#i(e,t){e.querySelectorAll(`.zap-reference`).forEach((e=>e.remove()));let n=this.createReferenceComponent({reference:t});e.insertAdjacentHTML(`beforeend`,n)}static getDialogTemplate(){return`
      <dialog class="dialog">
        <h2 class="dialog-title"><a href="#" target="_blank"></a></h2>
        <button class="close-dialog-button">X</button>
        <div class="zap-stats"></div>
        <ul class="dialog-zap-list"></ul>
      </dialog>
    `}static createZapItemHTML(e,t,n,r){try{let i=this.createUIComponents(e,n,r);return this.#a(e,t,i)}catch{return``}}static createNoZapsMessageHTML(e){return`\n      <div class="no-zaps-container">\n        <div class="no-zaps-message">${e}</div>\n      </div>\n    `}static#a(e,t,n){let[r,i]=e.satsText.split(` `),a=(o=e.created_at,Math.floor(Date.now()/1e3)-o<86400);var o;return`\n      <div class="zap-content">\n        <div class="zap-sender${e.comment?` with-comment`:``}" data-pubkey="${e.pubkey}">\n          <div class="sender-icon${a?` is-new`:``}">\n            ${n.iconComponent}\n          </div>\n          <div class="sender-info">\n            ${n.nameComponent}\n            ${n.pubkeyComponent}\n          </div>\n          <div class="zap-amount ${t}"><span class="number">${r}</span> ${i}</div>\n        </div>\n        ${e.comment?`<div class="zap-details"><span class="zap-comment">${nc(e.comment)}</span></div>`:``}\n        ${n.referenceComponent}\n      </div>\n    `}static#o(e){if(!e)return null;if(this.#s(e))return e;if(e.reference&&typeof e.reference==`object`){if(e.reference.reference&&this.#s(e.reference.reference))return e.reference.reference;if(this.#s(e.reference))return e.reference}return null}static#s(e){return e&&typeof e==`object`&&`id`in e&&`tags`in e&&Array.isArray(e.tags)&&`content`in e&&`kind`in e}static#c({senderName:e}){return e?`<span class="sender-name">${nc(e)}</span>`:`<div class="zap-placeholder-name skeleton"></div>`}static#l({pubkey:e,displayIdentifier:t,reference:n},r){let i=!ic(r),a=`class="sender-pubkey" data-pubkey="${e}"`;return n&&i?`<span ${a}>${t}</span>`:`<span ${a} data-nip05-target="true">${t}</span>`}static#u(e){if(!this.#s(e))return``;let t=e.id,n=W.getReferenceComponent(t);if(n)return n;try{let n=this.#d(e),r=this.#p(e),i=this.#m(n,r);return W.setReferenceComponent(t,i),i}catch{return``}}static#d(e){if(!e?.tags)return``;if(e.kind===31990)return this.#f(e)||``;let t=Array.isArray(e.tags)?e.tags.find((e=>Array.isArray(e)&&e[0]===`d`)):null;return t?`https://njump.me/${function(e,t,n,r=[]){try{return window.NostrTools.nip19.naddrEncode({kind:e,pubkey:t,identifier:n,relays:r})}catch{return null}}(e.kind,e.pubkey,t[1])}`:e.id?`https://njump.me/${function(e,t,n,r=[]){try{return window.NostrTools.nip19.neventEncode({id:e,kind:t,pubkey:n,relays:r})}catch{return null}}(e.id,e.kind,e.pubkey)}`:``}static#f(e){let t=e.tags.filter((e=>e[0]===`r`));return(t.find((e=>!e.includes(`source`)))||t[0])?.[1]}static#p(t){if(!t)return``;let n=e.#e[t.kind];if(n){let e=t.tags.find((e=>Array.isArray(e)&&e[0]===n));if(e&&e[1])return e[1]}if(t.kind===40)try{return JSON.parse(t.content).name||t.content}catch{}return t.content||``}static#m(e,t){return`\n      <div class="zap-reference">\n        <div class="reference-arrow">\n          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aCBkPSJtNTYwLTEyMC01Ny01NyAxNDQtMTQzSDIwMHYtNDgwaDgwdjQwMGgzNjdMNTAzLTU0NGw1Ni01NyAyNDEgMjQxLTI0MCAyNDBaIiAvPg0KPC9zdmc+" alt="Reference" width="18" height="18" />\n        </div>\n        <div class="reference-text">${nc(t)}</div>\n        <a href="${e}" target="_blank" class="reference-link">\n          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjODg4Ij4NCiAgICA8cGF0aA0KICAgICAgICBkPSJNNDQwLTI4MEgyODBxLTgzIDAtMTQxLjUtNTguNVQ4MC00ODBxMC04MyA1OC41LTE0MS41VDI4MC02ODBoMTYwdjgwSDI4MHEtNTAgMC04NSAzNXQtMzUgODVxMCA1MCAzNSA4NXQ4NSAzNWgxNjB2ODBaTTMyMC00NDB2LTgwaDMyMHY4MEgzMjBabTIwMCAxNjB2LTgwaDE2MHE1MCAwIDg1LTM1dDM1LTg1cTAtNTAtMzUtODV0LTg1LTM1SDUyMHYtODBoMTYwcTgzIDAgMTQxLjUgNTguNVQ4ODAtNDgwcTAgODMtNTguNSAxNDEuNVQ2ODAtMjgwSDUyMFoiIC8+DQo8L3N2Zz4=" alt="Quick Reference" width="16" height="16" />\n        </a>\n      </div>\n    `}static ZapInfo=class{#h;constructor(e){this.#h=e}static async createFromEvent(t,n={}){return await new e.ZapInfo(t).extractInfo(n)}static getAmountColorClass(e,t){return(t===void 0?U.ZAP_AMOUNT_CONFIG.DEFAULT_COLOR_MODE:t)?this.#g(e):U.ZAP_AMOUNT_CONFIG.DISABLED_CLASS}static#g(e){let{THRESHOLDS:t,DEFAULT_CLASS:n}=U.ZAP_AMOUNT_CONFIG;return t.find((t=>e>=t.value))?.className||n}async extractInfo(t={}){let n=this.#h.id,r=W.getZapInfo(n);if(r)return r.colorClass=e.ZapInfo.getAmountColorClass(r.satsAmount,t.isColorModeEnabled),r;try{let{pubkey:r,content:i,satsText:a}=await ac(this.#h),o=parseInt(a.replace(/,/g,``).split(` `)[0],10),s=typeof r==`string`?r:null,c=this.#h.reference||null,l={satsText:a,satsAmount:o,comment:i||``,pubkey:s||``,created_at:this.#h.created_at,displayIdentifier:s?tc(rc(s)):`anonymous`,senderName:null,senderIcon:null,reference:c,colorClass:e.ZapInfo.getAmountColorClass(o,t?.isColorModeEnabled)};return W.setZapInfo(n,l),l}catch{let e={satsText:`Amount: Unknown`,satsAmount:0,comment:``,pubkey:``,created_at:this.#h.created_at,displayIdentifier:`anonymous`,senderName:`anonymous`,senderIcon:i,reference:null};return W.setZapInfo(n,e),e}var i}static async batchExtractInfo(t,n=!0){let r=new Map;return await Promise.all(t.map((async t=>{let i=await new e.ZapInfo(t).extractInfo({isColorModeEnabled:n});r.set(t.id,i)}))),r}};static viewConfigs=new Map},Nc=class{constructor(e,t){this.viewId=e,this.config=t}async createListItem(e){let t=await Mc.ZapInfo.createFromEvent(e,{isColorModeEnabled:this.config?.isColorModeEnabled}),n=document.createElement(`li`);return n.className=`zap-list-item ${t.colorClass}${t.comment?` with-comment`:``}`,n.setAttribute(`data-pubkey`,t.pubkey),e?.id&&n.setAttribute(`data-event-id`,e.id),n.innerHTML=Mc.createZapItemHTML(t,t.colorClass,this.viewId),n.setAttribute(`data-timestamp`,e.created_at.toString()),{li:n,zapInfo:t}}},Pc=class{constructor(e,t,n,r){if(!e)throw Error(`shadowRoot is required`);if(!r)throw Error(`config is required`);this.shadowRoot=e,this.profileUI=t,this.viewId=n,this.config=r,this.itemBuilder=new Nc(n,this.config),this.profileUpdateUnsubscribe=null,this.#f()}destroy(){this.profileUpdateUnsubscribe&&=(this.profileUpdateUnsubscribe(),null);let e=this.#e(`.dialog-zap-list`);e&&(e.innerHTML=``)}#e(e){return this.shadowRoot.querySelector(e)}getElementByEventId(e){return this.#e(`.zap-list-item[data-event-id="${e}"]`)}async#t(e){let t=this.#e(`.dialog-zap-list`);if(t)try{return this.#r(t),await e(t)}catch{t.children.length===0&&this.showNoZapsMessage()}}#n(e,t){let n=e.querySelector(`.load-more-trigger`);n&&n.remove(),Array.from(t.children).forEach((t=>{let n=t.getAttribute(`data-event-id`),r=parseInt(t.getAttribute(`data-timestamp`)),i=null,a=Array.from(e.children);for(let e=0;e<a.length;e++)if(r>parseInt(a[e].getAttribute(`data-timestamp`))){i=a[e];break}e.querySelector(`.zap-list-item[data-event-id="${n}"]`)||(i?e.insertBefore(t,i):e.appendChild(t))})),n&&e.appendChild(n)}#r(e){let t=e.querySelector(`.no-zaps-message`);t&&t.remove()}async#i(e,t){return this.#t((async n=>{let{li:r,zapInfo:i}=await this.itemBuilder.createListItem(e);return t(n,r),await this.#h(i.pubkey,r),{li:r,zapInfo:i}}))}async renderZapListFromCache(e){if(!e?.length)return W.setNoZapsState(this.viewId,!1),this.showNoZapsMessage();await this.#t((async t=>{let{initialBatch:n,remainingBatch:r}=this.#a(e),{fragment:i,profileUpdates:a}=await this.#o(n);this.#n(t,i),r.length>0?this.#s(r,t,a):await this.#m(a)}))}#a(e){let t=this.#_(e),n=U.DIALOG_CONFIG.ZAP_LIST.INITIAL_BATCH;return{initialBatch:t.slice(0,n),remainingBatch:t.slice(n)}}async#o(e){let t=document.createDocumentFragment(),n=[];for(let r of e){let{li:e,zapInfo:i}=await this.itemBuilder.createListItem(r);this.#v(r.id,e),t.appendChild(e),i.pubkey&&n.push({pubkey:i.pubkey,element:e})}return{fragment:t,profileUpdates:n}}#s(e,t,n){if(!e.length)return;let r=U.DIALOG_CONFIG.ZAP_LIST.REMAINING_BATCH,i=0,a=async()=>{if(i>=e.length)return void await this.#m(n);let o=e.slice(i,i+r);await this.#c(o,t,n),i+=r,setTimeout((()=>a()),0)};requestIdleCallback((()=>a()))}async#c(e,t,n){let r=document.createDocumentFragment();await Promise.all(e.map((async e=>{let{li:t,zapInfo:i}=await this.itemBuilder.createListItem(e);this.#v(e.id,t),r.appendChild(t),i.pubkey&&n.push({pubkey:i.pubkey,element:t})})));let i=t.querySelector(`.load-more-trigger`);i&&i.remove(),t.appendChild(r),i&&t.appendChild(i),await new Promise((e=>requestAnimationFrame(e)))}async prependZap(e){return this.#i(e,((e,t)=>e.prepend(t)))}async appendZap(e){return this.#i(e,((t,n)=>{let r=this.#d(t,e.created_at);r?t.insertBefore(n,r):t.appendChild(n)}))}async replacePlaceholderWithZap(e,t){let n=this.#e(`[data-index="${t}"]`);if(this.#y(n))try{let{zapInfo:t}=await this.itemBuilder.createListItem(e);this.#b(n,t,e.id),await this.#h(t.pubkey,n)}catch{n.remove()}}async showNoZapsMessage(){let e=this.#e(`.dialog-zap-list`);if(e){if(W.hasNoZaps(this.viewId))return void this.#u(e);await this.#l()||(this.#u(e),W.setNoZapsState(this.viewId,!0))}}async#l(){let e=this.config.noZapsDelay||U.DIALOG_CONFIG.DEFAULT_NO_ZAPS_DELAY;await new Promise((t=>setTimeout(t,e)));let t=W.getZapEvents(this.viewId);return!!t?.length&&(await this.renderZapListFromCache(t),!0)}#u(e){let t=this.config.noZapsMessage||U.DIALOG_CONFIG.NO_ZAPS_MESSAGE;e.innerHTML=Mc.createNoZapsMessageHTML(t),e.style.minHeight=U.DIALOG_CONFIG.ZAP_LIST.MIN_HEIGHT}async batchUpdate(e,t={}){let n=this.#e(`.dialog-zap-list`);if(n)try{let r=new Map(Array.from(n.querySelectorAll(`.zap-list-item`)).map((e=>[e.getAttribute(`data-event-id`),e]))),i=this.#_(e),a=ic(this.config.identifier),o=i.filter((e=>{let t=r.get(e.id);return a?!t:!t||e.reference&&!t.querySelector(`.zap-reference`)}));if(o.length===0&&!t.isFullUpdate)return;let s=document.createDocumentFragment();for(let e of o){let{li:t,zapInfo:n}=await this.itemBuilder.createListItem(e);!a&&e.reference&&this.updateZapReference(e),s.appendChild(t),n.pubkey&&await this.#h(n.pubkey,t)}this.#n(n,s)}catch{}}#d(e,t){return Array.from(e.children).find((e=>t>parseInt(e.getAttribute(`data-timestamp`)||`0`)))}updateZapReference(e){if(e?.id&&e?.reference)try{let t=this.getElementByEventId(e.id);if(!t)return;Mc.addReferenceToElement(t,e.reference),W.setReference(e.id,e.reference)}catch{}}#f(){this.profileUpdateUnsubscribe=W.subscribeToProfileUpdates(this.#p.bind(this))}async#p(e,t){let n=this.shadowRoot.querySelectorAll(`[data-pubkey="${e}"]`);await Promise.allSettled(Array.from(n).map((e=>this.profileUI.updateProfileElement(e,t))))}async#m(e){let t=U.DIALOG_CONFIG.ZAP_LIST.PROFILE_BATCH;for(let n=0;n<e.length;n+=t){let r=e.slice(n,n+t);await Promise.all(r.map((({pubkey:e,element:t})=>this.#h(e,t)))),await new Promise((e=>requestAnimationFrame(e)))}}async#h(e,t){e&&await this.#g(e,t)}async#g(e,t){if(e&&t)try{await this.profileUI.loadAndUpdate(e,t)}catch{}}#_(e){return[...new Map(e.map((e=>[e.id,e]))).values()].sort(((e,t)=>t.created_at-e.created_at))}#v(e,t){if(ic(this.config.identifier))return;let n=W.getReference(e);n&&Mc.addReferenceToElement(t,n)}#y(e){return e&&e.classList.contains(`placeholder`)}#b(e,t,n){let r=this.itemBuilder.getAmountColorClass(t.satsAmount);e.className=`zap-list-item ${r}${t.comment?` with-comment`:``}`,e.setAttribute(`data-pubkey`,t.pubkey),e.setAttribute(`data-event-id`,n),e.innerHTML=Mc.createZapItemHTML(t,r,this.viewId),e.removeAttribute(`data-index`)}},Fc=n(0),Ic=n.n(Fc),Lc=new class{#e=new Map;#t=new Map;constructor(){}async getZapStats(e,t){let n=await this.#n(t,e);if(n)return n;let r=await this.fetchStats(e);return r&&W.updateStatsCache(t,e,r),r}async fetchStats(e){try{let t=await this._fetchFromApi(e);return this._formatStats(t)||this.createTimeoutError()}catch(e){return this.handleFetchError(e)}}createTimeoutError(){return{error:!0,timeout:!0}}handleFetchError(e){return{error:!0,timeout:e.message===`STATS_TIMEOUT`}}async _fetchFromApi(e){let t=oc(e);if(!t)return null;let n=`https://api.nostr.band/v0/stats/${t.type===`npub`||t.type===`nprofile`?`profile`:`event`}/${e}`,r=new AbortController,i=setTimeout((()=>r.abort()),U.REQUEST_CONFIG.REQUEST_TIMEOUT);try{return await(await fetch(n,{signal:r.signal})).json()}catch(e){throw e.name===`AbortError`?Error(`STATS_TIMEOUT`):e}finally{clearTimeout(i)}}_formatStats(e){if(!e?.stats)return null;let t=Object.values(e.stats)[0];return t?{count:parseInt(t.zaps_received?.count||t.zaps?.count||0,10),msats:parseInt(t.zaps_received?.msats||t.zaps?.msats||0,10),maxMsats:parseInt(t.zaps_received?.max_msats||t.zaps?.max_msats||0,10)}:null}async initializeStats(e,t,n=!1){if(n&&this.displayStats({skeleton:!0},t),this.#t.has(t))return this.#t.get(t);if(oc(e)?.type===`naddr`){let e=this.createTimeoutError();return this.displayStats(e,t),this.#e.set(t,e),e}let r=(async()=>{try{let n=await this.getZapStats(e,t);return n&&(this.displayStats(n,t),this.#e.set(t,n)),n}catch{return null}finally{this.#t.delete(t)}})();return this.#t.set(t,r),r}async#n(e,t){let n=W.getCachedStats(e,t);return n&&Date.now()-n.timestamp<U.REQUEST_CONFIG.CACHE_DURATION?n.stats:null}getCurrentStats(e){return this.#e.get(e)}async handleZapEvent(e,t,n){if(e?.isRealTimeEvent)try{let r=e.tags.find((e=>e[0].toLowerCase()===`bolt11`))?.[1],i=this.extractAmountFromBolt11(r);if(i<=0)return;let a=W.getViewStats(t),o={count:a?.count||0,msats:a?.msats||0,maxMsats:a?.maxMsats||0},s={count:o.count+1,msats:o.msats+i,maxMsats:Math.max(o.maxMsats,i)};W.updateStatsCache(t,n,s),this.#e.set(t,s),await this.displayStats(s,t),e.isStatsCalculated=!0,e.amountMsats=i}catch{}}extractAmountFromBolt11(e){try{let t=window.decodeBolt11(e);return parseInt(t.sections.find((e=>e.name===`amount`))?.value??`0`,10)}catch{return 0}}async displayStats(e,t){try{await Uc(e,t)}catch{}}},Rc=new class{#e;#t;#n;#r;#i;#a;#o;constructor(){this.#e=new kc,this.#s(),this.#c()}#s(){this.#n=new Map,this.#r=new Map,this.#i=new Map,this.#t=!1}#c(){let e={pool:this.#e,batchSize:U.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_SIZE,batchDelay:U.BATCH_CONFIG.REFERENCE_PROCESSOR.BATCH_DELAY};this.#a=new uc(e),this.#o=new dc(e)}#l(e){this.#n.has(e)||this.#n.set(e,{zap:null}),this.#r.has(e)||this.#r.set(e,{isZapClosed:!1})}#u(e,t,n,r){this.#n.get(e).zap=this.#e.subscribeMany(t.relayUrls,[n.req],r)}#d(e){return e&&e.id&&Array.isArray(e.tags)}#f(e,t){return e&&this.#i.delete(e),null}async connectToRelays(e){this.#t||=([this.#a,this.#o].forEach((t=>t.setRelayUrls(e))),!0)}subscribeToZaps(e,t,n,r){try{this.#p(n),this.#l(e),this.#r.get(e).isZapClosed=!1,this.#u(e,t,n,this.#m(r))}catch(e){this.#h(`Subscription error`,e)}}#p(e){if(!e?.req?.kinds||!Array.isArray(e.req.kinds))throw Error(`Invalid subscription settings`)}async fetchReference(e,t,n){try{if(!this.#d(t))return null;let e=t.tags.find((e=>Array.isArray(e)&&e[0]===n));if(!e)return null;let r=n===`e`?e[1]:`${e[1]}`,i=W.getReference(r);if(i)return i;let a=this.#i.get(r);if(a)return a;let o=n===`e`?this.#a:this.#o;try{let e=await o.getOrCreateFetchPromise(r);return e&&W.setReference(r,e),this.#i.delete(r),e}finally{this.#i.delete(r)}}catch(e){return this.#f(t?.id,e)}}#m(e){let t=Math.floor(Date.now()/1e3);return{...e,onevent:n=>{n.isRealTimeEvent=n.created_at>=t,e.onevent(n)},oneose:e.oneose}}#h(e,t){throw t}get zapPool(){return this.#e}},{zapPool:zc}=Rc,Bc=new class{constructor(){this.viewConfigs=new Map,this.configStore=new Map,this.observers=new Map,this.#e=new Map,this.#t=new Map}#e;#t;setZapListUI(e){this.zapListUI=e}setViewConfig(e,t){this.viewConfigs.set(e,t),Mc.viewConfigs.set(e,t),W.initializeZapView(e)}getViewConfig(e){return this.viewConfigs.get(e)}async updateEventReference(e,t){try{let n=this.getViewConfig(t);if(!n?.relayUrls?.length||ic(n?.identifier||``))return!1;let r=await this._fetchEventReference(e,n);return!!r&&(e.reference=r,!0)}catch{return!1}}async _fetchEventReference(e,t){let n=async()=>{if(!e?.tags||!Array.isArray(e.tags))return null;try{if(e.tags.find((e=>Array.isArray(e)&&e[0]===`a`))?.[1])return await Rc.fetchReference(t.relayUrls,e,`a`);let n=e.tags.find((e=>Array.isArray(e)&&e[0]===`e`));return n?.[1]&&/^[0-9a-f]{64}$/.test(n[1].toLowerCase())?await Rc.fetchReference(t.relayUrls,e,`e`):null}catch{return null}};try{return await W.getOrFetchReference(e.id,n)}catch{return null}}async updateEventReferenceBatch(e,t){let n=this.getViewConfig(t);if(!n?.relayUrls?.length||ic(n?.identifier||``))return;let r=e.map((e=>this.updateEventReference(e,t)));await Promise.allSettled(r)}updateUIReferences(e){this.zapListUI&&e.forEach((e=>{e.reference&&this.zapListUI.updateZapReference(e)}))}async initializeSubscriptions(e,t){try{if(!this._isValidFilter(e))throw Error(`Invalid filter settings`);let n=Zs(e.identifier);if(!n)throw Error(U.ZAP_CONFIG.ERRORS.DECODE_FAILED);this._initializeLoadState(t),this._showInitialLoadingSpinner(t);let{batchEvents:r,lastEventTime:i}=await this._collectInitialEvents(t,e,n);r?.length>0&&this._processBatchEvents(r,t).catch(console.error),await this.finalizeInitialization(t,i)}catch(e){throw e}}_showInitialLoadingSpinner(e){let t=this._getListElement(e);if(t){let e=this._createLoadTrigger();t.appendChild(e)}}async finalizeInitialization(e,t){let n=W.getZapEvents(e),r=this._getListElement(e),i=W.updateLoadState(e,{isInitialFetchComplete:!0,lastEventTime:t});await Promise.all([i,n.length===0?this.zapListUI?.showNoZapsMessage():null,n.length>=U.REQ_CONFIG.INITIAL_LOAD_COUNT?this.setupInfiniteScroll(e):null]),r?.querySelector(`.load-more-trigger`)?.remove()}_initializeLoadState(e){W.updateLoadState(e,{isInitialFetchComplete:!1,lastEventTime:null,isLoading:!1})}_isValidFilter(e){return e&&e.relayUrls&&Array.isArray(e.relayUrls)&&e.relayUrls.length>0&&e.identifier}setupInfiniteScroll(e){try{this._cleanupInfiniteScroll(e);let t=this._getListElement(e);if(!t)return;let n=this._createLoadTrigger();t.appendChild(n),this._observeLoadTrigger(n,e,t)}catch{}}_createLoadTrigger(){let e=document.createElement(`div`);e.className=`load-more-trigger`;let t=document.createElement(`div`);return t.className=`loading-spinner`,e.appendChild(t),e}_observeLoadTrigger(e,t,n){let r=new IntersectionObserver((e=>this._handleIntersection(e[0],t)),{root:n,rootMargin:U.INFINITE_SCROLL.ROOT_MARGIN,threshold:U.INFINITE_SCROLL.THRESHOLD});r.observe(e),this.observers.set(t,r)}async _handleIntersection(e,t){e.isIntersecting&&(W.getLoadState(t).isLoading?setTimeout((()=>{e.isIntersecting&&this._handleIntersection(e,t)}),U.INFINITE_SCROLL.RETRY_DELAY):this.loadMoreZaps(t).then((e=>{e===0&&this._cleanupInfiniteScroll(t)})).catch((e=>{this._cleanupInfiniteScroll(t)})))}_cleanupInfiniteScroll(e){let t=this.observers.get(e);t&&(t.disconnect(),this._getListElement(e)?.querySelector(`.load-more-trigger`)?.remove(),this.observers.delete(e))}_getListElement(e){return document.querySelector(`nzv-dialog[data-view-id="${e}"]`)?.shadowRoot?.querySelector(`.dialog-zap-list`)}async loadMoreZaps(e){let t=W.getLoadState(e),n=this.getViewConfig(e);if(!this._canLoadMore(t,n))return 0;t.isLoading=!0;try{let r=await this._executeLoadMore(e,t,n);if(r>0){let t=W.getZapEvents(e).slice(-r);await this.updateEventReferenceBatch(t,e),this.updateUIReferences(t)}return r}finally{t.isLoading=!1}}async _executeLoadMore(e,t,n){let r=Zs(n.identifier,t.lastEventTime);if(!r)return 0;let i=[],a=setTimeout((()=>{i.length===0&&this._cleanupInfiniteScroll(e)}),U.LOAD_TIMEOUT);try{return await this._collectEvents(e,n,r,i,U.REQ_CONFIG.ADDITIONAL_LOAD_COUNT,t),i.length>0&&await this._processBatchEvents(i,e),i.length}catch{return 0}finally{clearTimeout(a)}}async _collectEvents(e,t,n,r,i,a){return new Promise(((o,s)=>{let c=setTimeout((()=>s(Error(`Load timeout`))),U.LOAD_TIMEOUT);Rc.subscribeToZaps(e,t,n,{onevent:e=>{e.created_at<a.lastEventTime&&(r.push(e),a.lastEventTime=Math.min(a.lastEventTime,e.created_at),r.length>=i&&(clearTimeout(c),o()))},oneose:()=>{clearTimeout(c),o()}})}))}async _collectInitialEvents(e,t,n){let r=[],i=null;return new Promise((a=>{let o=this._setupBufferInterval(r,e),s=Rc.subscribeToZaps(e,t,n,{onevent:t=>{let n=this._handleInitialEvent(t,r,i,e);n!==null&&(i=n)},oneose:()=>{clearInterval(o),a({batchEvents:[...r],lastEventTime:i})}});this.#e.set(e,{zap:s})}))}_handleInitialEvent(e,t,n,r){let i=Math.min(n||e.created_at,e.created_at);if(W.addZapEvent(r,e)){if(t.push(e),this.updateEventReference(e,r).then((t=>{t&&this.zapListUI&&e.reference&&this.zapListUI.updateZapReference(e)})),e.isRealTimeEvent){let t=this.getViewConfig(r);Lc.handleZapEvent(e,r,t?.identifier),this.zapListUI&&this.zapListUI.prependZap(e).catch(console.error)}t.length>=U.BATCH_SIZE&&this.zapListUI&&this.zapListUI.batchUpdate(W.getZapEvents(r)).catch(console.error)}return i}async _processBatchEvents(e,t){if(e?.length){e.sort(((e,t)=>t.created_at-e.created_at)),e.forEach((e=>W.addZapEvent(t,e)));try{await Promise.all([Ac.processBatchProfiles(e)])}catch{}await this._updateUI(e,t)}}async _updateUI(e,t){this.zapListUI&&await this.zapListUI.batchUpdate(e,{isFullUpdate:!0})}_setupBufferInterval(e,t){let n=0,r=U.BUFFER_MIN_INTERVAL;return setInterval((()=>{let i=Date.now();e.length>0&&i-n>=r&&this.zapListUI&&(this.zapListUI.batchUpdate(W.getZapEvents(t),{isBufferUpdate:!0}).catch(console.error),n=i)}),U.BUFFER_INTERVAL)}_canLoadMore(e,t){return t&&!e.isLoading&&e.lastEventTime}unsubscribe(e){try{let t=this.#e.get(e);t?.zap&&(t.zap(),t.zap=null),this.#t.set(e,{isZapClosed:!0}),this._cleanupInfiniteScroll(e)}catch{}}},Vc=class extends HTMLElement{#e;#t;constructor(){super(),this.attachShadow({mode:`open`}),this.#e={isInitialized:!1,theme:U.DEFAULT_OPTIONS.theme},this.popStateHandler=e=>{e.preventDefault(),this.#s(`.dialog`)?.open&&this.closeDialog()}}async connectedCallback(){if(this.viewId=this.getAttribute(`data-view-id`),this.viewId){this.#t=this.#n();try{await this.#t,this.#e.isInitialized=!0;let e=Bc.getViewConfig(this.viewId);if(!e)throw Error(`Config is required for initialization`);if(await this.#r(e),this.getAttribute(`data-nzv-id`)){let e=await Lc.getCurrentStats(this.viewId);e&&this.statsUI.displayStats(e)}this.#e.isInitialized=!0,this.dispatchEvent(new CustomEvent(`dialog-initialized`,{detail:{viewId:this.viewId}}))}catch{}}}async#n(){return new Promise((e=>{let t=document.createElement(`template`);t.innerHTML=Mc.getDialogTemplate(),this.shadowRoot.appendChild(t.content.cloneNode(!0)),this.#i(),queueMicrotask((()=>e()))}))}async#r(e){let t=document.createElement(`style`);t.textContent=Ic(),this.shadowRoot.appendChild(t),this.statsUI=new cc(this.shadowRoot),this.profileUI=new jc,this.zapListUI=new Pc(this.shadowRoot,this.profileUI,this.viewId,e),Bc.setZapListUI(this.zapListUI);let n=W.getZapEvents(this.viewId);n?.length?await this.zapListUI.renderZapListFromCache(n):this.zapListUI.showNoZapsMessage();let r=this.getAttribute(`data-nzv-id`);if(r){let e=await W.getCachedStats(this.viewId,r);if(e?.stats)this.statsUI.displayStats(e.stats);else{let e=await Lc.getCurrentStats(this.viewId);e&&this.statsUI.displayStats(e)}}}static get observedAttributes(){return[`data-theme`]}#i(){let e=this.#s(`.dialog`);this.#s(`.close-dialog-button`).addEventListener(`click`,(()=>this.closeDialog())),e.addEventListener(`click`,(t=>{t.target===e&&this.closeDialog()})),e.addEventListener(`cancel`,(e=>{e.preventDefault(),this.closeDialog()})),document.addEventListener(`keydown`,(t=>{if(e?.open){if(t.key===`Escape`)this.closeDialog();else if(t.key===` `){t.preventDefault();let e=this.#s(`.dialog-zap-list`);e&&(e.scrollTop+=.8*e.clientHeight)}}}))}attributeChangedCallback(e,t,n){t!==n&&e===`data-theme`&&this.#a(n)}#a(e){W.updateThemeState(this.viewId,{theme:e}).isInitialized&&this.#o()}#o(){let e=W.getThemeState(this.viewId).theme===`dark`?`dark-theme`:`light-theme`;this.shadowRoot.host.classList.add(e)}async showDialog(){await this.#t;let e=this.#s(`.dialog`);e&&!e.open&&this.#e.isInitialized&&(window.addEventListener(`popstate`,this.popStateHandler),e.showModal(),queueMicrotask((()=>{document.activeElement&&document.activeElement.blur()})),this.#c())}closeDialog(){let e=this.#s(`.dialog`);e?.open&&(this.zapListUI?.destroy(),Bc.unsubscribe(this.viewId),e.close(),this.remove(),window.removeEventListener(`popstate`,this.popStateHandler))}displayZapStats(e){this.statsUI.displayStats(e)}#s(e){return this.shadowRoot.querySelector(e)}#c(){let e=this.getAttribute(`data-view-id`),t=document.querySelector(`button[data-zap-view-id="${e}"]`);if(!t)return;let n=this.#s(`.dialog-title`),r=this.#s(`.dialog-title a`);if(!r||!n)return;let i=t.getAttribute(`data-title`),a=t.getAttribute(`data-nzv-id`);r.href=a?`https://njump.me/${a}`:`#`,i?.trim()?(r.textContent=i,n.classList.add(`custom-title`)):(r.textContent=U.DIALOG_CONFIG.DEFAULT_TITLE+tc(a),n.classList.remove(`custom-title`))}getOperations(){if(!this.#e.isInitialized)return null;let e={closeDialog:()=>this.closeDialog(),showDialog:()=>this.showDialog()};return this.#e.isInitialized&&Object.assign(e,{prependZap:e=>this.zapListUI?.prependZap(e),displayZapStats:e=>this.statsUI?.displayStats(e),showNoZapsMessage:()=>this.zapListUI?.showNoZapsMessage()}),e}async waitForInitialization(){return this.#t}};customElements.define(`nzv-dialog`,Vc);var Hc={create:async(e,t)=>{if(!e||!t)return Promise.reject(Error(`Invalid viewId or config`));Bc.setViewConfig(e,t);let n=document.querySelector(`nzv-dialog[data-view-id="${e}"]`);if(n)return n;let r=document.createElement(`nzv-dialog`);r.setAttribute(`data-view-id`,e),r.setAttribute(`data-config`,JSON.stringify(t));let i=document.querySelector(`button[data-zap-view-id="${e}"]`);return i?.getAttribute(`data-nzv-id`)&&r.setAttribute(`data-nzv-id`,i.getAttribute(`data-nzv-id`)),document.body.appendChild(r),await r.waitForInitialization(),r},get:e=>document.querySelector(`nzv-dialog[data-view-id="${e}"]`),execute:(e,t,...n)=>{let r=Hc.get(e)?.getOperations();return r?r[t]?.(...n)??null:null}},Uc=(e,t)=>Hc.execute(t,`displayZapStats`,e);async function Wc(e,t){try{let n=Is.fromButton(e);if(!n)throw Error(`Failed to create config from button`);if(Bc.setViewConfig(t,n),!await async function(e){try{let t=Bc.getViewConfig(e);if(!t)throw Error(`View configuration not found for viewId: ${e}`);return Bc.setViewConfig(e,t),await Hc.create(e,t)}catch{return null}}(t))throw Error(U.ZAP_CONFIG.ERRORS.DIALOG_NOT_FOUND);await async function(e){try{let t=Hc.get(e);if(!t)throw Error(`Dialog not found`);await t.waitForInitialization();let n=t.getOperations();if(!n?.showDialog)throw Error(`Basic dialog operations not available`);n.showDialog()}catch{}}(t),setTimeout((async()=>{if(await async function(e,t){let n=W.getZapEvents(e);if(n.length>0){let e=[...new Set(n.map((e=>e.pubkey)))];Ac.fetchProfiles(e)}let{hasEnoughCachedEvents:r}=await W.processCachedData(e,t);return r&&Bc.setupInfiniteScroll(e),r}(t,n),!e.hasAttribute(`data-initialized`)){let r=e.getAttribute(`data-nzv-id`);await Promise.all([Rc.connectToRelays(n.relayUrls),Bc.initializeSubscriptions(n,t),r?Lc.initializeStats(r,t,!0):Promise.resolve()]),e.setAttribute(`data-initialized`,`true`)}}),0)}catch{}}function Gc(){Object.entries(U.LIBRARIES).forEach((([e,t])=>{window[e]=t})),document.querySelectorAll(`button[data-nzv-id]`).forEach(((e,t)=>{if(e.hasAttribute(`data-zap-view-id`))return;let n=`nostr-zap-view-${t}`;e.setAttribute(`data-zap-view-id`,n),e.hasAttribute(`data-zap-color-mode`)||e.setAttribute(`data-zap-color-mode`,U.ZAP_CONFIG.DEFAULT_COLOR_MODE),e.addEventListener(`click`,(()=>Wc(e,n)))}))}function Kc(e={}){Object.assign(U,e),typeof window<`u`&&Gc()}function qc(e={}){return Kc(e)}typeof window<`u`&&document.addEventListener(`DOMContentLoaded`,Gc),r.vQ,r.ZM,r.yk,r.h0,r.n_;var Jc=r.Xz;r.Uv,r.fU,r.Dw;var Yc=globalThis;function Xc(e){return e&&e.__esModule?e.default:e}var Zc={},Qc={},$c=Yc.parcelRequire1faa;$c??($c=function(e){if(e in Zc)return Zc[e].exports;if(e in Qc){var t=Qc[e];delete Qc[e];var n={id:e,exports:{}};return Zc[e]=n,t.call(n.exports,n,n.exports),n.exports}var r=Error(`Cannot find module '`+e+`'`);throw r.code=`MODULE_NOT_FOUND`,r},$c.register=function(e,t){Qc[e]=t},Yc.parcelRequire1faa=$c);var el=$c.register;el(`58QMB`,function(e,t){(function(){function t(e,t){var n,r=Object.keys(t);for(n=0;n<r.length;n++)e=e.replace(RegExp(`\\{`+r[n]+`\\}`,`gi`),t[r[n]]);return e}function n(e){var t,n,r;if(!e)throw Error(`cannot create a random attribute name for an undefined object`);t=`ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz`,n=``;do for(n=``,r=0;r<12;r++)n+=t[Math.floor(Math.random()*t.length)];while(e[n]);return n}function r(e){var t={left:`start`,right:`end`,center:`middle`,start:`start`,end:`end`};return t[e]||t.start}function i(e){var t={alphabetic:`alphabetic`,hanging:`hanging`,top:`text-before-edge`,bottom:`text-after-edge`,middle:`central`};return t[e]||t.alphabetic}var a,o,s,c,l=function(e,t){var n,r,i,a={};for(e=e.split(`,`),t||=10,n=0;n<e.length;n+=2)r=`&`+e[n+1]+`;`,i=parseInt(e[n],t),a[r]=`&#`+i+`;`;return a[`\\xa0`]=`&#160;`,a}(`50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,t9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro`,32);a={strokeStyle:{svgAttr:`stroke`,canvas:`#000000`,svg:`none`,apply:`stroke`},fillStyle:{svgAttr:`fill`,canvas:`#000000`,svg:null,apply:`fill`},lineCap:{svgAttr:`stroke-linecap`,canvas:`butt`,svg:`butt`,apply:`stroke`},lineJoin:{svgAttr:`stroke-linejoin`,canvas:`miter`,svg:`miter`,apply:`stroke`},miterLimit:{svgAttr:`stroke-miterlimit`,canvas:10,svg:4,apply:`stroke`},lineWidth:{svgAttr:`stroke-width`,canvas:1,svg:1,apply:`stroke`},globalAlpha:{svgAttr:`opacity`,canvas:1,svg:1,apply:`fill stroke`},font:{canvas:`10px sans-serif`},shadowColor:{canvas:`#000000`},shadowOffsetX:{canvas:0},shadowOffsetY:{canvas:0},shadowBlur:{canvas:0},textAlign:{canvas:`start`},textBaseline:{canvas:`alphabetic`},lineDash:{svgAttr:`stroke-dasharray`,canvas:[],svg:null,apply:`stroke`}},s=function(e,t){this.__root=e,this.__ctx=t},s.prototype.addColorStop=function(e,n){var r,i,a=this.__ctx.__createElement(`stop`);a.setAttribute(`offset`,e),n.indexOf(`rgba`)===-1?a.setAttribute(`stop-color`,n):(r=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi,i=r.exec(n),a.setAttribute(`stop-color`,t(`rgb({r},{g},{b})`,{r:i[1],g:i[2],b:i[3]})),a.setAttribute(`stop-opacity`,i[4])),this.__root.appendChild(a)},c=function(e,t){this.__root=e,this.__ctx=t},o=function(e){var t,n={width:500,height:500,veiwBoxWidth:500,veiwBoxHeight:500,enableMirroring:!1};if(arguments.length>1?(t=n,t.width=arguments[0],t.height=arguments[1],t.veiwBoxWidth=arguments[2],t.veiwBoxHeight=arguments[3]):t=e||n,!(this instanceof o))return new o(t);this.width=t.width||n.width,this.height=t.height||n.height,this.veiwBoxWidth=t.veiwBoxWidth||this.width,this.veiwBoxHeight=t.veiwBoxHeight||this.height,this.enableMirroring=t.enableMirroring===void 0?n.enableMirroring:t.enableMirroring,this.canvas=this,this.__document=t.document||document,t.ctx?this.__ctx=t.ctx:(this.__canvas=this.__document.createElement(`canvas`),this.__ctx=this.__canvas.getContext(`2d`)),this.__setDefaultStyles(),this.__stack=[this.__getStyleState()],this.__groupStack=[],this.__root=this.__document.createElementNS(`http://www.w3.org/2000/svg`,`svg`),this.__root.setAttribute(`version`,1.1),this.__root.setAttribute(`xmlns`,`http://www.w3.org/2000/svg`),this.__root.setAttributeNS(`http://www.w3.org/2000/xmlns/`,`xmlns:xlink`,`http://www.w3.org/1999/xlink`),this.__root.setAttribute(`width`,this.width),this.__root.setAttribute(`height`,this.height),this.__root.setAttribute(`viewBox`,`0 0 `+this.veiwBoxWidth+` `+this.veiwBoxHeight),this.__ids={},this.__defs=this.__document.createElementNS(`http://www.w3.org/2000/svg`,`defs`),this.__root.appendChild(this.__defs),this.__currentElement=this.__document.createElementNS(`http://www.w3.org/2000/svg`,`g`),this.__root.appendChild(this.__currentElement)},o.prototype.__createElement=function(e,t,n){t===void 0&&(t={});var r,i,a=this.__document.createElementNS(`http://www.w3.org/2000/svg`,e),o=Object.keys(t);for(n&&(a.setAttribute(`fill`,`none`),a.setAttribute(`stroke`,`none`)),r=0;r<o.length;r++)i=o[r],a.setAttribute(i,t[i]);return a},o.prototype.__setDefaultStyles=function(){var e,t,n=Object.keys(a);for(e=0;e<n.length;e++)t=n[e],this[t]=a[t].canvas},o.prototype.__applyStyleState=function(e){var t,n,r=Object.keys(e);for(t=0;t<r.length;t++)n=r[t],this[n]=e[n]},o.prototype.__getStyleState=function(){var e,t,n={},r=Object.keys(a);for(e=0;e<r.length;e++)t=r[e],n[t]=this[t];return n},o.prototype.__applyStyleToCurrentElement=function(e){var n=this.__currentElement,r=this.__currentElementsToStyle;r&&(n.setAttribute(e,``),n=r.element,r.children.forEach(function(t){t.setAttribute(e,``)}));var i,o,l,u,d,f,p=Object.keys(a);for(i=0;i<p.length;i++)if(o=a[p[i]],l=this[p[i]],o.apply){if(l instanceof c){if(l.__ctx)for(;l.__ctx.__defs.childNodes.length;)u=l.__ctx.__defs.childNodes[0].getAttribute(`id`),this.__ids[u]=u,this.__defs.appendChild(l.__ctx.__defs.childNodes[0]);n.setAttribute(o.apply,t(`url(#{id})`,{id:l.__root.getAttribute(`id`)}))}else if(l instanceof s)n.setAttribute(o.apply,t(`url(#{id})`,{id:l.__root.getAttribute(`id`)}));else if(o.apply.indexOf(e)!==-1&&o.svg!==l){if(o.svgAttr!==`stroke`&&o.svgAttr!==`fill`||l.indexOf(`rgba`)===-1){var m=o.svgAttr;if(p[i]===`globalAlpha`&&(m=e+`-`+o.svgAttr,n.getAttribute(m)))continue;n.setAttribute(m,l)}else{d=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi,f=d.exec(l),n.setAttribute(o.svgAttr,t(`rgb({r},{g},{b})`,{r:f[1],g:f[2],b:f[3]}));var h=f[4],g=this.globalAlpha;g!=null&&(h*=g),n.setAttribute(o.svgAttr+`-opacity`,h)}}}},o.prototype.__closestGroupOrSvg=function(e){return e||=this.__currentElement,e.nodeName===`g`||e.nodeName===`svg`?e:this.__closestGroupOrSvg(e.parentNode)},o.prototype.getSerializedSvg=function(e){var t,n,r,i,a,o,s=new XMLSerializer().serializeToString(this.__root);if(o=/xmlns="http:\/\/www\.w3\.org\/2000\/svg".+xmlns="http:\/\/www\.w3\.org\/2000\/svg/gi,o.test(s)&&(s=s.replace(`xmlns="http://www.w3.org/2000/svg`,`xmlns:xlink="http://www.w3.org/1999/xlink`)),e)for(t=Object.keys(l),n=0;n<t.length;n++)r=t[n],i=l[r],a=new RegExp(r,`gi`),a.test(s)&&(s=s.replace(a,i));return s},o.prototype.getSvg=function(){return this.__root},o.prototype.save=function(){var e=this.__createElement(`g`),t=this.__closestGroupOrSvg();this.__groupStack.push(t),t.appendChild(e),this.__currentElement=e,this.__stack.push(this.__getStyleState())},o.prototype.restore=function(){this.__currentElement=this.__groupStack.pop(),this.__currentElementsToStyle=null,this.__currentElement||=this.__root.childNodes[1];var e=this.__stack.pop();this.__applyStyleState(e)},o.prototype.__addTransform=function(e){var t=this.__closestGroupOrSvg();if(t.childNodes.length>0){this.__currentElement.nodeName===`path`&&(this.__currentElementsToStyle||={element:t,children:[]},this.__currentElementsToStyle.children.push(this.__currentElement),this.__applyCurrentDefaultPath());var n=this.__createElement(`g`);t.appendChild(n),this.__currentElement=n}var r=this.__currentElement.getAttribute(`transform`);r?r+=` `:r=``,r+=e,this.__currentElement.setAttribute(`transform`,r)},o.prototype.scale=function(e,n){n===void 0&&(n=e),this.__addTransform(t(`scale({x},{y})`,{x:e,y:n}))},o.prototype.rotate=function(e){var n=180*e/Math.PI;this.__addTransform(t(`rotate({angle},{cx},{cy})`,{angle:n,cx:0,cy:0}))},o.prototype.translate=function(e,n){this.__addTransform(t(`translate({x},{y})`,{x:e,y:n}))},o.prototype.transform=function(e,n,r,i,a,o){this.__addTransform(t(`matrix({a},{b},{c},{d},{e},{f})`,{a:e,b:n,c:r,d:i,e:a,f:o}))},o.prototype.beginPath=function(){var e,t;this.__currentDefaultPath=``,this.__currentPosition={},e=this.__createElement(`path`,{},!0),t=this.__closestGroupOrSvg(),t.appendChild(e),this.__currentElement=e},o.prototype.__applyCurrentDefaultPath=function(){var e=this.__currentElement;e.nodeName===`path`?e.setAttribute(`d`,this.__currentDefaultPath):console.error(`Attempted to apply path command to node`,e.nodeName)},o.prototype.__addPathCommand=function(e){this.__currentDefaultPath+=` `,this.__currentDefaultPath+=e},o.prototype.moveTo=function(e,n){this.__currentElement.nodeName!==`path`&&this.beginPath(),this.__currentPosition={x:e,y:n},this.__addPathCommand(t(`M {x} {y}`,{x:e,y:n}))},o.prototype.closePath=function(){this.__currentDefaultPath&&this.__addPathCommand(`Z`)},o.prototype.lineTo=function(e,n){this.__currentPosition={x:e,y:n},this.__currentDefaultPath.indexOf(`M`)>-1?this.__addPathCommand(t(`L {x} {y}`,{x:e,y:n})):this.__addPathCommand(t(`M {x} {y}`,{x:e,y:n}))},o.prototype.bezierCurveTo=function(e,n,r,i,a,o){this.__currentPosition={x:a,y:o},this.__addPathCommand(t(`C {cp1x} {cp1y} {cp2x} {cp2y} {x} {y}`,{cp1x:e,cp1y:n,cp2x:r,cp2y:i,x:a,y:o}))},o.prototype.quadraticCurveTo=function(e,n,r,i){this.__currentPosition={x:r,y:i},this.__addPathCommand(t(`Q {cpx} {cpy} {x} {y}`,{cpx:e,cpy:n,x:r,y:i}))};var u=function(e){var t=Math.sqrt(e[0]*e[0]+e[1]*e[1]);return[e[0]/t,e[1]/t]};o.prototype.arcTo=function(e,t,n,r,i){var a=this.__currentPosition&&this.__currentPosition.x,o=this.__currentPosition&&this.__currentPosition.y;if(a!==void 0&&o!==void 0){if(i<0)throw Error(`IndexSizeError: The radius provided (`+i+`) is negative.`);if(a===e&&o===t||e===n&&t===r||i===0)return void this.lineTo(e,t);var s=u([a-e,o-t]),c=u([n-e,r-t]);if(s[0]*c[1]==s[1]*c[0])return void this.lineTo(e,t);var l=s[0]*c[0]+s[1]*c[1],d=Math.acos(Math.abs(l)),f=u([s[0]+c[0],s[1]+c[1]]),p=i/Math.sin(d/2),m=e+p*f[0],h=t+p*f[1],g=[-s[1],s[0]],_=[c[1],-c[0]],v=function(e){var t=e[0];return e[1]>=0?Math.acos(t):-Math.acos(t)},y=v(g),b=v(_);this.lineTo(m+g[0]*i,h+g[1]*i),this.arc(m,h,i,y,b)}},o.prototype.stroke=function(){this.__currentElement.nodeName===`path`&&this.__currentElement.setAttribute(`paint-order`,`fill stroke markers`),this.__applyCurrentDefaultPath(),this.__applyStyleToCurrentElement(`stroke`)},o.prototype.fill=function(){this.__currentElement.nodeName===`path`&&this.__currentElement.setAttribute(`paint-order`,`stroke fill markers`),this.__applyCurrentDefaultPath(),this.__applyStyleToCurrentElement(`fill`)},o.prototype.rect=function(e,t,n,r){this.__currentElement.nodeName!==`path`&&this.beginPath(),this.moveTo(e,t),this.lineTo(e+n,t),this.lineTo(e+n,t+r),this.lineTo(e,t+r),this.lineTo(e,t),this.closePath()},o.prototype.fillRect=function(e,t,n,r){var i=this.__createElement(`rect`,{x:e,y:t,width:n,height:r,"shape-rendering":`crispEdges`},!0);this.__closestGroupOrSvg().appendChild(i),this.__currentElement=i,this.__applyStyleToCurrentElement(`fill`)},o.prototype.strokeRect=function(e,t,n,r){var i=this.__createElement(`rect`,{x:e,y:t,width:n,height:r},!0);this.__closestGroupOrSvg().appendChild(i),this.__currentElement=i,this.__applyStyleToCurrentElement(`stroke`)},o.prototype.__clearCanvas=function(){for(var e=this.__closestGroupOrSvg().getAttribute(`transform`),t=this.__root.childNodes[1],n=t.childNodes,r=n.length-1;r>=0;r--)n[r]&&t.removeChild(n[r]);this.__currentElement=t,this.__groupStack=[],e&&this.__addTransform(e)},o.prototype.clearRect=function(e,t,n,r){if(e===0&&t===0&&n===this.width&&r===this.height)return void this.__clearCanvas();var i,a=this.__closestGroupOrSvg();i=this.__createElement(`rect`,{x:e,y:t,width:n,height:r,fill:`#FFFFFF`},!0),a.appendChild(i)},o.prototype.createLinearGradient=function(e,t,r,i){var a=this.__createElement(`linearGradient`,{id:n(this.__ids),x1:e+`px`,x2:r+`px`,y1:t+`px`,y2:i+`px`,gradientUnits:`userSpaceOnUse`},!1);return this.__defs.appendChild(a),new s(a,this)},o.prototype.createRadialGradient=function(e,t,r,i,a,o){var c=this.__createElement(`radialGradient`,{id:n(this.__ids),cx:i+`px`,cy:a+`px`,r:o+`px`,fx:e+`px`,fy:t+`px`,gradientUnits:`userSpaceOnUse`},!1);return this.__defs.appendChild(c),new s(c,this)},o.prototype.__parseFont=function(){var e=/^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\'\"\sa-z0-9]+?)\s*$/i.exec(this.font),t={style:e[1]||`normal`,size:e[4]||`10px`,family:e[6]||`sans-serif`,weight:e[3]||`normal`,decoration:e[2]||`normal`,href:null};return this.__fontUnderline===`underline`&&(t.decoration=`underline`),this.__fontHref&&(t.href=this.__fontHref),t},o.prototype.__wrapTextLink=function(e,t){if(e.href){var n=this.__createElement(`a`);return n.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,e.href),n.appendChild(t),n}return t},o.prototype.__applyText=function(e,t,n,a){var o=this.__parseFont(),s=this.__closestGroupOrSvg(),c=this.__createElement(`text`,{"font-family":o.family,"font-size":o.size,"font-style":o.style,"font-weight":o.weight,"text-decoration":o.decoration,x:t,y:n,"text-anchor":r(this.textAlign),"dominant-baseline":i(this.textBaseline)},!0);c.appendChild(this.__document.createTextNode(e)),this.__currentElement=c,this.__applyStyleToCurrentElement(a),s.appendChild(this.__wrapTextLink(o,c))},o.prototype.fillText=function(e,t,n){this.__applyText(e,t,n,`fill`)},o.prototype.strokeText=function(e,t,n){this.__applyText(e,t,n,`stroke`)},o.prototype.measureText=function(e){return this.__ctx.font=this.font,this.__ctx.measureText(e)},o.prototype.arc=function(e,n,r,i,a,o){if(i!==a){i%=2*Math.PI,a%=2*Math.PI,i===a&&(a=(a+2*Math.PI-.001*(o?-1:1))%(2*Math.PI));var s=e+r*Math.cos(a),c=n+r*Math.sin(a),l=e+r*Math.cos(i),u=n+r*Math.sin(i),d=+!o,f=0,p=a-i;p<0&&(p+=2*Math.PI),f=o?p>Math.PI?0:1:+(p>Math.PI),this.lineTo(l,u),this.__addPathCommand(t(`A {rx} {ry} {xAxisRotation} {largeArcFlag} {sweepFlag} {endX} {endY}`,{rx:r,ry:r,xAxisRotation:0,largeArcFlag:f,sweepFlag:d,endX:s,endY:c})),this.__currentPosition={x:s,y:c}}},o.prototype.clip=function(){var e=this.__closestGroupOrSvg(),r=this.__createElement(`clipPath`),i=n(this.__ids),a=this.__createElement(`g`);this.__applyCurrentDefaultPath(),e.removeChild(this.__currentElement),r.setAttribute(`id`,i),r.appendChild(this.__currentElement),this.__defs.appendChild(r),e.setAttribute(`clip-path`,t(`url(#{id})`,{id:i})),e.appendChild(a),this.__currentElement=a},o.prototype.drawImage=function(){var e,t,n,r,i,a,s,c,l,u,d,f,p,m,h=Array.prototype.slice.call(arguments),g=h[0],_=0,v=0;if(h.length===3)e=h[1],t=h[2],i=g.width,a=g.height,n=i,r=a;else if(h.length===5)e=h[1],t=h[2],n=h[3],r=h[4],i=g.width,a=g.height;else{if(h.length!==9)throw Error(`Invalid number of arguments passed to drawImage: `+arguments.length);_=h[1],v=h[2],i=h[3],a=h[4],e=h[5],t=h[6],n=h[7],r=h[8]}s=this.__closestGroupOrSvg(),this.__currentElement;var y=`translate(`+e+`, `+t+`)`;if(g instanceof o){if(c=g.getSvg().cloneNode(!0),c.childNodes&&c.childNodes.length>1){for(l=c.childNodes[0];l.childNodes.length;)m=l.childNodes[0].getAttribute(`id`),this.__ids[m]=m,this.__defs.appendChild(l.childNodes[0]);if(u=c.childNodes[1]){var b,x=u.getAttribute(`transform`);b=x?x+` `+y:y,u.setAttribute(`transform`,b),s.appendChild(u)}}}else g.nodeName!==`CANVAS`&&g.nodeName!==`IMG`||(d=this.__createElement(`image`),d.setAttribute(`width`,n),d.setAttribute(`height`,r),d.setAttribute(`preserveAspectRatio`,`none`),d.setAttribute(`opacity`,this.globalAlpha),(_||v||i!==g.width||a!==g.height)&&(f=this.__document.createElement(`canvas`),f.width=n,f.height=r,p=f.getContext(`2d`),p.drawImage(g,_,v,i,a,0,0,n,r),g=f),d.setAttribute(`transform`,y),d.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,g.nodeName===`CANVAS`?g.toDataURL():g.originalSrc),s.appendChild(d))},o.prototype.createPattern=function(e,t){var r,i=this.__document.createElementNS(`http://www.w3.org/2000/svg`,`pattern`),a=n(this.__ids);return i.setAttribute(`id`,a),i.setAttribute(`width`,e.width),i.setAttribute(`height`,e.height),e.nodeName===`CANVAS`||e.nodeName===`IMG`?(r=this.__document.createElementNS(`http://www.w3.org/2000/svg`,`image`),r.setAttribute(`width`,e.width),r.setAttribute(`height`,e.height),r.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,e.nodeName===`CANVAS`?e.toDataURL():e.getAttribute(`src`)),i.appendChild(r),this.__defs.appendChild(i)):e instanceof o&&(i.appendChild(e.__root.childNodes[1]),this.__defs.appendChild(i)),new c(i,this)},o.prototype.setLineDash=function(e){this.lineDash=e&&e.length>0?e.join(`,`):null},o.prototype.drawFocusRing=function(){},o.prototype.createImageData=function(){},o.prototype.getImageData=function(){},o.prototype.putImageData=function(){},o.prototype.globalCompositeOperation=function(){},o.prototype.setTransform=function(){},typeof window==`object`&&(window.C2S=o),typeof e.exports==`object`&&(e.exports=o)})(),(function(){function n(e,t,n){if(this.mode=v.MODE_8BIT_BYTE,this.data=e,this.parsedData=[],t){for(var r=0,i=this.data.length;r<i;r++){var a=[];a[0]=this.data.charCodeAt(r),this.parsedData.push(a)}this.parsedData=Array.prototype.concat.apply([],this.parsedData)}else this.parsedData=function(e){for(var t=[],n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t.push(r):r<2048?t.push(192|r>>6,128|63&r):r<55296||r>=57344?t.push(224|r>>12,128|r>>6&63,128|63&r):(n++,r=65536+((1023&r)<<10|1023&e.charCodeAt(n)),t.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|63&r))}return t}(e);this.parsedData=Array.prototype.concat.apply([],this.parsedData),n||this.parsedData.length==this.data.length||(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function r(e,t){this.typeNumber=e,this.errorCorrectLevel=t,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function i(e,t){if(e.length==u)throw Error(e.length+`/`+t);for(var n=0;n<e.length&&e[n]==0;)n++;this.num=Array(e.length-n+t);for(var r=0;r<e.length-n;r++)this.num[r]=e[r+n]}function a(e,t){this.totalCount=e,this.dataCount=t}function o(){this.buffer=[],this.length=0}function s(){var e=!1,t=navigator.userAgent;if(/android/i.test(t)){e=!0;var n=t.toString().match(/android ([0-9]\.[0-9])/i);n&&n[1]&&(e=parseFloat(n[1]))}return e}function c(e,t){for(var n=t.correctLevel,r=1,i=l(e),a=0,o=w.length;a<o;a++){var s=0;switch(n){case y.L:s=w[a][0];break;case y.M:s=w[a][1];break;case y.Q:s=w[a][2];break;case y.H:s=w[a][3]}if(i<=s)break;r++}if(r>w.length)throw Error(`Too long data. the CorrectLevel.`+[`M`,`L`,`H`,`Q`][n]+` limit length is `+s);return t.version!=0&&(r<=t.version?(r=t.version,t.runVersion=r):(console.warn(`QR Code version `+t.version+` too small, run version use `+r),t.runVersion=r)),r}function l(e){return encodeURI(e).toString().replace(/\%[0-9a-fA-F]{2}/g,`a`).length}var u,d,f=typeof Yc==`object`&&Yc&&Yc.Object===Object&&Yc,p=typeof self==`object`&&self&&self.Object===Object&&self,m=f||p||Function(`return this`)(),h=t&&!t.nodeType&&t,g=h&&e&&!e.nodeType&&e,_=m.QRCode;n.prototype={getLength:function(e){return this.parsedData.length},write:function(e){for(var t=0,n=this.parsedData.length;t<n;t++)e.put(this.parsedData[t],8)}},r.prototype={addData:function(e,t,r){var i=new n(e,t,r);this.dataList.push(i),this.dataCache=null},isDark:function(e,t){if(e<0||this.moduleCount<=e||t<0||this.moduleCount<=t)throw Error(e+`,`+t);return this.modules[e][t][0]},getEye:function(e,t){if(e<0||this.moduleCount<=e||t<0||this.moduleCount<=t)throw Error(e+`,`+t);var n=this.modules[e][t];if(n[1]){var r=`P`+n[1]+`_`+n[2];return n[2]==`A`&&(r=`A`+n[1]),{isDark:n[0],type:r}}return null},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(e,t){this.moduleCount=4*this.typeNumber+17,this.modules=Array(this.moduleCount);for(var n=0;n<this.moduleCount;n++){this.modules[n]=Array(this.moduleCount);for(var i=0;i<this.moduleCount;i++)this.modules[n][i]=[]}this.setupPositionProbePattern(0,0,`TL`),this.setupPositionProbePattern(this.moduleCount-7,0,`BL`),this.setupPositionProbePattern(0,this.moduleCount-7,`TR`),this.setupPositionAdjustPattern(`A`),this.setupTimingPattern(),this.setupTypeInfo(e,t),this.typeNumber>=7&&this.setupTypeNumber(e),this.dataCache??=r.createData(this.typeNumber,this.errorCorrectLevel,this.dataList),this.mapData(this.dataCache,t)},setupPositionProbePattern:function(e,t,n){for(var r=-1;r<=7;r++)if(!(e+r<=-1||this.moduleCount<=e+r))for(var i=-1;i<=7;i++)t+i<=-1||this.moduleCount<=t+i||(0<=r&&r<=6&&(i==0||i==6)||0<=i&&i<=6&&(r==0||r==6)||2<=r&&r<=4&&2<=i&&i<=4?(this.modules[e+r][t+i][0]=!0,this.modules[e+r][t+i][2]=n,this.modules[e+r][t+i][1]=r==-0||i==-0||r==6||i==6?`O`:`I`):this.modules[e+r][t+i][0]=!1)},getBestMaskPattern:function(){for(var e=0,t=0,n=0;n<8;n++){this.makeImpl(!0,n);var r=x.getLostPoint(this);(n==0||e>r)&&(e=r,t=n)}return t},createMovieClip:function(e,t,n){var r=e.createEmptyMovieClip(t,n);this.make();for(var i=0;i<this.modules.length;i++)for(var a=1*i,o=0;o<this.modules[i].length;o++){var s=1*o;this.modules[i][o][0]&&(r.beginFill(0,100),r.moveTo(s,a),r.lineTo(s+1,a),r.lineTo(s+1,a+1),r.lineTo(s,a+1),r.endFill())}return r},setupTimingPattern:function(){for(var e=8;e<this.moduleCount-8;e++)this.modules[e][6][0]??(this.modules[e][6][0]=e%2==0);for(var t=8;t<this.moduleCount-8;t++)this.modules[6][t][0]??(this.modules[6][t][0]=t%2==0)},setupPositionAdjustPattern:function(e){for(var t=x.getPatternPosition(this.typeNumber),n=0;n<t.length;n++)for(var r=0;r<t.length;r++){var i=t[n],a=t[r];if(this.modules[i][a][0]==null)for(var o=-2;o<=2;o++)for(var s=-2;s<=2;s++)o==-2||o==2||s==-2||s==2||o==0&&s==0?(this.modules[i+o][a+s][0]=!0,this.modules[i+o][a+s][2]=e,this.modules[i+o][a+s][1]=o==-2||s==-2||o==2||s==2?`O`:`I`):this.modules[i+o][a+s][0]=!1}},setupTypeNumber:function(e){for(var t=x.getBCHTypeNumber(this.typeNumber),n=0;n<18;n++){var r=!e&&(t>>n&1)==1;this.modules[Math.floor(n/3)][n%3+this.moduleCount-8-3][0]=r}for(var n=0;n<18;n++){var r=!e&&(t>>n&1)==1;this.modules[n%3+this.moduleCount-8-3][Math.floor(n/3)][0]=r}},setupTypeInfo:function(e,t){for(var n=this.errorCorrectLevel<<3|t,r=x.getBCHTypeInfo(n),i=0;i<15;i++){var a=!e&&(r>>i&1)==1;i<6?this.modules[i][8][0]=a:i<8?this.modules[i+1][8][0]=a:this.modules[this.moduleCount-15+i][8][0]=a}for(var i=0;i<15;i++){var a=!e&&(r>>i&1)==1;i<8?this.modules[8][this.moduleCount-i-1][0]=a:i<9?this.modules[8][15-i-1+1][0]=a:this.modules[8][15-i-1][0]=a}this.modules[this.moduleCount-8][8][0]=!e},mapData:function(e,t){for(var n=-1,r=this.moduleCount-1,i=7,a=0,o=this.moduleCount-1;o>0;o-=2)for(o==6&&o--;;){for(var s=0;s<2;s++)if(this.modules[r][o-s][0]==null){var c=!1;a<e.length&&(c=(e[a]>>>i&1)==1),x.getMask(t,r,o-s)&&(c=!c),this.modules[r][o-s][0]=c,i--,i==-1&&(a++,i=7)}if((r+=n)<0||this.moduleCount<=r){r-=n,n=-n;break}}}},r.PAD0=236,r.PAD1=17,r.createData=function(e,t,n){for(var i=a.getRSBlocks(e,t),s=new o,c=0;c<n.length;c++){var l=n[c];s.put(l.mode,4),s.put(l.getLength(),x.getLengthInBits(l.mode,e)),l.write(s)}for(var u=0,c=0;c<i.length;c++)u+=i[c].dataCount;if(s.getLengthInBits()>8*u)throw Error(`code length overflow. (`+s.getLengthInBits()+`>`+8*u+`)`);for(s.getLengthInBits()+4<=8*u&&s.put(0,4);s.getLengthInBits()%8!=0;)s.putBit(!1);for(;!(s.getLengthInBits()>=8*u||(s.put(r.PAD0,8),s.getLengthInBits()>=8*u));)s.put(r.PAD1,8);return r.createBytes(s,i)},r.createBytes=function(e,t){for(var n=0,r=0,a=0,o=Array(t.length),s=Array(t.length),c=0;c<t.length;c++){var l=t[c].dataCount,u=t[c].totalCount-l;r=Math.max(r,l),a=Math.max(a,u),o[c]=Array(l);for(var d=0;d<o[c].length;d++)o[c][d]=255&e.buffer[d+n];n+=l;var f=x.getErrorCorrectPolynomial(u),p=new i(o[c],f.getLength()-1).mod(f);s[c]=Array(f.getLength()-1);for(var d=0;d<s[c].length;d++){var m=d+p.getLength()-s[c].length;s[c][d]=m>=0?p.get(m):0}}for(var h=0,d=0;d<t.length;d++)h+=t[d].totalCount;for(var g=Array(h),_=0,d=0;d<r;d++)for(var c=0;c<t.length;c++)d<o[c].length&&(g[_++]=o[c][d]);for(var d=0;d<a;d++)for(var c=0;c<t.length;c++)d<s[c].length&&(g[_++]=s[c][d]);return g};for(var v={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},y={L:1,M:0,Q:3,H:2},b={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},x={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(e){for(var t=e<<10;x.getBCHDigit(t)-x.getBCHDigit(x.G15)>=0;)t^=x.G15<<x.getBCHDigit(t)-x.getBCHDigit(x.G15);return(e<<10|t)^x.G15_MASK},getBCHTypeNumber:function(e){for(var t=e<<12;x.getBCHDigit(t)-x.getBCHDigit(x.G18)>=0;)t^=x.G18<<x.getBCHDigit(t)-x.getBCHDigit(x.G18);return e<<12|t},getBCHDigit:function(e){for(var t=0;e!=0;)t++,e>>>=1;return t},getPatternPosition:function(e){return x.PATTERN_POSITION_TABLE[e-1]},getMask:function(e,t,n){switch(e){case b.PATTERN000:return(t+n)%2==0;case b.PATTERN001:return t%2==0;case b.PATTERN010:return n%3==0;case b.PATTERN011:return(t+n)%3==0;case b.PATTERN100:return(Math.floor(t/2)+Math.floor(n/3))%2==0;case b.PATTERN101:return t*n%2+t*n%3==0;case b.PATTERN110:return(t*n%2+t*n%3)%2==0;case b.PATTERN111:return(t*n%3+(t+n)%2)%2==0;default:throw Error(`bad maskPattern:`+e)}},getErrorCorrectPolynomial:function(e){for(var t=new i([1],0),n=0;n<e;n++)t=t.multiply(new i([1,S.gexp(n)],0));return t},getLengthInBits:function(e,t){if(1<=t&&t<10)switch(e){case v.MODE_NUMBER:return 10;case v.MODE_ALPHA_NUM:return 9;case v.MODE_8BIT_BYTE:case v.MODE_KANJI:return 8;default:throw Error(`mode:`+e)}else if(t<27)switch(e){case v.MODE_NUMBER:return 12;case v.MODE_ALPHA_NUM:return 11;case v.MODE_8BIT_BYTE:return 16;case v.MODE_KANJI:return 10;default:throw Error(`mode:`+e)}else{if(!(t<41))throw Error(`type:`+t);switch(e){case v.MODE_NUMBER:return 14;case v.MODE_ALPHA_NUM:return 13;case v.MODE_8BIT_BYTE:return 16;case v.MODE_KANJI:return 12;default:throw Error(`mode:`+e)}}},getLostPoint:function(e){for(var t=e.getModuleCount(),n=0,r=0;r<t;r++)for(var i=0;i<t;i++){for(var a=0,o=e.isDark(r,i),s=-1;s<=1;s++)if(!(r+s<0||t<=r+s))for(var c=-1;c<=1;c++)i+c<0||t<=i+c||s==0&&c==0||o==e.isDark(r+s,i+c)&&a++;a>5&&(n+=3+a-5)}for(var r=0;r<t-1;r++)for(var i=0;i<t-1;i++){var l=0;e.isDark(r,i)&&l++,e.isDark(r+1,i)&&l++,e.isDark(r,i+1)&&l++,e.isDark(r+1,i+1)&&l++,l!=0&&l!=4||(n+=3)}for(var r=0;r<t;r++)for(var i=0;i<t-6;i++)e.isDark(r,i)&&!e.isDark(r,i+1)&&e.isDark(r,i+2)&&e.isDark(r,i+3)&&e.isDark(r,i+4)&&!e.isDark(r,i+5)&&e.isDark(r,i+6)&&(n+=40);for(var i=0;i<t;i++)for(var r=0;r<t-6;r++)e.isDark(r,i)&&!e.isDark(r+1,i)&&e.isDark(r+2,i)&&e.isDark(r+3,i)&&e.isDark(r+4,i)&&!e.isDark(r+5,i)&&e.isDark(r+6,i)&&(n+=40);for(var u=0,i=0;i<t;i++)for(var r=0;r<t;r++)e.isDark(r,i)&&u++;return n+=Math.abs(100*u/t/t-50)/5*10}},S={glog:function(e){if(e<1)throw Error(`glog(`+e+`)`);return S.LOG_TABLE[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return S.EXP_TABLE[e]},EXP_TABLE:Array(256),LOG_TABLE:Array(256)},C=0;C<8;C++)S.EXP_TABLE[C]=1<<C;for(var C=8;C<256;C++)S.EXP_TABLE[C]=S.EXP_TABLE[C-4]^S.EXP_TABLE[C-5]^S.EXP_TABLE[C-6]^S.EXP_TABLE[C-8];for(var C=0;C<255;C++)S.LOG_TABLE[S.EXP_TABLE[C]]=C;i.prototype={get:function(e){return this.num[e]},getLength:function(){return this.num.length},multiply:function(e){for(var t=Array(this.getLength()+e.getLength()-1),n=0;n<this.getLength();n++)for(var r=0;r<e.getLength();r++)t[n+r]^=S.gexp(S.glog(this.get(n))+S.glog(e.get(r)));return new i(t,0)},mod:function(e){if(this.getLength()-e.getLength()<0)return this;for(var t=S.glog(this.get(0))-S.glog(e.get(0)),n=Array(this.getLength()),r=0;r<this.getLength();r++)n[r]=this.get(r);for(var r=0;r<e.getLength();r++)n[r]^=S.gexp(S.glog(e.get(r))+t);return new i(n,0).mod(e)}},a.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],a.getRSBlocks=function(e,t){var n=a.getRsBlockTable(e,t);if(n==u)throw Error(`bad rs block @ typeNumber:`+e+`/errorCorrectLevel:`+t);for(var r=n.length/3,i=[],o=0;o<r;o++)for(var s=n[3*o+0],c=n[3*o+1],l=n[3*o+2],d=0;d<s;d++)i.push(new a(c,l));return i},a.getRsBlockTable=function(e,t){switch(t){case y.L:return a.RS_BLOCK_TABLE[4*(e-1)+0];case y.M:return a.RS_BLOCK_TABLE[4*(e-1)+1];case y.Q:return a.RS_BLOCK_TABLE[4*(e-1)+2];case y.H:return a.RS_BLOCK_TABLE[4*(e-1)+3];default:return u}},o.prototype={get:function(e){var t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)==1},put:function(e,t){for(var n=0;n<t;n++)this.putBit((e>>>t-n-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(e){var t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var w=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],T=function(){return typeof CanvasRenderingContext2D<`u`}()?function(){function e(){if(this._htOption.drawer==`svg`){var e=this._oContext.getSerializedSvg(!0);this.dataURL=e,this._el.innerHTML=e}else{(function(e,t,n,r){var i=document.createElement(`canvas`);i.width=n,i.height=r,i.getContext(`2d`).drawImage(e,0,0,n,r),e.width=n,e.height=r,t.drawImage(i,0,0)})(this._elCanvas,this._oContext,this._htOption.width+2*this._htOption.quietZone,this._htOption.height+this._htOption.titleHeight+2*this._htOption.quietZone);try{var t=this._elCanvas.toDataURL(`image/png`);this.dataURL=t}catch(e){console.error(e)}}this._htOption.onRenderingEnd&&(this.dataURL||console.error("Can not get base64 data, please check: 1. Published the page and image to the server 2. The image request support CORS 3. Configured `crossOrigin:'anonymous'` option"),this._htOption.onRenderingEnd(this._htOption,this.dataURL))}function t(e,t){var n=this;if(n._fFail=t,n._fSuccess=e,n._bSupportDataURI===null){var r=document.createElement(`img`),i=function(){n._bSupportDataURI=!1,n._fFail&&n._fFail.call(n)};r.onabort=i,r.onerror=i,r.onload=function(){n._bSupportDataURI=!0,n._fSuccess&&n._fSuccess.call(n)},r.src=`data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==`}else!0===n._bSupportDataURI&&n._fSuccess?n._fSuccess.call(n):!1===n._bSupportDataURI&&n._fFail&&n._fFail.call(n)}if(m._android&&m._android<=2.1){var n=1/window.devicePixelRatio,r=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(e,t,i,a,o,s,c,l,u){if(`nodeName`in e&&/img/i.test(e.nodeName))for(var d=arguments.length-1;d>=1;d--)arguments[d]=arguments[d]*n;else l===void 0&&(arguments[1]*=n,arguments[2]*=n,arguments[3]*=n,arguments[4]*=n);r.apply(this,arguments)}}var i=function(e,t){this._bIsPainted=!1,this._android=s(),this._el=e,this._htOption=t,this._htOption.drawer==`svg`?(this._oContext={},this._elCanvas={}):(this._elCanvas=document.createElement(`canvas`),this._el.appendChild(this._elCanvas),this._oContext=this._elCanvas.getContext(`2d`)),this._bSupportDataURI=null,this.dataURL=null};return i.prototype.draw=function(e){function t(){r.quietZone>0&&r.quietZoneColor&&(l.lineWidth=0,l.fillStyle=r.quietZoneColor,l.fillRect(0,0,u._elCanvas.width,r.quietZone),l.fillRect(0,r.quietZone,r.quietZone,u._elCanvas.height-2*r.quietZone),l.fillRect(u._elCanvas.width-r.quietZone,r.quietZone,r.quietZone,u._elCanvas.height-2*r.quietZone),l.fillRect(0,u._elCanvas.height-r.quietZone,u._elCanvas.width,r.quietZone))}function n(e){function n(e){var n=Math.round(r.width/3.5),i=Math.round(r.height/3.5);n!==i&&(n=i),r.logoMaxWidth?n=Math.round(r.logoMaxWidth):r.logoWidth&&(n=Math.round(r.logoWidth)),r.logoMaxHeight?i=Math.round(r.logoMaxHeight):r.logoHeight&&(i=Math.round(r.logoHeight));var a,o;e.naturalWidth===void 0?(a=e.width,o=e.height):(a=e.naturalWidth,o=e.naturalHeight),(r.logoMaxWidth||r.logoMaxHeight)&&(r.logoMaxWidth&&a<=n&&(n=a),r.logoMaxHeight&&o<=i&&(i=o),a<=n&&o<=i&&(n=a,i=o));var s=(r.realWidth-n)/2,c=(r.calculatedQRHeight-i)/2+r.titleHeight+r.quietZone,u=Math.min(n/a,i/o),d=a*u,f=o*u;(r.logoMaxWidth||r.logoMaxHeight)&&(n=d,i=f,s=(r.realWidth-n)/2,c=(r.realHeight-i)/2),r.logoBackgroundTransparent||(l.fillStyle=r.logoBackgroundColor,l.fillRect(s,c,n,i));var p=l.imageSmoothingQuality,m=l.imageSmoothingEnabled;l.imageSmoothingEnabled=!0,l.imageSmoothingQuality=`high`,l.drawImage(e,s+(n-d)/2,c+(i-f)/2,d,f),l.imageSmoothingEnabled=m,l.imageSmoothingQuality=p,t(),v._bIsPainted=!0,v.makeImage()}r.onRenderingStart&&r.onRenderingStart(r);for(var s=0;s<i;s++)for(var c=0;c<i;c++){var u=c*a+r.quietZone,d=s*o+r.quietZone,f=e.isDark(s,c),p=e.getEye(s,c),m=r.dotScale;l.lineWidth=0;var h,g;p?(h=r[p.type]||r[p.type.substring(0,2)]||r.colorDark,g=r.colorLight):r.backgroundImage?(g=`rgba(0,0,0,0)`,s==6?r.autoColor?(h=r.timing_H||r.timing||r.autoColorDark,g=r.autoColorLight):h=r.timing_H||r.timing||r.colorDark:c==6?r.autoColor?(h=r.timing_V||r.timing||r.autoColorDark,g=r.autoColorLight):h=r.timing_V||r.timing||r.colorDark:r.autoColor?(h=r.autoColorDark,g=r.autoColorLight):h=r.colorDark):(h=s==6?r.timing_H||r.timing||r.colorDark:c==6&&(r.timing_V||r.timing)||r.colorDark,g=r.colorLight),l.strokeStyle=f?h:g,l.fillStyle=f?h:g,p?(m=p.type==`AO`?r.dotScaleAO:p.type==`AI`?r.dotScaleAI:1,r.backgroundImage&&r.autoColor?(h=(p.type==`AO`?r.AI:r.AO)||r.autoColorDark,g=r.autoColorLight):h=(p.type==`AO`?r.AI:r.AO)||h,f=p.isDark,l.fillRect(Math.ceil(u+a*(1-m)/2),Math.ceil(r.titleHeight+d+o*(1-m)/2),Math.ceil(a*m),Math.ceil(o*m))):s==6?(m=r.dotScaleTiming_H,l.fillRect(Math.ceil(u+a*(1-m)/2),Math.ceil(r.titleHeight+d+o*(1-m)/2),Math.ceil(a*m),Math.ceil(o*m))):c==6?(m=r.dotScaleTiming_V,l.fillRect(Math.ceil(u+a*(1-m)/2),Math.ceil(r.titleHeight+d+o*(1-m)/2),Math.ceil(a*m),Math.ceil(o*m))):(r.backgroundImage,l.fillRect(Math.ceil(u+a*(1-m)/2),Math.ceil(r.titleHeight+d+o*(1-m)/2),Math.ceil(a*m),Math.ceil(o*m))),r.dotScale==1||p||(l.strokeStyle=r.colorLight)}if(r.title&&(l.fillStyle=r.titleBackgroundColor,l.fillRect(r.quietZone,r.quietZone,r.calculatedQRWidth,r.titleHeight),l.font=r.titleFont,l.fillStyle=r.titleColor,l.textAlign=`center`,l.fillText(r.title,this._elCanvas.width/2,+r.quietZone+r.titleTop)),r.subTitle&&(l.font=r.subTitleFont,l.fillStyle=r.subTitleColor,l.fillText(r.subTitle,this._elCanvas.width/2,+r.quietZone+r.subTitleTop)),r.logo){var _=new Image,v=this;_.onload=function(){n(_)},_.onerror=function(e){console.error(e)},r.crossOrigin!=null&&(_.crossOrigin=r.crossOrigin),_.originalSrc=r.logo,_.src=r.logo}else t(),this._bIsPainted=!0,this.makeImage()}var r=this._htOption,i=e.getModuleCount(),a=r.width/i,o=r.height/i;a<=1&&(a=1),o<=1&&(o=1),a=Math.round(a),o=Math.round(o);var s=a*i,c=o*i;r.heightWithTitle=c+r.titleHeight,r.realHeight=r.heightWithTitle+2*r.quietZone,r.realWidth=s+2*r.quietZone,r.calculatedQRWidth=s,r.calculatedQRHeight=c,this._elCanvas.width=r.realWidth,this._elCanvas.height=r.realHeight,r.drawer!=`canvas`&&(this._oContext=new C2S(r.width+2*this._htOption.quietZone,r.height+r.titleHeight+2*this._htOption.quietZone,r.realWidth,r.realHeight)),this.clear();var l=this._oContext;l.lineWidth=0,l.fillStyle=r.colorLight,l.fillRect(0,0,this._elCanvas.width,this._elCanvas.height),l.clearRect(r.quietZone,r.quietZone,r.calculatedQRWidth,r.titleHeight);var u=this;if(r.backgroundImage){var d=new Image;d.onload=function(){l.globalAlpha=1,l.globalAlpha=r.backgroundImageAlpha;var t=l.imageSmoothingQuality,i=l.imageSmoothingEnabled;l.imageSmoothingEnabled=!0,l.imageSmoothingQuality=`high`,(r.title||r.subTitle)&&r.titleHeight?l.drawImage(d,r.quietZone,r.quietZone+r.titleHeight,r.width,r.height):l.drawImage(d,0,0,r.realWidth,r.realHeight),l.imageSmoothingEnabled=i,l.imageSmoothingQuality=t,l.globalAlpha=1,n.call(u,e)},r.crossOrigin!=null&&(d.crossOrigin=r.crossOrigin),d.originalSrc=r.backgroundImage,d.src=r.backgroundImage}else n.call(u,e)},i.prototype.makeImage=function(){this._bIsPainted&&t.call(this,e)},i.prototype.isPainted=function(){return this._bIsPainted},i.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},i.prototype.remove=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1,this._el.innerHTML=``},i.prototype.round=function(e){return e&&Math.floor(1e3*e)/1e3},i}():function(){var e=function(e,t){this._el=e,this._htOption=t};return e.prototype.draw=function(e){var t=this._htOption,n=this._el,r=e.getModuleCount(),i=t.width/r,a=t.height/r;i<=1&&(i=1),a<=1&&(a=1);var o=i*r;t.heightWithTitle=a*r+t.titleHeight,t.realHeight=t.heightWithTitle+2*t.quietZone,t.realWidth=o+2*t.quietZone;var s=[],c=``,l=Math.round(i*t.dotScale),u=Math.round(a*t.dotScale);l<4&&(l=4,u=4);var d=t.colorDark,f=t.colorLight;if(t.backgroundImage){t.autoColor?(t.colorDark=`rgba(0, 0, 0, .6);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#99000000', EndColorStr='#99000000');`,t.colorLight=`rgba(255, 255, 255, .7);filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#B2FFFFFF', EndColorStr='#B2FFFFFF');`):t.colorLight=`rgba(0,0,0,0)`;var p=`<div style="display:inline-block; z-index:-10;position:absolute;"><img src="`+t.backgroundImage+`" width="`+(t.width+2*t.quietZone)+`" height="`+t.realHeight+`" style="opacity:`+t.backgroundImageAlpha+`;filter:alpha(opacity=`+100*t.backgroundImageAlpha+`); "/></div>`;s.push(p)}if(t.quietZone&&(c=`display:inline-block; width:`+(t.width+2*t.quietZone)+`px; height:`+(t.width+2*t.quietZone)+`px;background:`+t.quietZoneColor+`; text-align:center;`),s.push(`<div style="font-size:0;`+c+`">`),s.push(`<table  style="font-size:0;border:0;border-collapse:collapse; margin-top:`+t.quietZone+`px;" border="0" cellspacing="0" cellspadding="0" align="center" valign="middle">`),s.push(`<tr height="`+t.titleHeight+`" align="center"><td style="border:0;border-collapse:collapse;margin:0;padding:0" colspan="`+r+`">`),t.title){var m=t.titleColor,h=t.titleFont;s.push(`<div style="width:100%;margin-top:`+t.titleTop+`px;color:`+m+`;font:`+h+`;background:`+t.titleBackgroundColor+`">`+t.title+`</div>`)}t.subTitle&&s.push(`<div style="width:100%;margin-top:`+(t.subTitleTop-t.titleTop)+`px;color:`+t.subTitleColor+`; font:`+t.subTitleFont+`">`+t.subTitle+`</div>`),s.push(`</td></tr>`);for(var g=0;g<r;g++){s.push(`<tr style="border:0; padding:0; margin:0;" height="7">`);for(var _=0;_<r;_++){var v=e.isDark(g,_),y=e.getEye(g,_);if(y){v=y.isDark;var b=y.type,x=t[b]||t[b.substring(0,2)]||d;s.push(`<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:`+i+`px;height:`+a+`px;"><span style="width:`+i+`px;height:`+a+`px;background-color:`+(v?x:f)+`;display:inline-block"></span></td>`)}else{var S=t.colorDark;g==6?(S=t.timing_H||t.timing||d,s.push(`<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:`+i+`px;height:`+a+`px;background-color:`+(v?S:f)+`;"></td>`)):_==6?(S=t.timing_V||t.timing||d,s.push(`<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:`+i+`px;height:`+a+`px;background-color:`+(v?S:f)+`;"></td>`)):s.push(`<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:`+i+`px;height:`+a+`px;"><div style="display:inline-block;width:`+l+`px;height:`+u+`px;background-color:`+(v?S:t.colorLight)+`;"></div></td>`)}}s.push(`</tr>`)}if(s.push(`</table>`),s.push(`</div>`),t.logo){var C=new Image;t.crossOrigin!=null&&(C.crossOrigin=t.crossOrigin),C.src=t.logo;var w=t.width/3.5,T=t.height/3.5;w!=T&&(w=T),t.logoWidth&&(w=t.logoWidth),t.logoHeight&&(T=t.logoHeight);var E=`position:relative; z-index:1;display:table-cell;top:-`+(t.height/2+T/2+t.quietZone)+`px;text-align:center; width:`+w+`px; height:`+T+`px;line-height:`+w+`px; vertical-align: middle;`;t.logoBackgroundTransparent||(E+=`background:`+t.logoBackgroundColor),s.push(`<div style="`+E+`"><img  src="`+t.logo+`"  style="max-width: `+w+`px; max-height: `+T+`px;" /> <div style=" display: none; width:1px;margin-left: -1px;"></div></div>`)}t.onRenderingStart&&t.onRenderingStart(t),n.innerHTML=s.join(``);var D=n.childNodes[0],O=(t.width-D.offsetWidth)/2,k=(t.heightWithTitle-D.offsetHeight)/2;O>0&&k>0&&(D.style.margin=k+`px `+O+`px`),this._htOption.onRenderingEnd&&this._htOption.onRenderingEnd(this._htOption,null)},e.prototype.clear=function(){this._el.innerHTML=``},e}();d=function(e,t){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:`#000000`,colorLight:`#ffffff`,correctLevel:y.H,dotScale:1,dotScaleTiming:1,dotScaleTiming_H:u,dotScaleTiming_V:u,dotScaleA:1,dotScaleAO:u,dotScaleAI:u,quietZone:0,quietZoneColor:`rgba(0,0,0,0)`,title:``,titleFont:`normal normal bold 16px Arial`,titleColor:`#000000`,titleBackgroundColor:`#ffffff`,titleHeight:0,titleTop:30,subTitle:``,subTitleFont:`normal normal normal 14px Arial`,subTitleColor:`#4F4F4F`,subTitleTop:60,logo:u,logoWidth:u,logoHeight:u,logoMaxWidth:u,logoMaxHeight:u,logoBackgroundColor:`#ffffff`,logoBackgroundTransparent:!1,PO:u,PI:u,PO_TL:u,PI_TL:u,PO_TR:u,PI_TR:u,PO_BL:u,PI_BL:u,AO:u,AI:u,timing:u,timing_H:u,timing_V:u,backgroundImage:u,backgroundImageAlpha:1,autoColor:!1,autoColorDark:`rgba(0, 0, 0, .6)`,autoColorLight:`rgba(255, 255, 255, .7)`,onRenderingStart:u,onRenderingEnd:u,version:0,tooltip:!1,binary:!1,drawer:`canvas`,crossOrigin:null,utf8WithoutBOM:!0},typeof t==`string`&&(t={text:t}),t)for(var n in t)this._htOption[n]=t[n];this._htOption.title||this._htOption.subTitle||(this._htOption.titleHeight=0),(this._htOption.version<0||this._htOption.version>40)&&(console.warn(`QR Code version '`+this._htOption.version+`' is invalidate, reset to 0`),this._htOption.version=0),(this._htOption.dotScale<0||this._htOption.dotScale>1)&&(console.warn(this._htOption.dotScale+` , is invalidate, dotScale must greater than 0, less than or equal to 1, now reset to 1. `),this._htOption.dotScale=1),(this._htOption.dotScaleTiming<0||this._htOption.dotScaleTiming>1)&&(console.warn(this._htOption.dotScaleTiming+` , is invalidate, dotScaleTiming must greater than 0, less than or equal to 1, now reset to 1. `),this._htOption.dotScaleTiming=1),this._htOption.dotScaleTiming_H?(this._htOption.dotScaleTiming_H<0||this._htOption.dotScaleTiming_H>1)&&(console.warn(this._htOption.dotScaleTiming_H+` , is invalidate, dotScaleTiming_H must greater than 0, less than or equal to 1, now reset to 1. `),this._htOption.dotScaleTiming_H=1):this._htOption.dotScaleTiming_H=this._htOption.dotScaleTiming,this._htOption.dotScaleTiming_V?(this._htOption.dotScaleTiming_V<0||this._htOption.dotScaleTiming_V>1)&&(console.warn(this._htOption.dotScaleTiming_V+` , is invalidate, dotScaleTiming_V must greater than 0, less than or equal to 1, now reset to 1. `),this._htOption.dotScaleTiming_V=1):this._htOption.dotScaleTiming_V=this._htOption.dotScaleTiming,(this._htOption.dotScaleA<0||this._htOption.dotScaleA>1)&&(console.warn(this._htOption.dotScaleA+` , is invalidate, dotScaleA must greater than 0, less than or equal to 1, now reset to 1. `),this._htOption.dotScaleA=1),this._htOption.dotScaleAO?(this._htOption.dotScaleAO<0||this._htOption.dotScaleAO>1)&&(console.warn(this._htOption.dotScaleAO+` , is invalidate, dotScaleAO must greater than 0, less than or equal to 1, now reset to 1. `),this._htOption.dotScaleAO=1):this._htOption.dotScaleAO=this._htOption.dotScaleA,this._htOption.dotScaleAI?(this._htOption.dotScaleAI<0||this._htOption.dotScaleAI>1)&&(console.warn(this._htOption.dotScaleAI+` , is invalidate, dotScaleAI must greater than 0, less than or equal to 1, now reset to 1. `),this._htOption.dotScaleAI=1):this._htOption.dotScaleAI=this._htOption.dotScaleA,(this._htOption.backgroundImageAlpha<0||this._htOption.backgroundImageAlpha>1)&&(console.warn(this._htOption.backgroundImageAlpha+` , is invalidate, backgroundImageAlpha must between 0 and 1, now reset to 1. `),this._htOption.backgroundImageAlpha=1),this._htOption.quietZone||(this._htOption.quietZone=0),this._htOption.titleHeight||(this._htOption.titleHeight=0),this._htOption.width=Math.round(this._htOption.width),this._htOption.height=Math.round(this._htOption.height),this._htOption.quietZone=Math.round(this._htOption.quietZone),this._htOption.titleHeight=Math.round(this._htOption.titleHeight),typeof e==`string`&&(e=document.getElementById(e)),(!this._htOption.drawer||this._htOption.drawer!=`svg`&&this._htOption.drawer!=`canvas`)&&(this._htOption.drawer=`canvas`),this._android=s(),this._el=e,this._oQRCode=null,this._htOption._element=e;var r={};for(var n in this._htOption)r[n]=this._htOption[n];this._oDrawing=new T(this._el,r),this._htOption.text&&this.makeCode(this._htOption.text)},d.prototype.makeCode=function(e){this._oQRCode=new r(c(e,this._htOption),this._htOption.correctLevel),this._oQRCode.addData(e,this._htOption.binary,this._htOption.utf8WithoutBOM),this._oQRCode.make(),this._htOption.tooltip&&(this._el.title=e),this._oDrawing.draw(this._oQRCode)},d.prototype.makeImage=function(){typeof this._oDrawing.makeImage==`function`&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},d.prototype.clear=function(){this._oDrawing.remove()},d.prototype.resize=function(e,t){this._oDrawing._htOption.width=e,this._oDrawing._htOption.height=t,this._oDrawing.draw(this._oQRCode)},d.prototype.download=function(e){var t=this._oDrawing.dataURL,n=document.createElement(`a`);if(this._htOption.drawer==`svg`){e+=`.svg`;var r=new Blob([t],{type:`text/plain`});if(navigator.msSaveBlob)navigator.msSaveBlob(r,e);else{n.download=e;var i=new FileReader;i.onload=function(){n.href=i.result,n.click()},i.readAsDataURL(r)}}else if(e+=`.png`,navigator.msSaveBlob){var a=function(e){var t=atob(e.split(`,`)[1]),n=e.split(`,`)[0].split(`:`)[1].split(`;`)[0],r=new ArrayBuffer(t.length),i=new Uint8Array(r);for(C=0;C<t.length;C++)i[C]=t.charCodeAt(C);return new Blob([r],{type:n})}(t);navigator.msSaveBlob(a,e)}else n.download=e,n.href=t,n.click()},d.prototype.noConflict=function(){return m.QRCode===this&&(m.QRCode=_),d},d.CorrectLevel=y,typeof define==`function`&&(define.amd||define.cmd)?define([],function(){return d}):g?((g.exports=d).QRCode=d,h.QRCode=d):m.QRCode=d}).call(this)});var tl=$c(`58QMB`),nl={},G=BigInt(0),K=BigInt(1),rl=BigInt(2),il=BigInt(3),al=BigInt(8),q=Object.freeze({a:G,b:BigInt(7),P:BigInt(`0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f`),n:BigInt(`0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141`),h:K,Gx:BigInt(`55066263022277343669578718895168534326250603453777594175500187360389116729240`),Gy:BigInt(`32670510020758816978083085130507043184471273380659243275938904335757337482424`),beta:BigInt(`0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee`)}),ol=(e,t)=>(e+t/rl)/t,sl={beta:BigInt(`0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee`),splitScalar(e){let{n:t}=q,n=BigInt(`0x3086d221a7d46bcde86c90e49284eb15`),r=-K*BigInt(`0xe4437ed6010e88286f547fa90abfe4c3`),i=BigInt(`0x114ca50f7a8e2f3f657c1108d9d44cfd8`),a=n,o=BigInt(`0x100000000000000000000000000000000`),s=ol(a*e,t),c=ol(-r*e,t),l=Y(e-s*n-c*i,t),u=Y(-s*r-c*a,t),d=l>o,f=u>o;if(d&&(l=t-l),f&&(u=t-u),l>o||u>o)throw Error(`splitScalarEndo: Endomorphism failed, k=`+e);return{k1neg:d,k1:l,k2neg:f,k2:u}}},cl=32,ll=32,ul=32,dl=33,fl=65;function pl(e){let{a:t,b:n}=q;return Y(Y(Y(e*e)*e)+t*e+n)}var ml=q.a===G,hl=class extends Error{constructor(e){super(e)}};function gl(e){if(!(e instanceof _l))throw TypeError(`JacobianPoint expected`)}var _l=class e{constructor(e,t,n){this.x=e,this.y=t,this.z=n}static fromAffine(t){if(!(t instanceof J))throw TypeError(`JacobianPoint#fromAffine: expected Point`);return t.equals(J.ZERO)?e.ZERO:new e(t.x,t.y,K)}static toAffineBatch(e){let t=zl(e.map(e=>e.z));return e.map((e,n)=>e.toAffine(t[n]))}static normalizeZ(t){return e.toAffineBatch(t).map(e.fromAffine)}equals(e){gl(e);let{x:t,y:n,z:r}=this,{x:i,y:a,z:o}=e,s=Y(r*r),c=Y(o*o),l=Y(t*c),u=Y(i*s),d=Y(Y(n*o)*c),f=Y(Y(a*r)*s);return l===u&&d===f}negate(){return new e(this.x,Y(-this.y),this.z)}double(){let{x:t,y:n,z:r}=this,i=Y(t*t),a=Y(n*n),o=Y(a*a),s=t+a,c=Y(rl*(Y(s*s)-i-o)),l=Y(il*i),u=Y(Y(l*l)-rl*c),d=Y(l*(c-u)-al*o),f=Y(rl*n*r);return new e(u,d,f)}add(t){gl(t);let{x:n,y:r,z:i}=this,{x:a,y:o,z:s}=t;if(a===G||o===G)return this;if(n===G||r===G)return t;let c=Y(i*i),l=Y(s*s),u=Y(n*l),d=Y(a*c),f=Y(Y(r*s)*l),p=Y(Y(o*i)*c),m=Y(d-u),h=Y(p-f);if(m===G)return h===G?this.double():e.ZERO;let g=Y(m*m),_=Y(m*g),v=Y(u*g),y=Y(h*h-_-rl*v),b=Y(h*(v-y)-f*_),x=Y(i*s*m);return new e(y,b,x)}subtract(e){return this.add(e.negate())}multiplyUnsafe(t){let n=e.ZERO;if(typeof t==`bigint`&&t===G)return n;let r=Fl(t);if(r===K)return this;if(!ml){let e=n,t=this;for(;r>G;)r&K&&(e=e.add(t)),t=t.double(),r>>=K;return e}let{k1neg:i,k1:a,k2neg:o,k2:s}=sl.splitScalar(r),c=n,l=n,u=this;for(;a>G||s>G;)a&K&&(c=c.add(u)),s&K&&(l=l.add(u)),u=u.double(),a>>=K,s>>=K;return i&&(c=c.negate()),o&&(l=l.negate()),l=new e(Y(l.x*sl.beta),l.y,l.z),c.add(l)}precomputeWindow(e){let t=ml?128/e+1:256/e+1,n=[],r=this,i=r;for(let a=0;a<t;a++){i=r,n.push(i);for(let t=1;t<2**(e-1);t++)i=i.add(r),n.push(i);r=i.double()}return n}wNAF(t,n){!n&&this.equals(e.BASE)&&(n=J.BASE);let r=n&&n._WINDOW_SIZE||1;if(256%r)throw Error(`Point#wNAF: Invalid precomputation window, must be power of 2`);let i=n&&yl.get(n);i||(i=this.precomputeWindow(r),n&&r!==1&&(i=e.normalizeZ(i),yl.set(n,i)));let a=e.ZERO,o=e.BASE,s=1+(ml?128/r:256/r),c=2**(r-1),l=BigInt(2**r-1),u=2**r,d=BigInt(r);for(let e=0;e<s;e++){let n=e*c,r=Number(t&l);t>>=d,r>c&&(r-=u,t+=K);let s=n,f=n+Math.abs(r)-1,p=e%2!=0,m=r<0;r===0?o=o.add(vl(p,i[s])):a=a.add(vl(m,i[f]))}return{p:a,f:o}}multiply(t,n){let r=Fl(t),i,a;if(ml){let{k1neg:t,k1:o,k2neg:s,k2:c}=sl.splitScalar(r),{p:l,f:u}=this.wNAF(o,n),{p:d,f}=this.wNAF(c,n);l=vl(t,l),d=vl(s,d),d=new e(Y(d.x*sl.beta),d.y,d.z),i=l.add(d),a=u.add(f)}else{let{p:e,f:t}=this.wNAF(r,n);i=e,a=t}return e.normalizeZ([i,a])[0]}toAffine(t){let{x:n,y:r,z:i}=this,a=this.equals(e.ZERO);t??=a?al:Rl(i);let o=t,s=Y(o*o),c=Y(s*o),l=Y(n*s),u=Y(r*c),d=Y(i*o);if(a)return J.ZERO;if(d!==K)throw Error(`invZ was invalid`);return new J(l,u)}};_l.BASE=new _l(q.Gx,q.Gy,K),_l.ZERO=new _l(G,K,G);function vl(e,t){let n=t.negate();return e?n:t}var yl=new WeakMap,J=class e{constructor(e,t){this.x=e,this.y=t}_setWindowSize(e){this._WINDOW_SIZE=e,yl.delete(this)}hasEvenY(){return this.y%rl===G}static fromCompressedHex(t){let n=t.length===32,r=Nl(n?t:t.subarray(1));if(!Kl(r))throw Error(`Point is not on curve`);let i=Ll(pl(r)),a=(i&K)===K;n?a&&(i=Y(-i)):(t[0]&1)==1!==a&&(i=Y(-i));let o=new e(r,i);return o.assertValidity(),o}static fromUncompressedHex(t){let n=Nl(t.subarray(1,33)),r=Nl(t.subarray(33,65)),i=new e(n,r);return i.assertValidity(),i}static fromHex(e){let t=Pl(e),n=t.length,r=t[0];if(n===cl||n===dl&&(r===2||r===3))return this.fromCompressedHex(t);if(n===fl&&r===4)return this.fromUncompressedHex(t);throw Error(`Point.fromHex: received invalid point. Expected 32-${dl} compressed bytes or ${fl} uncompressed bytes, not ${n}`)}static fromPrivateKey(t){return e.BASE.multiply(Jl(t))}static fromSignature(t,n,r){let{r:i,s:a}=Xl(n);if(![0,1,2,3].includes(r))throw Error(`Cannot recover: invalid recovery bit`);let o=Vl(Pl(t)),{n:s}=q,c=r===2||r===3?i+s:i,l=Rl(c,s),u=Y(-o*l,s),d=Y(a*l,s),f=r&1?`03`:`02`,p=e.fromHex(f+Ol(c)),m=e.BASE.multiplyAndAddUnsafe(p,u,d);if(!m)throw Error(`Cannot recover signature: point at infinify`);return m.assertValidity(),m}toRawBytes(e=!1){return Ml(this.toHex(e))}toHex(e=!1){let t=Ol(this.x);return e?`${this.hasEvenY()?`02`:`03`}${t}`:`04${t}${Ol(this.y)}`}toHexX(){return this.toHex(!0).slice(2)}toRawX(){return this.toRawBytes(!0).slice(1)}assertValidity(){let{x:e,y:t}=this;if(!Kl(e)||!Kl(t)||Y(Y(t*t)-pl(e))!==G)throw Error(`Point is not on elliptic curve`)}equals(e){return this.x===e.x&&this.y===e.y}negate(){return new e(this.x,Y(-this.y))}double(){return _l.fromAffine(this).double().toAffine()}add(e){return _l.fromAffine(this).add(_l.fromAffine(e)).toAffine()}subtract(e){return this.add(e.negate())}multiply(e){return _l.fromAffine(this).multiply(e,this).toAffine()}multiplyAndAddUnsafe(t,n,r){let i=_l.fromAffine(this),a=n===G||n===K||this!==e.BASE?i.multiplyUnsafe(n):i.multiply(n),o=_l.fromAffine(t).multiplyUnsafe(r),s=a.add(o);return s.equals(_l.ZERO)?void 0:s.toAffine()}};J.BASE=new J(q.Gx,q.Gy),J.ZERO=new J(G,G);function bl(e){return Number.parseInt(e[0],16)>=8?`00`+e:e}function xl(e){if(e.length<2||e[0]!==2)throw Error(`Invalid signature integer tag: ${El(e)}`);let t=e[1],n=e.subarray(2,t+2);if(!t||n.length!==t)throw Error(`Invalid signature integer: wrong length`);if(n[0]===0&&n[1]<=127)throw Error(`Invalid signature integer: trailing length`);return{data:Nl(n),left:e.subarray(t+2)}}function Sl(e){if(e.length<2||e[0]!=48)throw Error(`Invalid signature tag: ${El(e)}`);if(e[1]!==e.length-2)throw Error(`Invalid signature: incorrect length`);let{data:t,left:n}=xl(e.subarray(2)),{data:r,left:i}=xl(n);if(i.length)throw Error(`Invalid signature: left bytes after parsing: ${El(i)}`);return{r:t,s:r}}var Cl=class e{constructor(e,t){this.r=e,this.s=t,this.assertValidity()}static fromCompact(t){let n=t instanceof Uint8Array,r=`Signature.fromCompact`;if(typeof t!=`string`&&!n)throw TypeError(`${r}: Expected string or Uint8Array`);let i=n?El(t):t;if(i.length!==128)throw Error(`${r}: Expected 64-byte hex`);return new e(jl(i.slice(0,64)),jl(i.slice(64,128)))}static fromDER(t){let n=t instanceof Uint8Array;if(typeof t!=`string`&&!n)throw TypeError(`Signature.fromDER: Expected string or Uint8Array`);let{r,s:i}=Sl(n?t:Ml(t));return new e(r,i)}static fromHex(e){return this.fromDER(e)}assertValidity(){let{r:e,s:t}=this;if(!Gl(e))throw Error(`Invalid Signature: r must be 0 < r < n`);if(!Gl(t))throw Error(`Invalid Signature: s must be 0 < s < n`)}hasHighS(){let e=q.n>>K;return this.s>e}normalizeS(){return this.hasHighS()?new e(this.r,Y(-this.s,q.n)):this}toDERRawBytes(){return Ml(this.toDERHex())}toDERHex(){let e=bl(Al(this.s)),t=bl(Al(this.r)),n=e.length/2,r=t.length/2,i=Al(n),a=Al(r);return`30${Al(r+n+4)}02${a}${t}02${i}${e}`}toRawBytes(){return this.toDERRawBytes()}toHex(){return this.toDERHex()}toCompactRawBytes(){return Ml(this.toCompactHex())}toCompactHex(){return Ol(this.r)+Ol(this.s)}};function wl(...e){if(!e.every(e=>e instanceof Uint8Array))throw Error(`Uint8Array list expected`);if(e.length===1)return e[0];let t=e.reduce((e,t)=>e+t.length,0),n=new Uint8Array(t);for(let t=0,r=0;t<e.length;t++){let i=e[t];n.set(i,r),r+=i.length}return n}var Tl=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,`0`));function El(e){if(!(e instanceof Uint8Array))throw Error(`Expected Uint8Array`);let t=``;for(let n=0;n<e.length;n++)t+=Tl[e[n]];return t}var Dl=BigInt(`0x10000000000000000000000000000000000000000000000000000000000000000`);function Ol(e){if(typeof e!=`bigint`)throw Error(`Expected bigint`);if(!(G<=e&&e<Dl))throw Error(`Expected number 0 <= n < 2^256`);return e.toString(16).padStart(64,`0`)}function kl(e){let t=Ml(Ol(e));if(t.length!==32)throw Error(`Error: expected 32 bytes`);return t}function Al(e){let t=e.toString(16);return t.length&1?`0${t}`:t}function jl(e){if(typeof e!=`string`)throw TypeError(`hexToNumber: expected string, got `+typeof e);return BigInt(`0x${e}`)}function Ml(e){if(typeof e!=`string`)throw TypeError(`hexToBytes: expected string, got `+typeof e);if(e.length%2)throw Error(`hexToBytes: received invalid unpadded hex`+e.length);let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++){let r=n*2,i=e.slice(r,r+2),a=Number.parseInt(i,16);if(Number.isNaN(a)||a<0)throw Error(`Invalid byte sequence`);t[n]=a}return t}function Nl(e){return jl(El(e))}function Pl(e){return e instanceof Uint8Array?Uint8Array.from(e):Ml(e)}function Fl(e){if(typeof e==`number`&&Number.isSafeInteger(e)&&e>0)return BigInt(e);if(typeof e==`bigint`&&Gl(e))return e;throw TypeError(`Expected valid private scalar: 0 < scalar < curve.n`)}function Y(e,t=q.P){let n=e%t;return n>=G?n:t+n}function Il(e,t){let{P:n}=q,r=e;for(;t-->G;)r*=r,r%=n;return r}function Ll(e){let{P:t}=q,n=BigInt(6),r=BigInt(11),i=BigInt(22),a=BigInt(23),o=BigInt(44),s=BigInt(88),c=e*e*e%t,l=c*c*e%t,u=Il(Il(Il(l,il)*l%t,il)*l%t,rl)*c%t,d=Il(u,r)*u%t,f=Il(d,i)*d%t,p=Il(f,o)*f%t,m=Il(Il(Il(Il(Il(Il(p,s)*p%t,o)*f%t,il)*l%t,a)*d%t,n)*c%t,rl);if(m*m%t!==e)throw Error(`Cannot find square root`);return m}function Rl(e,t=q.P){if(e===G||t<=G)throw Error(`invert: expected positive integers, got n=${e} mod=${t}`);let n=Y(e,t),r=t,i=G,a=K,o=K,s=G;for(;n!==G;){let e=r/n,t=r%n,c=i-o*e,l=a-s*e;r=n,n=t,i=o,a=s,o=c,s=l}if(r!==K)throw Error(`invert: does not exist`);return Y(i,t)}function zl(e,t=q.P){let n=Array(e.length),r=Rl(e.reduce((e,r,i)=>r===G?e:(n[i]=e,Y(e*r,t)),K),t);return e.reduceRight((e,r,i)=>r===G?e:(n[i]=Y(e*n[i],t),Y(e*r,t)),r),n}function Bl(e){let t=e.length*8-256,n=Nl(e);return t>0?n>>BigInt(t):n}function Vl(e,t=!1){let n=Bl(e);if(t)return n;let{n:r}=q;return n>=r?n-r:n}var Hl,Ul,Wl=class{constructor(e,t){if(this.hashLen=e,this.qByteLen=t,typeof e!=`number`||e<2)throw Error(`hashLen must be a number`);if(typeof t!=`number`||t<2)throw Error(`qByteLen must be a number`);this.v=new Uint8Array(e).fill(1),this.k=new Uint8Array(e).fill(0),this.counter=0}hmac(...e){return X.hmacSha256(this.k,...e)}hmacSync(...e){return Ul(this.k,...e)}checkSync(){if(typeof Ul!=`function`)throw new hl(`hmacSha256Sync needs to be set`)}incr(){if(this.counter>=1e3)throw Error(`Tried 1,000 k values for sign(), all were invalid`);this.counter+=1}async reseed(e=new Uint8Array){this.k=await this.hmac(this.v,Uint8Array.from([0]),e),this.v=await this.hmac(this.v),e.length!==0&&(this.k=await this.hmac(this.v,Uint8Array.from([1]),e),this.v=await this.hmac(this.v))}reseedSync(e=new Uint8Array){this.checkSync(),this.k=this.hmacSync(this.v,Uint8Array.from([0]),e),this.v=this.hmacSync(this.v),e.length!==0&&(this.k=this.hmacSync(this.v,Uint8Array.from([1]),e),this.v=this.hmacSync(this.v))}async generate(){this.incr();let e=0,t=[];for(;e<this.qByteLen;){this.v=await this.hmac(this.v);let n=this.v.slice();t.push(n),e+=this.v.length}return wl(...t)}generateSync(){this.checkSync(),this.incr();let e=0,t=[];for(;e<this.qByteLen;){this.v=this.hmacSync(this.v);let n=this.v.slice();t.push(n),e+=this.v.length}return wl(...t)}};function Gl(e){return G<e&&e<q.n}function Kl(e){return G<e&&e<q.P}function ql(e,t,n,r=!0){let{n:i}=q,a=Vl(e,!0);if(!Gl(a))return;let o=Rl(a,i),s=J.BASE.multiply(a),c=Y(s.x,i);if(c===G)return;let l=Y(o*Y(t+n*c,i),i);if(l===G)return;let u=new Cl(c,l),d=(s.x===u.r?0:2)|Number(s.y&K);return r&&u.hasHighS()&&(u=u.normalizeS(),d^=1),{sig:u,recovery:d}}function Jl(e){let t;if(typeof e==`bigint`)t=e;else if(typeof e==`number`&&Number.isSafeInteger(e)&&e>0)t=BigInt(e);else if(typeof e==`string`){if(e.length!==64)throw Error(`Expected 32 bytes of private key`);t=jl(e)}else if(e instanceof Uint8Array){if(e.length!==ll)throw Error(`Expected 32 bytes of private key`);t=Nl(e)}else throw TypeError(`Expected valid private key`);if(!Gl(t))throw Error(`Expected private key: 0 < key < n`);return t}function Yl(e){return e instanceof J?(e.assertValidity(),e):J.fromHex(e)}function Xl(e){if(e instanceof Cl)return e.assertValidity(),e;try{return Cl.fromDER(e)}catch{return Cl.fromCompact(e)}}function Zl(e,t=!1){return J.fromPrivateKey(e).toRawBytes(t)}function Ql(e){let t=e instanceof Uint8Array,n=typeof e==`string`,r=(t||n)&&e.length;return t?r===dl||r===fl:n?r===66||r===130:e instanceof J}function $l(e,t,n=!1){if(Ql(e))throw TypeError(`getSharedSecret: first arg must be private key`);if(!Ql(t))throw TypeError(`getSharedSecret: second arg must be public key`);let r=Yl(t);return r.assertValidity(),r.multiply(Jl(e)).toRawBytes(n)}function eu(e){return Nl(e.length>cl?e.slice(0,cl):e)}function tu(e){let t=eu(e),n=Y(t,q.n);return nu(n<G?t:n)}function nu(e){return kl(e)}function ru(e,t,n){if(e==null)throw Error(`sign: expected valid message hash, not "${e}"`);let r=Pl(e),i=Jl(t),a=[nu(i),tu(r)];if(n!=null){n===!0&&(n=X.randomBytes(cl));let e=Pl(n);if(e.length!==cl)throw Error(`sign: Expected ${cl} bytes of extra data`);a.push(e)}return{seed:wl(...a),m:eu(r),d:i}}function iu(e,t){let{sig:n,recovery:r}=e,{der:i,recovered:a}=Object.assign({canonical:!0,der:!0},t),o=i?n.toDERRawBytes():n.toCompactRawBytes();return a?[o,r]:o}function au(e,t,n={}){let{seed:r,m:i,d:a}=ru(e,t,n.extraEntropy),o=new Wl(ul,ll);o.reseedSync(r);let s;for(;!(s=ql(o.generateSync(),i,a,n.canonical));)o.reseedSync();return iu(s,n)}var ou={strict:!0};function su(e,t,n,r=ou){let i;try{i=Xl(e),t=Pl(t)}catch{return!1}let{r:a,s:o}=i;if(r.strict&&i.hasHighS())return!1;let s=Vl(t),c;try{c=Yl(n)}catch{return!1}let{n:l}=q,u=Rl(o,l),d=Y(s*u,l),f=Y(a*u,l),p=J.BASE.multiplyAndAddUnsafe(c,d,f);return p?Y(p.x,l)===a:!1}function cu(e){return Y(Nl(e),q.n)}var lu=class e{constructor(e,t){this.r=e,this.s=t,this.assertValidity()}static fromHex(t){let n=Pl(t);if(n.length!==64)throw TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);let r=Nl(n.subarray(0,32)),i=Nl(n.subarray(32,64));return new e(r,i)}assertValidity(){let{r:e,s:t}=this;if(!Kl(e)||!Gl(t))throw Error(`Invalid signature`)}toHex(){return Ol(this.r)+Ol(this.s)}toRawBytes(){return Ml(this.toHex())}};function uu(e){return J.fromPrivateKey(e).toRawX()}var du=class{constructor(e,t,n=X.randomBytes()){if(e==null)throw TypeError(`sign: Expected valid message, not "${e}"`);this.m=Pl(e);let{x:r,scalar:i}=this.getScalar(Jl(t));if(this.px=r,this.d=i,this.rand=Pl(n),this.rand.length!==32)throw TypeError(`sign: Expected 32 bytes of aux randomness`)}getScalar(e){let t=J.fromPrivateKey(e);return{point:t,scalar:t.hasEvenY()?e:q.n-e,x:t.toRawX()}}initNonce(e,t){return kl(e^Nl(t))}finalizeNonce(e){let t=Y(Nl(e),q.n);if(t===G)throw Error(`sign: Creation of signature failed. k is zero`);let{point:n,x:r,scalar:i}=this.getScalar(t);return{R:n,rx:r,k:i}}finalizeSig(e,t,n,r){return new lu(e.x,Y(t+n*r,q.n)).toRawBytes()}error(){throw Error(`sign: Invalid signature produced`)}async calc(){let{m:e,d:t,px:n,rand:r}=this,i=X.taggedHash,a=this.initNonce(t,await i(bu.aux,r)),{R:o,rx:s,k:c}=this.finalizeNonce(await i(bu.nonce,a,n,e)),l=cu(await i(bu.challenge,s,n,e)),u=this.finalizeSig(o,c,l,t);return await gu(u,e,n)||this.error(),u}calcSync(){let{m:e,d:t,px:n,rand:r}=this,i=X.taggedHashSync,a=this.initNonce(t,i(bu.aux,r)),{R:o,rx:s,k:c}=this.finalizeNonce(i(bu.nonce,a,n,e)),l=cu(i(bu.challenge,s,n,e)),u=this.finalizeSig(o,c,l,t);return _u(u,e,n)||this.error(),u}};async function fu(e,t,n){return new du(e,t,n).calc()}function pu(e,t,n){return new du(e,t,n).calcSync()}function mu(e,t,n){let r=e instanceof lu,i=r?e:lu.fromHex(e);return r&&i.assertValidity(),{...i,m:Pl(t),P:Yl(n)}}function hu(e,t,n,r){let i=J.BASE.multiplyAndAddUnsafe(t,Jl(n),Y(-r,q.n));return!(!i||!i.hasEvenY()||i.x!==e)}async function gu(e,t,n){try{let{r,s:i,m:a,P:o}=mu(e,t,n);return hu(r,o,i,cu(await X.taggedHash(bu.challenge,kl(r),o.toRawX(),a)))}catch{return!1}}function _u(e,t,n){try{let{r,s:i,m:a,P:o}=mu(e,t,n);return hu(r,o,i,cu(X.taggedHashSync(bu.challenge,kl(r),o.toRawX(),a)))}catch(e){if(e instanceof hl)throw e;return!1}}var vu={Signature:lu,getPublicKey:uu,sign:fu,verify:gu,signSync:pu,verifySync:_u};J.BASE._setWindowSize(8);var yu={node:nl,web:typeof self==`object`&&`crypto`in self?self.crypto:void 0},bu={challenge:`BIP0340/challenge`,aux:`BIP0340/aux`,nonce:`BIP0340/nonce`},xu={},X={bytesToHex:El,hexToBytes:Ml,concatBytes:wl,mod:Y,invert:Rl,isValidPrivateKey(e){try{return Jl(e),!0}catch{return!1}},_bigintTo32Bytes:kl,_normalizePrivateKey:Jl,hashToPrivateKey:e=>{if(e=Pl(e),e.length<40||e.length>1024)throw Error(`Expected valid bytes of private key as per FIPS 186`);return kl(Y(Nl(e),q.n-K)+K)},randomBytes:(e=32)=>{if(yu.web)return yu.web.getRandomValues(new Uint8Array(e));if(yu.node){let{randomBytes:t}=yu.node;return Uint8Array.from(t(e))}throw Error(`The environment doesn't have randomBytes function`)},randomPrivateKey:()=>X.hashToPrivateKey(X.randomBytes(40)),precompute(e=8,t=J.BASE){let n=t===J.BASE?t:new J(t.x,t.y);return n._setWindowSize(e),n.multiply(il),n},sha256:async(...e)=>{if(yu.web){let t=await yu.web.subtle.digest(`SHA-256`,wl(...e));return new Uint8Array(t)}if(yu.node){let{createHash:t}=yu.node,n=t(`sha256`);return e.forEach(e=>n.update(e)),Uint8Array.from(n.digest())}throw Error(`The environment doesn't have sha256 function`)},hmacSha256:async(e,...t)=>{if(yu.web){let n=await yu.web.subtle.importKey(`raw`,e,{name:`HMAC`,hash:{name:`SHA-256`}},!1,[`sign`]),r=wl(...t),i=await yu.web.subtle.sign(`HMAC`,n,r);return new Uint8Array(i)}if(yu.node){let{createHmac:n}=yu.node,r=n(`sha256`,e);return t.forEach(e=>r.update(e)),Uint8Array.from(r.digest())}throw Error(`The environment doesn't have hmac-sha256 function`)},sha256Sync:void 0,hmacSha256Sync:void 0,taggedHash:async(e,...t)=>{let n=xu[e];if(n===void 0){let t=await X.sha256(Uint8Array.from(e,e=>e.charCodeAt(0)));n=wl(t,t),xu[e]=n}return X.sha256(n,...t)},taggedHashSync:(e,...t)=>{if(typeof Hl!=`function`)throw new hl(`sha256Sync is undefined, you need to set it`);let n=xu[e];if(n===void 0){let t=Hl(Uint8Array.from(e,e=>e.charCodeAt(0)));n=wl(t,t),xu[e]=n}return Hl(n,...t)},_JacobianPoint:_l};Object.defineProperties(X,{sha256Sync:{configurable:!1,get(){return Hl},set(e){Hl||=e}},hmacSha256Sync:{configurable:!1,get(){return Ul},set(e){Ul||=e}}});var Su={};Object.defineProperty(Su,"__esModule",{value:!0}),Su.sha224=Su.sha256=void 0;var Cu={};Object.defineProperty(Cu,"__esModule",{value:!0}),Cu.SHA2=void 0;var Z={};Object.defineProperty(Z,"__esModule",{value:!0}),Z.output=Z.exists=Z.hash=Z.bytes=Z.bool=Z.number=void 0;function wu(e){if(!Number.isSafeInteger(e)||e<0)throw Error(`Wrong positive integer: ${e}`)}Z.number=wu;function Tu(e){if(typeof e!=`boolean`)throw Error(`Expected boolean, not ${e}`)}Z.bool=Tu;function Eu(e,...t){if(!(e instanceof Uint8Array))throw TypeError(`Expected Uint8Array`);if(t.length>0&&!t.includes(e.length))throw TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`)}Z.bytes=Eu;function Du(e){if(typeof e!=`function`||typeof e.create!=`function`)throw Error(`Hash should be wrapped by utils.wrapConstructor`);wu(e.outputLen),wu(e.blockLen)}Z.hash=Du;function Ou(e,t=!0){if(e.destroyed)throw Error(`Hash instance has been destroyed`);if(t&&e.finished)throw Error(`Hash#digest() has already been called`)}Z.exists=Ou;function ku(e,t){Eu(e);let n=t.outputLen;if(e.length<n)throw Error(`digestInto() expects output buffer of length at least ${n}`)}Z.output=ku,Z.default={number:wu,bool:Tu,bytes:Eu,hash:Du,exists:Ou,output:ku};var Q={};Object.defineProperty(Q,"__esModule",{value:!0}),Q.randomBytes=Q.wrapConstructorWithOpts=Q.wrapConstructor=Q.checkOpts=Q.Hash=Q.concatBytes=Q.toBytes=Q.utf8ToBytes=Q.asyncLoop=Q.nextTick=Q.hexToBytes=Q.bytesToHex=Q.isLE=Q.rotr=Q.createView=Q.u32=Q.u8=void 0;var Au={};if(Object.defineProperty(Au,"__esModule",{value:!0}),Au.crypto=void 0,Au.crypto={node:void 0,web:typeof self==`object`&&`crypto`in self?self.crypto:void 0},Q.u8=e=>new Uint8Array(e.buffer,e.byteOffset,e.byteLength),Q.u32=e=>new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4)),Q.createView=e=>new DataView(e.buffer,e.byteOffset,e.byteLength),Q.rotr=(e,t)=>e<<32-t|e>>>t,Q.isLE=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68,!Q.isLE)throw Error(`Non little-endian hardware is not supported`);var ju=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,`0`));function Mu(e){if(!(e instanceof Uint8Array))throw Error(`Uint8Array expected`);let t=``;for(let n=0;n<e.length;n++)t+=ju[e[n]];return t}Q.bytesToHex=Mu;function Nu(e){if(typeof e!=`string`)throw TypeError(`hexToBytes: expected string, got `+typeof e);if(e.length%2)throw Error(`hexToBytes: received invalid unpadded hex`);let t=new Uint8Array(e.length/2);for(let n=0;n<t.length;n++){let r=n*2,i=e.slice(r,r+2),a=Number.parseInt(i,16);if(Number.isNaN(a)||a<0)throw Error(`Invalid byte sequence`);t[n]=a}return t}Q.hexToBytes=Nu,Q.nextTick=async()=>{};async function Pu(e,t,n){let r=Date.now();for(let i=0;i<e;i++){n(i);let e=Date.now()-r;e>=0&&e<t||(await(0,Q.nextTick)(),r+=e)}}Q.asyncLoop=Pu;function Fu(e){if(typeof e!=`string`)throw TypeError(`utf8ToBytes expected string, got ${typeof e}`);return new TextEncoder().encode(e)}Q.utf8ToBytes=Fu;function Iu(e){if(typeof e==`string`&&(e=Fu(e)),!(e instanceof Uint8Array))throw TypeError(`Expected input type is Uint8Array (got ${typeof e})`);return e}Q.toBytes=Iu;function Lu(...e){if(!e.every(e=>e instanceof Uint8Array))throw Error(`Uint8Array list expected`);if(e.length===1)return e[0];let t=e.reduce((e,t)=>e+t.length,0),n=new Uint8Array(t);for(let t=0,r=0;t<e.length;t++){let i=e[t];n.set(i,r),r+=i.length}return n}Q.concatBytes=Lu,Q.Hash=class{clone(){return this._cloneInto()}};var Ru=e=>Object.prototype.toString.call(e)===`[object Object]`&&e.constructor===Object;function zu(e,t){if(t!==void 0&&(typeof t!=`object`||!Ru(t)))throw TypeError(`Options should be object or undefined`);return Object.assign(e,t)}Q.checkOpts=zu;function Bu(e){let t=t=>e().update(Iu(t)).digest(),n=e();return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=()=>e(),t}Q.wrapConstructor=Bu;function Vu(e){let t=(t,n)=>e(n).update(Iu(t)).digest(),n=e({});return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=t=>e(t),t}Q.wrapConstructorWithOpts=Vu;function Hu(e=32){if(Au.crypto.web)return Au.crypto.web.getRandomValues(new Uint8Array(e));if(Au.crypto.node)return new Uint8Array(Au.crypto.node.randomBytes(e).buffer);throw Error(`The environment doesn't have randomBytes function`)}Q.randomBytes=Hu;function Uu(e,t,n,r){if(typeof e.setBigUint64==`function`)return e.setBigUint64(t,n,r);let i=BigInt(32),a=BigInt(4294967295),o=Number(n>>i&a),s=Number(n&a),c=r?4:0,l=r?0:4;e.setUint32(t+c,o,r),e.setUint32(t+l,s,r)}Cu.SHA2=class extends Q.Hash{constructor(e,t,n,r){super(),this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=r,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(e),this.view=(0,Q.createView)(this.buffer)}update(e){Z.default.exists(this);let{view:t,buffer:n,blockLen:r}=this;e=(0,Q.toBytes)(e);let i=e.length;for(let a=0;a<i;){let o=Math.min(r-this.pos,i-a);if(o===r){let t=(0,Q.createView)(e);for(;r<=i-a;a+=r)this.process(t,a)}else n.set(e.subarray(a,a+o),this.pos),this.pos+=o,a+=o,this.pos===r&&(this.process(t,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){Z.default.exists(this),Z.default.output(e,this),this.finished=!0;let{buffer:t,view:n,blockLen:r,isLE:i}=this,{pos:a}=this;t[a++]=128,this.buffer.subarray(a).fill(0),this.padOffset>r-a&&(this.process(n,0),a=0);for(let e=a;e<r;e++)t[e]=0;Uu(n,r-8,BigInt(this.length*8),i),this.process(n,0);let o=(0,Q.createView)(e),s=this.outputLen;if(s%4)throw Error(`_sha2: outputLen should be aligned to 32bit`);let c=s/4,l=this.get();if(c>l.length)throw Error(`_sha2: outputLen bigger than state`);for(let e=0;e<c;e++)o.setUint32(4*e,l[e],i)}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}_cloneInto(e){e||=new this.constructor,e.set(...this.get());let{blockLen:t,buffer:n,length:r,finished:i,destroyed:a,pos:o}=this;return e.length=r,e.pos=o,e.finished=i,e.destroyed=a,r%t&&e.buffer.set(n),e}};var Wu=(e,t,n)=>e&t^~e&n,Gu=(e,t,n)=>e&t^e&n^t&n,Ku=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),qu=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),Ju=new Uint32Array(64),Yu=class extends Cu.SHA2{constructor(){super(64,32,8,!1),this.A=qu[0]|0,this.B=qu[1]|0,this.C=qu[2]|0,this.D=qu[3]|0,this.E=qu[4]|0,this.F=qu[5]|0,this.G=qu[6]|0,this.H=qu[7]|0}get(){let{A:e,B:t,C:n,D:r,E:i,F:a,G:o,H:s}=this;return[e,t,n,r,i,a,o,s]}set(e,t,n,r,i,a,o,s){this.A=e|0,this.B=t|0,this.C=n|0,this.D=r|0,this.E=i|0,this.F=a|0,this.G=o|0,this.H=s|0}process(e,t){for(let n=0;n<16;n++,t+=4)Ju[n]=e.getUint32(t,!1);for(let e=16;e<64;e++){let t=Ju[e-15],n=Ju[e-2],r=(0,Q.rotr)(t,7)^(0,Q.rotr)(t,18)^t>>>3,i=(0,Q.rotr)(n,17)^(0,Q.rotr)(n,19)^n>>>10;Ju[e]=i+Ju[e-7]+r+Ju[e-16]|0}let{A:n,B:r,C:i,D:a,E:o,F:s,G:c,H:l}=this;for(let e=0;e<64;e++){let t=(0,Q.rotr)(o,6)^(0,Q.rotr)(o,11)^(0,Q.rotr)(o,25),u=l+t+Wu(o,s,c)+Ku[e]+Ju[e]|0,d=((0,Q.rotr)(n,2)^(0,Q.rotr)(n,13)^(0,Q.rotr)(n,22))+Gu(n,r,i)|0;l=c,c=s,s=o,o=a+u|0,a=i,i=r,r=n,n=u+d|0}n=n+this.A|0,r=r+this.B|0,i=i+this.C|0,a=a+this.D|0,o=o+this.E|0,s=s+this.F|0,c=c+this.G|0,l=l+this.H|0,this.set(n,r,i,a,o,s,c,l)}roundClean(){Ju.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}},Xu=class extends Yu{constructor(){super(),this.A=-1056596264,this.B=914150663,this.C=812702999,this.D=-150054599,this.E=-4191439,this.F=1750603025,this.G=1694076839,this.H=-1090891868,this.outputLen=28}};Su.sha256=(0,Q.wrapConstructor)(()=>new Yu),Su.sha224=(0,Q.wrapConstructor)(()=>new Xu);function Zu(e){if(!Number.isSafeInteger(e))throw Error(`Wrong integer: ${e}`)}function Qu(...e){let t=(e,t)=>n=>e(t(n));return{encode:Array.from(e).reverse().reduce((e,n)=>e?t(e,n.encode):n.encode,void 0),decode:e.reduce((e,n)=>e?t(e,n.decode):n.decode,void 0)}}function $u(e){return{encode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`number`)throw Error(`alphabet.encode input should be an array of numbers`);return t.map(t=>{if(Zu(t),t<0||t>=e.length)throw Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);return e[t]})},decode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`string`)throw Error(`alphabet.decode input should be array of strings`);return t.map(t=>{if(typeof t!=`string`)throw Error(`alphabet.decode: not string element=${t}`);let n=e.indexOf(t);if(n===-1)throw Error(`Unknown letter: "${t}". Allowed: ${e}`);return n})}}}function ed(e=``){if(typeof e!=`string`)throw Error(`join separator should be string`);return{encode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`string`)throw Error(`join.encode input should be array of strings`);for(let e of t)if(typeof e!=`string`)throw Error(`join.encode: non-string input=${e}`);return t.join(e)},decode:t=>{if(typeof t!=`string`)throw Error(`join.decode input should be string`);return t.split(e)}}}function td(e,t=`=`){if(Zu(e),typeof t!=`string`)throw Error(`padding chr should be string`);return{encode(n){if(!Array.isArray(n)||n.length&&typeof n[0]!=`string`)throw Error(`padding.encode input should be array of strings`);for(let e of n)if(typeof e!=`string`)throw Error(`padding.encode: non-string input=${e}`);for(;n.length*e%8;)n.push(t);return n},decode(n){if(!Array.isArray(n)||n.length&&typeof n[0]!=`string`)throw Error(`padding.encode input should be array of strings`);for(let e of n)if(typeof e!=`string`)throw Error(`padding.decode: non-string input=${e}`);let r=n.length;if(r*e%8)throw Error(`Invalid padding: string should have whole number of bytes`);for(;r>0&&n[r-1]===t;r--)if(!((r-1)*e%8))throw Error(`Invalid padding: string has too much padding`);return n.slice(0,r)}}}function nd(e){if(typeof e!=`function`)throw Error(`normalize fn should be function`);return{encode:e=>e,decode:t=>e(t)}}function rd(e,t,n){if(t<2)throw Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);if(n<2)throw Error(`convertRadix: wrong to=${n}, base cannot be less than 2`);if(!Array.isArray(e))throw Error(`convertRadix: data should be array`);if(!e.length)return[];let r=0,i=[],a=Array.from(e);for(a.forEach(e=>{if(Zu(e),e<0||e>=t)throw Error(`Wrong integer: ${e}`)});;){let e=0,o=!0;for(let i=r;i<a.length;i++){let s=a[i],c=t*e+s;if(!Number.isSafeInteger(c)||t*e/t!==e||c-s!==t*e||(e=c%n,a[i]=Math.floor(c/n),!Number.isSafeInteger(a[i])||a[i]*n+e!==c))throw Error(`convertRadix: carry overflow`);if(o)a[i]?o=!1:r=i;else continue}if(i.push(e),o)break}for(let t=0;t<e.length-1&&e[t]===0;t++)i.push(0);return i.reverse()}var id=(e,t)=>t?id(t,e%t):e,ad=(e,t)=>e+(t-id(e,t));function od(e,t,n,r){if(!Array.isArray(e))throw Error(`convertRadix2: data should be array`);if(t<=0||t>32)throw Error(`convertRadix2: wrong from=${t}`);if(n<=0||n>32)throw Error(`convertRadix2: wrong to=${n}`);if(ad(t,n)>32)throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${ad(t,n)}`);let i=0,a=0,o=2**n-1,s=[];for(let r of e){if(Zu(r),r>=2**t)throw Error(`convertRadix2: invalid data word=${r} from=${t}`);if(i=i<<t|r,a+t>32)throw Error(`convertRadix2: carry overflow pos=${a} from=${t}`);for(a+=t;a>=n;a-=n)s.push((i>>a-n&o)>>>0);i&=2**a-1}if(i=i<<n-a&o,!r&&a>=t)throw Error(`Excess padding`);if(!r&&i)throw Error(`Non-zero padding: ${i}`);return r&&a>0&&s.push(i>>>0),s}function sd(e){return Zu(e),{encode:t=>{if(!(t instanceof Uint8Array))throw Error(`radix.encode input should be Uint8Array`);return rd(Array.from(t),256,e)},decode:t=>{if(!Array.isArray(t)||t.length&&typeof t[0]!=`number`)throw Error(`radix.decode input should be array of strings`);return Uint8Array.from(rd(t,e,256))}}}function cd(e,t=!1){if(Zu(e),e<=0||e>32)throw Error(`radix2: bits should be in (0..32]`);if(ad(8,e)>32||ad(e,8)>32)throw Error(`radix2: carry overflow`);return{encode:n=>{if(!(n instanceof Uint8Array))throw Error(`radix2.encode input should be Uint8Array`);return od(Array.from(n),8,e,!t)},decode:n=>{if(!Array.isArray(n)||n.length&&typeof n[0]!=`number`)throw Error(`radix2.decode input should be array of strings`);return Uint8Array.from(od(n,e,8,t))}}}function ld(e){if(typeof e!=`function`)throw Error(`unsafeWrapper fn should be function`);return function(...t){try{return e.apply(null,t)}catch{}}}function ud(e,t){if(Zu(e),typeof t!=`function`)throw Error(`checksum fn should be function`);return{encode(n){if(!(n instanceof Uint8Array))throw Error(`checksum.encode: input should be Uint8Array`);let r=t(n).slice(0,e),i=new Uint8Array(n.length+e);return i.set(n),i.set(r,n.length),i},decode(n){if(!(n instanceof Uint8Array))throw Error(`checksum.decode: input should be Uint8Array`);let r=n.slice(0,-e),i=t(r).slice(0,e),a=n.slice(-e);for(let t=0;t<e;t++)if(i[t]!==a[t])throw Error(`Invalid checksum`);return r}}}var dd={alphabet:$u,chain:Qu,checksum:ud,radix:sd,radix2:cd,join:ed,padding:td},fd=Qu(cd(4),$u(`0123456789ABCDEF`),ed(``)),pd=Qu(cd(5),$u(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),td(5),ed(``));Qu(cd(5),$u(`0123456789ABCDEFGHIJKLMNOPQRSTUV`),td(5),ed(``)),Qu(cd(5),$u(`0123456789ABCDEFGHJKMNPQRSTVWXYZ`),ed(``),nd(e=>e.toUpperCase().replace(/O/g,`0`).replace(/[IL]/g,`1`)));var md=Qu(cd(6),$u(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`),td(6),ed(``)),hd=Qu(cd(6),$u(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),td(6),ed(``)),gd=e=>Qu(sd(58),$u(e),ed(``)),_d=gd(`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`);gd(`123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ`),gd(`rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz`);var vd=[0,2,3,5,6,7,9,10,11],yd={encode(e){let t=``;for(let n=0;n<e.length;n+=8){let r=e.subarray(n,n+8);t+=_d.encode(r).padStart(vd[r.length],`1`)}return t},decode(e){let t=[];for(let n=0;n<e.length;n+=11){let r=e.slice(n,n+11),i=vd.indexOf(r.length),a=_d.decode(r);for(let e=0;e<a.length-i;e++)if(a[e]!==0)throw Error(`base58xmr: wrong padding`);t=t.concat(Array.from(a.slice(a.length-i)))}return Uint8Array.from(t)}},bd=e=>Qu(ud(4,t=>e(e(t))),_d),xd=Qu($u(`qpzry9x8gf2tvdw0s3jn54khce6mua7l`),ed(``)),Sd=[996825010,642813549,513874426,1027748829,705979059];function Cd(e){let t=e>>25,n=(e&33554431)<<5;for(let e=0;e<Sd.length;e++)(t>>e&1)==1&&(n^=Sd[e]);return n}function wd(e,t,n=1){let r=e.length,i=1;for(let t=0;t<r;t++){let n=e.charCodeAt(t);if(n<33||n>126)throw Error(`Invalid prefix (${e})`);i=Cd(i)^n>>5}i=Cd(i);for(let t=0;t<r;t++)i=Cd(i)^e.charCodeAt(t)&31;for(let e of t)i=Cd(i)^e;for(let e=0;e<6;e++)i=Cd(i);return i^=n,xd.encode(od([i%2**30],30,5,!1))}function Td(e){let t=e===`bech32`?1:734539939,n=cd(5),r=n.decode,i=n.encode,a=ld(r);function o(e,n,r=90){if(typeof e!=`string`)throw Error(`bech32.encode prefix should be string, not ${typeof e}`);if(!Array.isArray(n)||n.length&&typeof n[0]!=`number`)throw Error(`bech32.encode words should be array of numbers, not ${typeof n}`);let i=e.length+7+n.length;if(r!==!1&&i>r)throw TypeError(`Length ${i} exceeds limit ${r}`);return e=e.toLowerCase(),`${e}1${xd.encode(n)}${wd(e,n,t)}`}function s(e,n=90){if(typeof e!=`string`)throw Error(`bech32.decode input should be string, not ${typeof e}`);if(e.length<8||n!==!1&&e.length>n)throw TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${n})`);let r=e.toLowerCase();if(e!==r&&e!==e.toUpperCase())throw Error(`String must be lowercase or uppercase`);e=r;let i=e.lastIndexOf(`1`);if(i===0||i===-1)throw Error(`Letter "1" must be present between prefix and data only`);let a=e.slice(0,i),o=e.slice(i+1);if(o.length<6)throw Error(`Data must be at least 6 characters long`);let s=xd.decode(o).slice(0,-6),c=wd(a,s,t);if(!o.endsWith(c))throw Error(`Invalid checksum in ${e}: expected "${c}"`);return{prefix:a,words:s}}let c=ld(s);function l(e){let{prefix:t,words:n}=s(e,!1);return{prefix:t,words:n,bytes:r(n)}}return{encode:o,decode:s,decodeToBytes:l,decodeUnsafe:c,fromWords:r,fromWordsUnsafe:a,toWords:i}}var Ed=Td(`bech32`);Td(`bech32m`);var Dd={utf8:{encode:e=>new TextDecoder().decode(e),decode:e=>new TextEncoder().encode(e)},hex:Qu(cd(4),$u(`0123456789abcdef`),ed(``),nd(e=>{if(typeof e!=`string`||e.length%2)throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);return e.toLowerCase()})),base16:fd,base32:pd,base64:md,base64url:hd,base58:_d,base58xmr:yd};`${Object.keys(Dd).join(`, `)}`;var Od={};Object.defineProperty(Od,"__esModule",{value:!0}),Od.wordlist=void 0,Od.wordlist=`abandon
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
`);var kd={};Object.defineProperty(kd,"__esModule",{value:!0}),kd.mnemonicToSeedSync=kd.mnemonicToSeed=kd.validateMnemonic=kd.entropyToMnemonic=kd.mnemonicToEntropy=kd.generateMnemonic=void 0;var Ad={};Object.defineProperty(Ad,"__esModule",{value:!0}),Ad.pbkdf2Async=Ad.pbkdf2=void 0;var jd={};Object.defineProperty(jd,"__esModule",{value:!0}),jd.hmac=void 0;var Md=class extends Q.Hash{constructor(e,t){super(),this.finished=!1,this.destroyed=!1,Z.default.hash(e);let n=(0,Q.toBytes)(t);if(this.iHash=e.create(),typeof this.iHash.update!=`function`)throw TypeError(`Expected instance of class which extends utils.Hash`);this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let r=this.blockLen,i=new Uint8Array(r);i.set(n.length>r?e.create().update(n).digest():n);for(let e=0;e<i.length;e++)i[e]^=54;this.iHash.update(i),this.oHash=e.create();for(let e=0;e<i.length;e++)i[e]^=106;this.oHash.update(i),i.fill(0)}update(e){return Z.default.exists(this),this.iHash.update(e),this}digestInto(e){Z.default.exists(this),Z.default.bytes(e,this.outputLen),this.finished=!0,this.iHash.digestInto(e),this.oHash.update(e),this.oHash.digestInto(e),this.destroy()}digest(){let e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});let{oHash:t,iHash:n,finished:r,destroyed:i,blockLen:a,outputLen:o}=this;return e.finished=r,e.destroyed=i,e.blockLen=a,e.outputLen=o,e.oHash=t._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}};jd.hmac=(e,t,n)=>new Md(e,t).update(n).digest(),jd.hmac.create=(e,t)=>new Md(e,t);function Nd(e,t,n,r){Z.default.hash(e);let{c:i,dkLen:a,asyncTick:o}=(0,Q.checkOpts)({dkLen:32,asyncTick:10},r);if(Z.default.number(i),Z.default.number(a),Z.default.number(o),i<1)throw Error(`PBKDF2: iterations (c) should be >= 1`);let s=(0,Q.toBytes)(t),c=(0,Q.toBytes)(n),l=new Uint8Array(a),u=jd.hmac.create(e,s);return{c:i,dkLen:a,asyncTick:o,DK:l,PRF:u,PRFSalt:u._cloneInto().update(c)}}function Pd(e,t,n,r,i){return e.destroy(),t.destroy(),r&&r.destroy(),i.fill(0),n}function Fd(e,t,n,r){let{c:i,dkLen:a,DK:o,PRF:s,PRFSalt:c}=Nd(e,t,n,r),l,u=new Uint8Array(4),d=(0,Q.createView)(u),f=new Uint8Array(s.outputLen);for(let e=1,t=0;t<a;e++,t+=s.outputLen){let n=o.subarray(t,t+s.outputLen);d.setInt32(0,e,!1),(l=c._cloneInto(l)).update(u).digestInto(f),n.set(f.subarray(0,n.length));for(let e=1;e<i;e++){s._cloneInto(l).update(f).digestInto(f);for(let e=0;e<n.length;e++)n[e]^=f[e]}}return Pd(s,c,o,l,f)}Ad.pbkdf2=Fd;async function Id(e,t,n,r){let{c:i,dkLen:a,asyncTick:o,DK:s,PRF:c,PRFSalt:l}=Nd(e,t,n,r),u,d=new Uint8Array(4),f=(0,Q.createView)(d),p=new Uint8Array(c.outputLen);for(let e=1,t=0;t<a;e++,t+=c.outputLen){let n=s.subarray(t,t+c.outputLen);f.setInt32(0,e,!1),(u=l._cloneInto(u)).update(d).digestInto(p),n.set(p.subarray(0,n.length)),await(0,Q.asyncLoop)(i-1,o,e=>{c._cloneInto(u).update(p).digestInto(p);for(let e=0;e<n.length;e++)n[e]^=p[e]})}return Pd(c,l,s,u,p)}Ad.pbkdf2Async=Id;var Ld={};Object.defineProperty(Ld,"__esModule",{value:!0}),Ld.sha384=Ld.sha512_256=Ld.sha512_224=Ld.sha512=Ld.SHA512=void 0;var $={};Object.defineProperty($,"__esModule",{value:!0}),$.add=$.toBig=$.split=$.fromBig=void 0;var Rd=BigInt(2**32-1),zd=BigInt(32);function Bd(e,t=!1){return t?{h:Number(e&Rd),l:Number(e>>zd&Rd)}:{h:Number(e>>zd&Rd)|0,l:Number(e&Rd)|0}}$.fromBig=Bd;function Vd(e,t=!1){let n=new Uint32Array(e.length),r=new Uint32Array(e.length);for(let i=0;i<e.length;i++){let{h:a,l:o}=Bd(e[i],t);[n[i],r[i]]=[a,o]}return[n,r]}$.split=Vd,$.toBig=(e,t)=>BigInt(e>>>0)<<zd|BigInt(t>>>0);var Hd=(e,t,n)=>e>>>n,Ud=(e,t,n)=>e<<32-n|t>>>n,Wd=(e,t,n)=>e>>>n|t<<32-n,Gd=(e,t,n)=>e<<32-n|t>>>n,Kd=(e,t,n)=>e<<64-n|t>>>n-32,qd=(e,t,n)=>e>>>n-32|t<<64-n,Jd=(e,t)=>t,Yd=(e,t)=>e,Xd=(e,t,n)=>e<<n|t>>>32-n,Zd=(e,t,n)=>t<<n|e>>>32-n,Qd=(e,t,n)=>t<<n-32|e>>>64-n,$d=(e,t,n)=>e<<n-32|t>>>64-n;function ef(e,t,n,r){let i=(t>>>0)+(r>>>0);return{h:e+n+(i/2**32|0)|0,l:i|0}}$.add=ef,$.default={fromBig:Bd,split:Vd,toBig:$.toBig,shrSH:Hd,shrSL:Ud,rotrSH:Wd,rotrSL:Gd,rotrBH:Kd,rotrBL:qd,rotr32H:Jd,rotr32L:Yd,rotlSH:Xd,rotlSL:Zd,rotlBH:Qd,rotlBL:$d,add:ef,add3L:(e,t,n)=>(e>>>0)+(t>>>0)+(n>>>0),add3H:(e,t,n,r)=>t+n+r+(e/2**32|0)|0,add4L:(e,t,n,r)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0),add4H:(e,t,n,r,i)=>t+n+r+i+(e/2**32|0)|0,add5H:(e,t,n,r,i,a)=>t+n+r+i+a+(e/2**32|0)|0,add5L:(e,t,n,r,i)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0)+(i>>>0)};var[tf,nf]=$.default.split(`0x428a2f98d728ae22.0x7137449123ef65cd.0xb5c0fbcfec4d3b2f.0xe9b5dba58189dbbc.0x3956c25bf348b538.0x59f111f1b605d019.0x923f82a4af194f9b.0xab1c5ed5da6d8118.0xd807aa98a3030242.0x12835b0145706fbe.0x243185be4ee4b28c.0x550c7dc3d5ffb4e2.0x72be5d74f27b896f.0x80deb1fe3b1696b1.0x9bdc06a725c71235.0xc19bf174cf692694.0xe49b69c19ef14ad2.0xefbe4786384f25e3.0x0fc19dc68b8cd5b5.0x240ca1cc77ac9c65.0x2de92c6f592b0275.0x4a7484aa6ea6e483.0x5cb0a9dcbd41fbd4.0x76f988da831153b5.0x983e5152ee66dfab.0xa831c66d2db43210.0xb00327c898fb213f.0xbf597fc7beef0ee4.0xc6e00bf33da88fc2.0xd5a79147930aa725.0x06ca6351e003826f.0x142929670a0e6e70.0x27b70a8546d22ffc.0x2e1b21385c26c926.0x4d2c6dfc5ac42aed.0x53380d139d95b3df.0x650a73548baf63de.0x766a0abb3c77b2a8.0x81c2c92e47edaee6.0x92722c851482353b.0xa2bfe8a14cf10364.0xa81a664bbc423001.0xc24b8b70d0f89791.0xc76c51a30654be30.0xd192e819d6ef5218.0xd69906245565a910.0xf40e35855771202a.0x106aa07032bbd1b8.0x19a4c116b8d2d0c8.0x1e376c085141ab53.0x2748774cdf8eeb99.0x34b0bcb5e19b48a8.0x391c0cb3c5c95a63.0x4ed8aa4ae3418acb.0x5b9cca4f7763e373.0x682e6ff3d6b2b8a3.0x748f82ee5defb2fc.0x78a5636f43172f60.0x84c87814a1f0ab72.0x8cc702081a6439ec.0x90befffa23631e28.0xa4506cebde82bde9.0xbef9a3f7b2c67915.0xc67178f2e372532b.0xca273eceea26619c.0xd186b8c721c0c207.0xeada7dd6cde0eb1e.0xf57d4f7fee6ed178.0x06f067aa72176fba.0x0a637dc5a2c898a6.0x113f9804bef90dae.0x1b710b35131c471b.0x28db77f523047d84.0x32caab7b40c72493.0x3c9ebe0a15c9bebc.0x431d67c49c100d4c.0x4cc5d4becb3e42b6.0x597f299cfc657e2a.0x5fcb6fab3ad6faec.0x6c44198c4a475817`.split(`.`).map(e=>BigInt(e))),rf=new Uint32Array(80),af=new Uint32Array(80),of=class extends Cu.SHA2{constructor(){super(128,64,16,!1),this.Ah=1779033703,this.Al=-205731576,this.Bh=-1150833019,this.Bl=-2067093701,this.Ch=1013904242,this.Cl=-23791573,this.Dh=-1521486534,this.Dl=1595750129,this.Eh=1359893119,this.El=-1377402159,this.Fh=-1694144372,this.Fl=725511199,this.Gh=528734635,this.Gl=-79577749,this.Hh=1541459225,this.Hl=327033209}get(){let{Ah:e,Al:t,Bh:n,Bl:r,Ch:i,Cl:a,Dh:o,Dl:s,Eh:c,El:l,Fh:u,Fl:d,Gh:f,Gl:p,Hh:m,Hl:h}=this;return[e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h]}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.Ah=e|0,this.Al=t|0,this.Bh=n|0,this.Bl=r|0,this.Ch=i|0,this.Cl=a|0,this.Dh=o|0,this.Dl=s|0,this.Eh=c|0,this.El=l|0,this.Fh=u|0,this.Fl=d|0,this.Gh=f|0,this.Gl=p|0,this.Hh=m|0,this.Hl=h|0}process(e,t){for(let n=0;n<16;n++,t+=4)rf[n]=e.getUint32(t),af[n]=e.getUint32(t+=4);for(let e=16;e<80;e++){let t=rf[e-15]|0,n=af[e-15]|0,r=$.default.rotrSH(t,n,1)^$.default.rotrSH(t,n,8)^$.default.shrSH(t,n,7),i=$.default.rotrSL(t,n,1)^$.default.rotrSL(t,n,8)^$.default.shrSL(t,n,7),a=rf[e-2]|0,o=af[e-2]|0,s=$.default.rotrSH(a,o,19)^$.default.rotrBH(a,o,61)^$.default.shrSH(a,o,6),c=$.default.rotrSL(a,o,19)^$.default.rotrBL(a,o,61)^$.default.shrSL(a,o,6),l=$.default.add4L(i,c,af[e-7],af[e-16]),u=$.default.add4H(l,r,s,rf[e-7],rf[e-16]);rf[e]=u|0,af[e]=l|0}let{Ah:n,Al:r,Bh:i,Bl:a,Ch:o,Cl:s,Dh:c,Dl:l,Eh:u,El:d,Fh:f,Fl:p,Gh:m,Gl:h,Hh:g,Hl:_}=this;for(let e=0;e<80;e++){let t=$.default.rotrSH(u,d,14)^$.default.rotrSH(u,d,18)^$.default.rotrBH(u,d,41),v=$.default.rotrSL(u,d,14)^$.default.rotrSL(u,d,18)^$.default.rotrBL(u,d,41),y=u&f^~u&m,b=d&p^~d&h,x=$.default.add5L(_,v,b,nf[e],af[e]),S=$.default.add5H(x,g,t,y,tf[e],rf[e]),C=x|0,w=$.default.rotrSH(n,r,28)^$.default.rotrBH(n,r,34)^$.default.rotrBH(n,r,39),T=$.default.rotrSL(n,r,28)^$.default.rotrBL(n,r,34)^$.default.rotrBL(n,r,39),E=n&i^n&o^i&o,D=r&a^r&s^a&s;g=m|0,_=h|0,m=f|0,h=p|0,f=u|0,p=d|0,{h:u,l:d}=$.default.add(c|0,l|0,S|0,C|0),c=o|0,l=s|0,o=i|0,s=a|0,i=n|0,a=r|0;let O=$.default.add3L(C,T,D);n=$.default.add3H(O,S,w,E),r=O|0}({h:n,l:r}=$.default.add(this.Ah|0,this.Al|0,n|0,r|0)),{h:i,l:a}=$.default.add(this.Bh|0,this.Bl|0,i|0,a|0),{h:o,l:s}=$.default.add(this.Ch|0,this.Cl|0,o|0,s|0),{h:c,l}=$.default.add(this.Dh|0,this.Dl|0,c|0,l|0),{h:u,l:d}=$.default.add(this.Eh|0,this.El|0,u|0,d|0),{h:f,l:p}=$.default.add(this.Fh|0,this.Fl|0,f|0,p|0),{h:m,l:h}=$.default.add(this.Gh|0,this.Gl|0,m|0,h|0),{h:g,l:_}=$.default.add(this.Hh|0,this.Hl|0,g|0,_|0),this.set(n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_)}roundClean(){rf.fill(0),af.fill(0)}destroy(){this.buffer.fill(0),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}};Ld.SHA512=of;var sf=class extends of{constructor(){super(),this.Ah=-1942145080,this.Al=424955298,this.Bh=1944164710,this.Bl=-1982016298,this.Ch=502970286,this.Cl=855612546,this.Dh=1738396948,this.Dl=1479516111,this.Eh=258812777,this.El=2077511080,this.Fh=2011393907,this.Fl=79989058,this.Gh=1067287976,this.Gl=1780299464,this.Hh=286451373,this.Hl=-1848208735,this.outputLen=28}},cf=class extends of{constructor(){super(),this.Ah=573645204,this.Al=-64227540,this.Bh=-1621794909,this.Bl=-934517566,this.Ch=596883563,this.Cl=1867755857,this.Dh=-1774684391,this.Dl=1497426621,this.Eh=-1775747358,this.El=-1467023389,this.Fh=-1101128155,this.Fl=1401305490,this.Gh=721525244,this.Gl=746961066,this.Hh=246885852,this.Hl=-2117784414,this.outputLen=32}},lf=class extends of{constructor(){super(),this.Ah=-876896931,this.Al=-1056596264,this.Bh=1654270250,this.Bl=914150663,this.Ch=-1856437926,this.Cl=812702999,this.Dh=355462360,this.Dl=-150054599,this.Eh=1731405415,this.El=-4191439,this.Fh=-1900787065,this.Fl=1750603025,this.Gh=-619958771,this.Gl=1694076839,this.Hh=1203062813,this.Hl=-1090891868,this.outputLen=48}};Ld.sha512=(0,Q.wrapConstructor)(()=>new of),Ld.sha512_224=(0,Q.wrapConstructor)(()=>new sf),Ld.sha512_256=(0,Q.wrapConstructor)(()=>new cf),Ld.sha384=(0,Q.wrapConstructor)(()=>new lf);var uf=e=>e[0]===`あいこくしん`;function df(e){if(typeof e!=`string`)throw TypeError(`Invalid mnemonic type: ${typeof e}`);return e.normalize(`NFKD`)}function ff(e){let t=df(e),n=t.split(` `);if(![12,15,18,21,24].includes(n.length))throw Error(`Invalid mnemonic`);return{nfkd:t,words:n}}function pf(e){Z.default.bytes(e,16,20,24,28,32)}function mf(e,t=128){if(Z.default.number(t),t%32!=0||t>256)throw TypeError(`Invalid entropy`);return vf((0,Q.randomBytes)(t/8),e)}kd.generateMnemonic=mf;var hf=e=>{let t=8-e.length/4;return new Uint8Array([(0,Su.sha256)(e)[0]>>t<<t])};function gf(e){if(!Array.isArray(e)||e.length!==2048||typeof e[0]!=`string`)throw Error(`Worlist: expected array of 2048 strings`);return e.forEach(e=>{if(typeof e!=`string`)throw Error(`Wordlist: non-string element: ${e}`)}),dd.chain(dd.checksum(1,hf),dd.radix2(11,!0),dd.alphabet(e))}function _f(e,t){let{words:n}=ff(e),r=gf(t).decode(n);return pf(r),r}kd.mnemonicToEntropy=_f;function vf(e,t){return pf(e),gf(t).encode(e).join(uf(t)?`　`:` `)}kd.entropyToMnemonic=vf;function yf(e,t){try{_f(e,t)}catch{return!1}return!0}kd.validateMnemonic=yf;var bf=e=>df(`mnemonic${e}`);function xf(e,t=``){return(0,Ad.pbkdf2Async)(Ld.sha512,ff(e).nfkd,bf(t),{c:2048,dkLen:64})}kd.mnemonicToSeed=xf;function Sf(e,t=``){return(0,Ad.pbkdf2)(Ld.sha512,ff(e).nfkd,bf(t),{c:2048,dkLen:64})}kd.mnemonicToSeedSync=Sf;var Cf={};Object.defineProperty(Cf,"__esModule",{value:!0}),Cf.ripemd160=Cf.RIPEMD160=void 0;var wf=new Uint8Array([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),Tf=Uint8Array.from({length:16},(e,t)=>t),Ef=Tf.map(e=>(9*e+5)%16),Df=[Tf],Of=[Ef];for(let e=0;e<4;e++)for(let t of[Df,Of])t.push(t[e].map(e=>wf[e]));var kf=[[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8],[12,13,11,15,6,9,9,7,12,15,11,13,7,8,7,7],[13,15,14,11,7,7,6,8,13,14,13,12,5,5,6,9],[14,11,12,14,8,6,5,5,15,12,15,14,9,9,8,6],[15,12,13,13,9,5,8,6,14,11,12,11,8,6,5,5]].map(e=>new Uint8Array(e)),Af=Df.map((e,t)=>e.map(e=>kf[t][e])),jf=Of.map((e,t)=>e.map(e=>kf[t][e])),Mf=new Uint32Array([0,1518500249,1859775393,2400959708,2840853838]),Nf=new Uint32Array([1352829926,1548603684,1836072691,2053994217,0]),Pf=(e,t)=>e<<t|e>>>32-t;function Ff(e,t,n,r){return e===0?t^n^r:e===1?t&n|~t&r:e===2?(t|~n)^r:e===3?t&r|n&~r:t^(n|~r)}var If=new Uint32Array(16),Lf=class extends Cu.SHA2{constructor(){super(64,20,8,!0),this.h0=1732584193,this.h1=-271733879,this.h2=-1732584194,this.h3=271733878,this.h4=-1009589776}get(){let{h0:e,h1:t,h2:n,h3:r,h4:i}=this;return[e,t,n,r,i]}set(e,t,n,r,i){this.h0=e|0,this.h1=t|0,this.h2=n|0,this.h3=r|0,this.h4=i|0}process(e,t){for(let n=0;n<16;n++,t+=4)If[n]=e.getUint32(t,!0);let n=this.h0|0,r=n,i=this.h1|0,a=i,o=this.h2|0,s=o,c=this.h3|0,l=c,u=this.h4|0,d=u;for(let e=0;e<5;e++){let t=4-e,f=Mf[e],p=Nf[e],m=Df[e],h=Of[e],g=Af[e],_=jf[e];for(let t=0;t<16;t++){let r=Pf(n+Ff(e,i,o,c)+If[m[t]]+f,g[t])+u|0;n=u,u=c,c=Pf(o,10)|0,o=i,i=r}for(let e=0;e<16;e++){let n=Pf(r+Ff(t,a,s,l)+If[h[e]]+p,_[e])+d|0;r=d,d=l,l=Pf(s,10)|0,s=a,a=n}}this.set(this.h1+o+l|0,this.h2+c+d|0,this.h3+u+r|0,this.h4+n+a|0,this.h0+i+s|0)}roundClean(){If.fill(0)}destroy(){this.destroyed=!0,this.buffer.fill(0),this.set(0,0,0,0,0)}};Cf.RIPEMD160=Lf,Cf.ripemd160=(0,Q.wrapConstructor)(()=>new Lf),X.hmacSha256Sync=(e,...t)=>(0,jd.hmac)(Su.sha256,e,X.concatBytes(...t));var Rf=bd(Su.sha256);function zf(e){return BigInt(`0x${(0,Q.bytesToHex)(e)}`)}function Bf(e){return(0,Q.hexToBytes)(e.toString(16).padStart(64,`0`))}var Vf=(0,Q.utf8ToBytes)(`Bitcoin seed`),Hf={private:76066276,public:76067358},Uf=2147483648,Wf=e=>(0,Cf.ripemd160)((0,Su.sha256)(e)),Gf=e=>(0,Q.createView)(e).getUint32(0,!1),Kf=e=>{if(!Number.isSafeInteger(e)||e<0||e>2**32-1)throw Error(`Invalid number=${e}. Should be from 0 to 2 ** 32 - 1`);let t=new Uint8Array(4);return(0,Q.createView)(t).setUint32(0,e,!1),t},qf=class e{constructor(e){if(this.depth=0,this.index=0,this.chainCode=null,this.parentFingerprint=0,!e||typeof e!=`object`)throw Error(`HDKey.constructor must not be called directly`);if(this.versions=e.versions||Hf,this.depth=e.depth||0,this.chainCode=e.chainCode,this.index=e.index||0,this.parentFingerprint=e.parentFingerprint||0,!this.depth&&(this.parentFingerprint||this.index))throw Error(`HDKey: zero depth with non-zero index/parent fingerprint`);if(e.publicKey&&e.privateKey)throw Error(`HDKey: publicKey and privateKey at same time.`);if(e.privateKey){if(!X.isValidPrivateKey(e.privateKey))throw Error(`Invalid private key`);this.privKey=typeof e.privateKey==`bigint`?e.privateKey:zf(e.privateKey),this.privKeyBytes=Bf(this.privKey),this.pubKey=Zl(e.privateKey,!0)}else if(e.publicKey)this.pubKey=J.fromHex(e.publicKey).toRawBytes(!0);else throw Error(`HDKey: no public or private key provided`);this.pubHash=Wf(this.pubKey)}get fingerprint(){if(!this.pubHash)throw Error(`No publicKey set!`);return Gf(this.pubHash)}get identifier(){return this.pubHash}get pubKeyHash(){return this.pubHash}get privateKey(){return this.privKeyBytes||null}get publicKey(){return this.pubKey||null}get privateExtendedKey(){let e=this.privateKey;if(!e)throw Error(`No private key`);return Rf.encode(this.serialize(this.versions.private,(0,Q.concatBytes)(new Uint8Array([0]),e)))}get publicExtendedKey(){if(!this.pubKey)throw Error(`No public key`);return Rf.encode(this.serialize(this.versions.public,this.pubKey))}static fromMasterSeed(t,n=Hf){if((0,Z.bytes)(t),8*t.length<128||8*t.length>512)throw Error(`HDKey: wrong seed length=${t.length}. Should be between 128 and 512 bits; 256 bits is advised)`);let r=(0,jd.hmac)(Ld.sha512,Vf,t);return new e({versions:n,chainCode:r.slice(32),privateKey:r.slice(0,32)})}static fromExtendedKey(t,n=Hf){let r=Rf.decode(t),i=(0,Q.createView)(r),a=i.getUint32(0,!1),o={versions:n,depth:r[4],parentFingerprint:i.getUint32(5,!1),index:i.getUint32(9,!1),chainCode:r.slice(13,45)},s=r.slice(45),c=s[0]===0;if(a!==n[c?`private`:`public`])throw Error(`Version mismatch`);return c?new e({...o,privateKey:s.slice(1)}):new e({...o,publicKey:s})}static fromJSON(t){return e.fromExtendedKey(t.xpriv)}derive(e){if(!/^[mM]'?/.test(e))throw Error(`Path must start with "m" or "M"`);if(/^[mM]'?$/.test(e))return this;let t=e.replace(/^[mM]'?\//,``).split(`/`),n=this;for(let e of t){let t=/^(\d+)('?)$/.exec(e);if(!t||t.length!==3)throw Error(`Invalid child index: ${e}`);let r=+t[1];if(!Number.isSafeInteger(r)||r>=Uf)throw Error(`Invalid index`);t[2]===`'`&&(r+=Uf),n=n.deriveChild(r)}return n}deriveChild(t){if(!this.pubKey||!this.chainCode)throw Error(`No publicKey or chainCode set`);let n=Kf(t);if(t>=Uf){let e=this.privateKey;if(!e)throw Error(`Could not derive hardened child key`);n=(0,Q.concatBytes)(new Uint8Array([0]),e,n)}else n=(0,Q.concatBytes)(this.pubKey,n);let r=(0,jd.hmac)(Ld.sha512,this.chainCode,n),i=zf(r.slice(0,32)),a=r.slice(32);if(!X.isValidPrivateKey(i))throw Error(`Tweak bigger than curve order`);let o={versions:this.versions,chainCode:a,depth:this.depth+1,parentFingerprint:this.fingerprint,index:t};try{if(this.privateKey){let e=X.mod(this.privKey+i,q.n);if(!X.isValidPrivateKey(e))throw Error(`The tweak was out of range or the resulted private key is invalid`);o.privateKey=e}else{let e=J.fromHex(this.pubKey).add(J.fromPrivateKey(i));if(e.equals(J.ZERO))throw Error(`The tweak was equal to negative P, which made the result key invalid`);o.publicKey=e.toRawBytes(!0)}return new e(o)}catch{return this.deriveChild(t+1)}}sign(e){if(!this.privateKey)throw Error(`No privateKey set!`);return(0,Z.bytes)(e,32),au(e,this.privKey,{canonical:!0,der:!1})}verify(e,t){if((0,Z.bytes)(e,32),(0,Z.bytes)(t,64),!this.publicKey)throw Error(`No publicKey set!`);let n;try{n=Cl.fromCompact(t)}catch{return!1}return su(n,e,this.publicKey)}wipePrivateData(){return this.privKey=void 0,this.privKeyBytes&&=(this.privKeyBytes.fill(0),void 0),this}toJSON(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}}serialize(e,t){if(!this.chainCode)throw Error(`No chainCode set`);return(0,Z.bytes)(t,33),(0,Q.concatBytes)(Kf(e),new Uint8Array([this.depth]),Kf(this.parentFingerprint),Kf(this.index),this.chainCode,t)}},Jf=Object.defineProperty,Yf=(e,t)=>{for(var n in t)Jf(e,n,{get:t[n],enumerable:!0})};function Xf(){return X.bytesToHex(X.randomPrivateKey())}function Zf(e){return X.bytesToHex(vu.getPublicKey(e))}Yf({},{insertEventIntoAscendingList:()=>np,insertEventIntoDescendingList:()=>tp,normalizeURL:()=>ep,utf8Decoder:()=>Qf,utf8Encoder:()=>$f});var Qf=new TextDecoder(`utf-8`),$f=new TextEncoder;function ep(e){let t=new URL(e);return t.pathname=t.pathname.replace(/\/+/g,`/`),t.pathname.endsWith(`/`)&&(t.pathname=t.pathname.slice(0,-1)),(t.port===`80`&&t.protocol===`ws:`||t.port===`443`&&t.protocol===`wss:`)&&(t.port=``),t.searchParams.sort(),t.hash=``,t.toString()}function tp(e,t){let n=0,r=e.length-1,i,a=n;if(r<0)a=0;else if(t.created_at<e[r].created_at)a=r+1;else if(t.created_at>=e[n].created_at)a=n;else for(;;){if(r<=n+1){a=r;break}if(i=Math.floor(n+(r-n)/2),e[i].created_at>t.created_at)n=i;else if(e[i].created_at<t.created_at)r=i;else{a=i;break}}return e[a]?.id===t.id?e:[...e.slice(0,a),t,...e.slice(a)]}function np(e,t){let n=0,r=e.length-1,i,a=n;if(r<0)a=0;else if(t.created_at>e[r].created_at)a=r+1;else if(t.created_at<=e[n].created_at)a=n;else for(;;){if(r<=n+1){a=r;break}if(i=Math.floor(n+(r-n)/2),e[i].created_at<t.created_at)n=i;else if(e[i].created_at>t.created_at)r=i;else{a=i;break}}return e[a]?.id===t.id?e:[...e.slice(0,a),t,...e.slice(a)]}function rp(e,t){let n=e;return n.pubkey=Zf(t),n.id=ap(n),n.sig=lp(n,t),n}function ip(e){if(!sp(e))throw Error(`can't serialize event with wrong or missing properties`);return JSON.stringify([0,e.pubkey,e.created_at,e.kind,e.tags,e.content])}function ap(e){let t=(0,Su.sha256)($f.encode(ip(e)));return X.bytesToHex(t)}var op=e=>e instanceof Object;function sp(e){if(!op(e)||typeof e.kind!=`number`||typeof e.content!=`string`||typeof e.created_at!=`number`||typeof e.pubkey!=`string`||!e.pubkey.match(/^[a-f0-9]{64}$/)||!Array.isArray(e.tags))return!1;for(let t=0;t<e.tags.length;t++){let n=e.tags[t];if(!Array.isArray(n))return!1;for(let e=0;e<n.length;e++)if(typeof n[e]==`object`)return!1}return!0}function cp(e){return vu.verifySync(e.sig,ap(e),e.pubkey)}function lp(e,t){return X.bytesToHex(vu.signSync(ap(e),t))}function up(e,t){if(e.ids&&e.ids.indexOf(t.id)===-1&&!e.ids.some(e=>t.id.startsWith(e))||e.kinds&&e.kinds.indexOf(t.kind)===-1||e.authors&&e.authors.indexOf(t.pubkey)===-1&&!e.authors.some(e=>t.pubkey.startsWith(e)))return!1;for(let n in e)if(n[0]===`#`){let r=e[`#${n.slice(1)}`];if(r&&!t.tags.find(([e,t])=>e===n.slice(1)&&r.indexOf(t)!==-1))return!1}return!(e.since&&t.created_at<e.since||e.until&&t.created_at>=e.until)}function dp(e,t){for(let n=0;n<e.length;n++)if(up(e[n],t))return!0;return!1}Yf({},{getHex64:()=>fp,getInt:()=>pp,getSubscriptionId:()=>mp,matchEventId:()=>hp,matchEventKind:()=>_p,matchEventPubkey:()=>gp});function fp(e,t){let n=t.length+3,r=e.indexOf(`"${t}":`)+n,i=e.slice(r).indexOf(`"`)+r+1;return e.slice(i,i+64)}function pp(e,t){let n=t.length,r=e.indexOf(`"${t}":`)+n+3,i=e.slice(r),a=Math.min(i.indexOf(`,`),i.indexOf(`}`));return parseInt(i.slice(0,a),10)}function mp(e){let t=e.slice(0,22).indexOf(`"EVENT"`);if(t===-1)return null;let n=e.slice(t+7+1).indexOf(`"`);if(n===-1)return null;let r=t+7+1+n,i=e.slice(r+1,80).indexOf(`"`);if(i===-1)return null;let a=r+1+i;return e.slice(r+1,a)}function hp(e,t){return t===fp(e,`id`)}function gp(e,t){return t===fp(e,`pubkey`)}function _p(e,t){return t===pp(e,`kind`)}var vp=()=>({connect:[],disconnect:[],error:[],notice:[],auth:[]});function yp(e,t={}){let{listTimeout:n=3e3,getTimeout:r=3e3,countTimeout:i=3e3}=t;var a,o={},s=vp(),c={},l={},u;async function d(){return u||(u=new Promise((t,n)=>{try{a=new WebSocket(e)}catch(e){n(e)}a.onopen=()=>{s.connect.forEach(e=>e()),t()},a.onerror=()=>{u=void 0,s.error.forEach(e=>e()),n()},a.onclose=async()=>{u=void 0,s.disconnect.forEach(e=>e())};let r=[],i;a.onmessage=e=>{r.push(e.data),i||=setInterval(d,0)};function d(){if(r.length===0){clearInterval(i),i=null;return}var t=r.shift();if(!t)return;let n=mp(t);if(n){let r=o[n];if(r&&r.alreadyHaveEvent&&r.alreadyHaveEvent(fp(t,`id`),e))return}try{let e=JSON.parse(t);switch(e[0]){case`EVENT`:{let t=e[1],n=e[2];sp(n)&&o[t]&&(o[t].skipVerification||cp(n))&&dp(o[t].filters,n)&&(o[t],(c[t]?.event||[]).forEach(e=>e(n)));return}case`COUNT`:let t=e[1],n=e[2];o[t]&&(c[t]?.count||[]).forEach(e=>e(n));return;case`EOSE`:{let t=e[1];t in c&&(c[t].eose.forEach(e=>e()),c[t].eose=[]);return}case`OK`:{let t=e[1],n=e[2],r=e[3]||``;t in l&&(n?l[t].ok.forEach(e=>e()):l[t].failed.forEach(e=>e(r)),l[t].ok=[],l[t].failed=[]);return}case`NOTICE`:let r=e[1];s.notice.forEach(e=>e(r));return;case`AUTH`:{let t=e[1];s.auth?.forEach(e=>e(t));return}}}catch{return}}}),u)}function f(){return a?.readyState===1}async function p(){f()||await d()}async function m(e){let t=JSON.stringify(e);if(!(!f()&&(await new Promise(e=>setTimeout(e,1e3)),!f())))try{a.send(t)}catch(e){console.log(e)}}let h=(e,{verb:t=`REQ`,skipVerification:n=!1,alreadyHaveEvent:r=null,id:i=Math.random().toString().slice(2)}={})=>{let a=i;return o[a]={id:a,filters:e,skipVerification:n,alreadyHaveEvent:r},m([t,a,...e]),{sub:(t,i={})=>h(t||e,{skipVerification:i.skipVerification||n,alreadyHaveEvent:i.alreadyHaveEvent||r,id:a}),unsub:()=>{delete o[a],delete c[a],m([`CLOSE`,a])},on:(e,t)=>{c[a]=c[a]||{event:[],count:[],eose:[]},c[a][e].push(t)},off:(e,t)=>{let n=c[a],r=n[e].indexOf(t);r>=0&&n[e].splice(r,1)}}};function g(e,t){if(!e.id)throw Error(`event ${e} has no id`);let n=e.id;return m([t,e]),{on:(e,t)=>{l[n]=l[n]||{ok:[],failed:[]},l[n][e].push(t)},off:(e,t)=>{let r=l[n];if(!r)return;let i=r[e].indexOf(t);i>=0&&r[e].splice(i,1)}}}return{url:e,sub:h,on:(e,t)=>{s[e].push(t),e===`connect`&&a?.readyState===1&&t()},off:(e,t)=>{let n=s[e].indexOf(t);n!==-1&&s[e].splice(n,1)},list:(e,t)=>new Promise(r=>{let i=h(e,t),a=[],o=setTimeout(()=>{i.unsub(),r(a)},n);i.on(`eose`,()=>{i.unsub(),clearTimeout(o),r(a)}),i.on(`event`,e=>{a.push(e)})}),get:(e,t)=>new Promise(n=>{let i=h([e],t),a=setTimeout(()=>{i.unsub(),n(null)},r);i.on(`event`,e=>{i.unsub(),clearTimeout(a),n(e)})}),count:e=>new Promise(t=>{let n=h(e,{...h,verb:`COUNT`}),r=setTimeout(()=>{n.unsub(),t(null)},i);n.on(`count`,e=>{n.unsub(),clearTimeout(r),t(e)})}),publish(e){return g(e,`EVENT`)},auth(e){return g(e,`AUTH`)},connect:p,close(){s=vp(),c={},l={},a.readyState===WebSocket.OPEN&&a?.close()},get status(){return a?.readyState??3}}}var bp=class{_conn;_seenOn={};eoseSubTimeout;getTimeout;constructor(e={}){this._conn={},this.eoseSubTimeout=e.eoseSubTimeout||3400,this.getTimeout=e.getTimeout||3400}close(e){e.forEach(e=>{let t=this._conn[ep(e)];t&&t.close()})}async ensureRelay(e){let t=ep(e);this._conn[t]||(this._conn[t]=yp(t,{getTimeout:this.getTimeout*.9,listTimeout:this.getTimeout*.9}));let n=this._conn[t];return await n.connect(),n}sub(e,t,n){let r=new Set,i={...n||{}};i.alreadyHaveEvent=(e,t)=>{if(n?.alreadyHaveEvent?.(e,t))return!0;let i=this._seenOn[e]||new Set;return i.add(t),this._seenOn[e]=i,r.has(e)};let a=[],o=new Set,s=new Set,c=e.length,l=!1,u=setTimeout(()=>{l=!0;for(let e of s.values())e()},this.eoseSubTimeout);e.forEach(async e=>{let n;try{n=await this.ensureRelay(e)}catch{f();return}if(!n)return;let d=n.sub(t,i);d.on(`event`,e=>{r.add(e.id);for(let t of o.values())t(e)}),d.on(`eose`,()=>{l||f()}),a.push(d);function f(){if(c--,c===0){clearTimeout(u);for(let e of s.values())e()}}});let d={sub(e,t){return a.forEach(n=>n.sub(e,t)),d},unsub(){a.forEach(e=>e.unsub())},on(e,t){e===`event`?o.add(t):e===`eose`&&s.add(t)},off(e,t){e===`event`?o.delete(t):e===`eose`&&s.delete(t)}};return d}get(e,t,n){return new Promise(r=>{let i=this.sub(e,[t],n),a=setTimeout(()=>{i.unsub(),r(null)},this.getTimeout);i.on(`event`,e=>{r(e),clearTimeout(a),i.unsub()})})}list(e,t,n){return new Promise(r=>{let i=[],a=this.sub(e,t,n);a.on(`event`,e=>{i.push(e)}),a.on(`eose`,()=>{a.unsub(),r(i)})})}publish(e,t){let n=e.map(async e=>{let n;try{return n=await this.ensureRelay(e),n.publish(t)}catch{return{on(){},off(){}}}}),r=new Map;return{on(t,i){e.forEach(async(e,a)=>{let o=await n[a],s=()=>i(e);r.set(i,s),o.on(t,s)})},off(t,i){e.forEach(async(e,a)=>{let o=r.get(i);o&&(await n[a]).off(t,o)})}}}seenOn(e){return Array.from(this._seenOn[e]?.values?.()||[])}},xp={};Yf(xp,{decode:()=>Cp,naddrEncode:()=>jp,neventEncode:()=>Ap,noteEncode:()=>Dp,nprofileEncode:()=>kp,npubEncode:()=>Ep,nrelayEncode:()=>Mp,nsecEncode:()=>Tp});var Sp=5e3;function Cp(e){let{prefix:t,words:n}=Ed.decode(e,Sp),r=new Uint8Array(Ed.fromWords(n));switch(t){case`nprofile`:{let e=wp(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nprofile`);if(e[0][0].length!==32)throw Error(`TLV 0 should be 32 bytes`);return{type:`nprofile`,data:{pubkey:X.bytesToHex(e[0][0]),relays:e[1]?e[1].map(e=>Qf.decode(e)):[]}}}case`nevent`:{let e=wp(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nevent`);if(e[0][0].length!==32)throw Error(`TLV 0 should be 32 bytes`);if(e[2]&&e[2][0].length!==32)throw Error(`TLV 2 should be 32 bytes`);return{type:`nevent`,data:{id:X.bytesToHex(e[0][0]),relays:e[1]?e[1].map(e=>Qf.decode(e)):[],author:e[2]?.[0]?X.bytesToHex(e[2][0]):void 0}}}case`naddr`:{let e=wp(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for naddr`);if(!e[2]?.[0])throw Error(`missing TLV 2 for naddr`);if(e[2][0].length!==32)throw Error(`TLV 2 should be 32 bytes`);if(!e[3]?.[0])throw Error(`missing TLV 3 for naddr`);if(e[3][0].length!==4)throw Error(`TLV 3 should be 4 bytes`);return{type:`naddr`,data:{identifier:Qf.decode(e[0][0]),pubkey:X.bytesToHex(e[2][0]),kind:parseInt(X.bytesToHex(e[3][0]),16),relays:e[1]?e[1].map(e=>Qf.decode(e)):[]}}}case`nrelay`:{let e=wp(r);if(!e[0]?.[0])throw Error(`missing TLV 0 for nrelay`);return{type:`nrelay`,data:Qf.decode(e[0][0])}}case`nsec`:case`npub`:case`note`:return{type:t,data:X.bytesToHex(r)};default:throw Error(`unknown prefix ${t}`)}}function wp(e){let t={},n=e;for(;n.length>0;){let e=n[0],r=n[1],i=n.slice(2,2+r);n=n.slice(2+r),!(i.length<r)&&(t[e]=t[e]||[],t[e].push(i))}return t}function Tp(e){return Op(`nsec`,e)}function Ep(e){return Op(`npub`,e)}function Dp(e){return Op(`note`,e)}function Op(e,t){let n=X.hexToBytes(t),r=Ed.toWords(n);return Ed.encode(e,r,Sp)}function kp(e){let t=Np({0:[X.hexToBytes(e.pubkey)],1:(e.relays||[]).map(e=>$f.encode(e))}),n=Ed.toWords(t);return Ed.encode(`nprofile`,n,Sp)}function Ap(e){let t=Np({0:[X.hexToBytes(e.id)],1:(e.relays||[]).map(e=>$f.encode(e)),2:e.author?[X.hexToBytes(e.author)]:[]}),n=Ed.toWords(t);return Ed.encode(`nevent`,n,Sp)}function jp(e){let t=new ArrayBuffer(4);new DataView(t).setUint32(0,e.kind,!1);let n=Np({0:[$f.encode(e.identifier)],1:(e.relays||[]).map(e=>$f.encode(e)),2:[X.hexToBytes(e.pubkey)],3:[new Uint8Array(t)]}),r=Ed.toWords(n);return Ed.encode(`naddr`,r,Sp)}function Mp(e){let t=Np({0:[$f.encode(e)]}),n=Ed.toWords(t);return Ed.encode(`nrelay`,n,Sp)}function Np(e){let t=[];return Object.entries(e).forEach(([e,n])=>{n.forEach(n=>{let r=new Uint8Array(n.length+2);r.set([parseInt(e)],0),r.set([n.length],1),r.set(n,2),t.push(r)})}),X.concatBytes(...t)}Yf({},{decrypt:()=>Fp,encrypt:()=>Pp});async function Pp(e,t,n){let r=Ip($l(e,`02`+t)),i=Uint8Array.from((0,Q.randomBytes)(16)),a=$f.encode(n),o=await crypto.subtle.importKey(`raw`,r,{name:`AES-CBC`},!1,[`encrypt`]),s=await crypto.subtle.encrypt({name:`AES-CBC`,iv:i},o,a);return`${md.encode(new Uint8Array(s))}?iv=${md.encode(new Uint8Array(i.buffer))}`}async function Fp(e,t,n){let[r,i]=n.split(`?iv=`),a=Ip($l(e,`02`+t)),o=await crypto.subtle.importKey(`raw`,a,{name:`AES-CBC`},!1,[`decrypt`]),s=md.decode(r),c=md.decode(i),l=await crypto.subtle.decrypt({name:`AES-CBC`,iv:c},o,s);return Qf.decode(l)}function Ip(e){return e.slice(1,33)}Yf({},{queryProfile:()=>Bp,searchDomain:()=>zp,useFetchImplementation:()=>Rp});var Lp;try{Lp=fetch}catch{}function Rp(e){Lp=e}async function zp(e,t=``){try{return(await(await Lp(`https://${e}/.well-known/nostr.json?name=${t}`)).json()).names}catch{return{}}}async function Bp(e){let[t,n]=e.split(`@`);if(n||(n=t,t=`_`),!t.match(/^[A-Za-z0-9-_.]+$/)||!n.includes(`.`))return null;let r;try{r=await(await Lp(`https://${n}/.well-known/nostr.json?name=${t}`)).json()}catch{return null}if(!r?.names?.[t])return null;let i=r.names[t];return{pubkey:i,relays:r.relays?.[i]||[]}}Yf({},{generateSeedWords:()=>Hp,privateKeyFromSeedWords:()=>Vp,validateWords:()=>Up});function Vp(e,t){let n=qf.fromMasterSeed((0,kd.mnemonicToSeedSync)(e,t)).derive(`m/44'/1237'/0'/0/0`).privateKey;if(!n)throw Error(`could not derive private key`);return X.bytesToHex(n)}function Hp(){return(0,kd.generateMnemonic)(Od.wordlist)}function Up(e){return(0,kd.validateMnemonic)(e,Od.wordlist)}Yf({},{parse:()=>Wp});function Wp(e){let t={reply:void 0,root:void 0,mentions:[],profiles:[]},n=[];for(let r of e.tags)r[0]===`e`&&r[1]&&n.push(r),r[0]===`p`&&r[1]&&t.profiles.push({pubkey:r[1],relays:r[2]?[r[2]]:[]});for(let e=0;e<n.length;e++){let[r,i,a,o]=n[e],s={id:i,relays:a?[a]:[]},c=e===0,l=e===n.length-1;o===`root`?t.root=s:o===`reply`?t.reply=s:o===`mention`?t.mentions.push(s):c?t.root=s:l?t.reply=s:t.mentions.push(s)}return t}Yf({},{getPow:()=>Gp});function Gp(e){return Kp(X.hexToBytes(e))}function Kp(e){let t,n,r;for(n=0,t=0;n<e.length&&(r=qp(e[n]),t+=r,r===8);n++);return t}function qp(e){let t=0;if(e===0)return 8;for(;e>>=1;)t++;return 7-t}Yf({},{BECH32_REGEX:()=>Jp,NOSTR_URI_REGEX:()=>Yp,parse:()=>Zp,test:()=>Xp});var Jp=/[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/,Yp=RegExp(`nostr:(${Jp.source})`);function Xp(e){return typeof e==`string`&&RegExp(`^${Yp.source}$`).test(e)}function Zp(e){let t=e.match(RegExp(`^${Yp.source}$`));if(!t)throw Error(`Invalid Nostr URI: ${e}`);return{uri:t[0],value:t[1],decoded:Cp(t[1])}}Yf({},{createDelegation:()=>Qp,getDelegator:()=>$p});function Qp(e,t){let n=[];(t.kind||-1)>=0&&n.push(`kind=${t.kind}`),t.until&&n.push(`created_at<${t.until}`),t.since&&n.push(`created_at>${t.since}`);let r=n.join(`&`);if(r===``)throw Error(`refusing to create a delegation without any conditions`);let i=(0,Su.sha256)($f.encode(`nostr:delegation:${t.pubkey}:${r}`)),a=X.bytesToHex(vu.signSync(i,e));return{from:Zf(e),to:t.pubkey,cond:r,sig:a}}function $p(e){let t=e.tags.find(e=>e[0]===`delegation`&&e.length>=4);if(!t)return null;let n=t[1],r=t[2],i=t[3],a=r.split(`&`);for(let t=0;t<a.length;t++){let[n,r,i]=a[t].split(/\b/);if((n!==`kind`||r!==`=`||e.kind!==parseInt(i))&&!(n===`created_at`&&r===`<`&&e.created_at<parseInt(i))&&!(n===`created_at`&&r===`>`&&e.created_at>parseInt(i)))return null}let o=(0,Su.sha256)($f.encode(`nostr:delegation:${e.pubkey}:${r}`));return vu.verifySync(i,o,n)?n:null}Yf({},{matchAll:()=>tm,regex:()=>em,replaceAll:()=>nm});var em=()=>RegExp(`\\b${Yp.source}\\b`,`g`);function*tm(e){let t=e.matchAll(em());for(let e of t){let[t,n]=e;yield{uri:t,value:n,decoded:Cp(n),start:e.index,end:e.index+t.length}}}function nm(e,t){return e.replaceAll(em(),(e,n)=>t({uri:e,value:n,decoded:Cp(n)}))}Yf({},{useFetchImplementation:()=>im,validateGithub:()=>am});var rm;try{rm=fetch}catch{}function im(e){rm=e}async function am(e,t,n){try{return await(await rm(`https://gist.github.com/${t}/${n}/raw`)).text()===`Verifying that I control the following Nostr public key: ${e}`}catch{return!1}}Yf({},{authenticate:()=>om});var om=async({challenge:e,relay:t,sign:n})=>{let r={kind:22242,created_at:Math.floor(Date.now()/1e3),tags:[[`relay`,t.url],[`challenge`,e]],content:``},i=t.auth(await n(r));return new Promise((e,t)=>{i.on(`ok`,function t(){i.off(`ok`,t),e()}),i.on(`failed`,function e(n){i.off(`failed`,e),t(n)})})},sm={};Yf(sm,{getZapEndpoint:()=>um,makeZapReceipt:()=>pm,makeZapRequest:()=>dm,useFetchImplementation:()=>lm,validateZapRequest:()=>fm});var cm;try{cm=fetch}catch{}function lm(e){cm=e}async function um(e){try{let t=``,{lud06:n,lud16:r}=JSON.parse(e.content);if(n){let{words:e}=Ed.decode(n,1e3),r=Ed.fromWords(e);t=Qf.decode(r)}else if(r){let[e,n]=r.split(`@`);t=`https://${n}/.well-known/lnurlp/${e}`}else return null;let i=await(await cm(t)).json();if(i.allowsNostr&&i.nostrPubkey)return i.callback}catch{}return null}function dm({profile:e,event:t,amount:n,relays:r,comment:i=``}){if(!n)throw Error(`amount not given`);if(!e)throw Error(`profile not given`);let a={kind:9734,created_at:Math.round(Date.now()/1e3),content:i,tags:[[`p`,e],[`amount`,n.toString()],[`relays`,...r]]};return t&&a.tags.push([`e`,t]),a}function fm(e){let t;try{t=JSON.parse(e)}catch{return`Invalid zap request JSON.`}if(!sp(t))return`Zap request is not a valid Nostr event.`;if(!cp(t))return`Invalid signature on zap request.`;let n=t.tags.find(([e,t])=>e===`p`&&t);if(!n)return`Zap request doesn't have a 'p' tag.`;if(!n[1].match(/^[a-f0-9]{64}$/))return`Zap request 'p' tag is not valid hex.`;let r=t.tags.find(([e,t])=>e===`e`&&t);return r&&!r[1].match(/^[a-f0-9]{64}$/)?`Zap request 'e' tag is not valid hex.`:t.tags.find(([e,t])=>e===`relays`&&t)?null:`Zap request doesn't have a 'relays' tag.`}function pm({zapRequest:e,preimage:t,bolt11:n,paidAt:r}){let i=JSON.parse(e).tags.filter(([e])=>e===`e`||e===`p`||e===`a`),a={kind:9735,created_at:Math.round(r.getTime()/1e3),content:``,tags:[...i,[`bolt11`,n],[`description`,e]]};return t&&a.tags.push([`preimage`,t]),a}X.hmacSha256Sync=(e,...t)=>(0,jd.hmac)(Su.sha256,e,X.concatBytes(...t)),X.sha256Sync=(...e)=>(0,Su.sha256)(X.concatBytes(...e));var mm=e=>xp.decode(e).data,hm=e=>xp.decode(e).data,gm={},_m=async e=>{if(gm[e])return gm[e];let t=new bp,n=[`wss://relay.ditto.pub`,`wss://purplepag.es`,`wss://relay.damus.io`,`wss://nostr.wine`];try{return await t.get(n,{authors:[e],kinds:[0]})}catch{throw Error(`failed to fetch user profile :(`)}finally{t.close(n)}},vm=e=>JSON.parse(e.content),ym=async e=>{let t=await sm.getZapEndpoint(e);if(!t)throw Error(`failed to retrieve zap endpoint :(`);return t},bm=async(e,t)=>{let n=Cm()&&!t;if(n)try{return{signedEvent:await window.nostr.signEvent(e),signedAnonymously:!1,usedAnonymousFallback:!1}}catch{}return e.tags.some(e=>e[0]===`anon`)||e.tags.push([`anon`]),{signedEvent:rp(e,Xf()),signedAnonymously:!0,usedAnonymousFallback:n}},xm=async({profile:e,nip19Target:t,amount:n,relays:r,comment:i,anon:a})=>{let o=sm.makeZapRequest({profile:e,event:t&&t.startsWith(`note`)?hm(t):void 0,amount:n,relays:r,comment:i}),s=t&&t.startsWith(`naddr`)?hm(t):void 0;if(s){let e=s.relays?s.relays.reduce((e,t)=>`${t},${e}`,``):``;o.tags.push([`a`,`${s.kind}:${s.pubkey}:${s.identifier}`,e])}return(!Cm()||a)&&o.tags.push([`anon`]),bm(o,a)},Sm=async({zapEndpoint:e,amount:t,comment:n,authorId:r,nip19Target:i,normalizedRelays:a,anon:o})=>{let{signedEvent:s,signedAnonymously:c,usedAnonymousFallback:l}=await xm({profile:r,nip19Target:i,amount:t,relays:a,comment:n,anon:o}),u=`${e}?amount=${t}&nostr=${encodeURIComponent(JSON.stringify(s))}`;n&&(u=`${u}&comment=${encodeURIComponent(n)}`);let{pr:d,reason:f,status:p}=await(await fetch(u)).json();if(d)return{invoice:d,signedAnonymously:c,usedAnonymousFallback:l};throw Error(p===`ERROR`?f??`Unable to fetch invoice`:`Unable to fetch invoice`)},Cm=()=>window!==void 0&&window.nostr!==void 0,wm=({relays:e,invoice:t,onSuccess:n,recipientPubkey:r})=>{let i=new bp,a=Array.from(new Set([...e,`wss://relay.ditto.pub`])),o=Math.round(Date.now()/1e3),s=!1,c=null,l=null,u=()=>{s||(s=!0,l&&=(clearInterval(l),null),c&&=(c.unsub(),null),i.close(a))},d={kinds:[9735],since:o};r&&(d[`#p`]=[r]);let f=()=>{s||(c&&=(c.unsub(),null),c=i.sub(a,[d]),c.on(`event`,e=>{s||e.tags.find(e=>e[0]===`bolt11`&&e[1]===t)&&(n(),u())}))};return f(),l=setInterval(f,5e3),u},Tm=`nostrZap.`,Em=`lightningUri`,Dm=()=>typeof localStorage<`u`,Om=e=>{if(Dm())return localStorage.getItem(`${Tm}${e}`)},km=(e,t)=>{Dm()&&localStorage.setItem(`${Tm}${e}`,t)},Am=()=>Om(Em),jm=e=>km(Em,e),Mm=null,Nm=e=>String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`),Pm=e=>{try{let{protocol:t}=new URL(e);return t===`https:`||t===`http:`}catch{return!1}},Fm=(e,t)=>{if(e?.lud16&&typeof e.lud16==`string`)return e.lud16;try{return new URL(t).host}catch{return t}},Im=e=>{if(typeof e!=`string`)return null;let t=e.trim();return/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(t)?t:null},Lm=e=>{e=e.replace(/^#/,``),e.length===3&&(e=e.split(``).map(e=>e+e).join(``));let t=parseInt(e,16);return{r:t>>16&255,g:t>>8&255,b:t&255}},Rm=({r:e,g:t,b:n})=>(e*299+t*587+n*114)/1e3,zm=e=>Rm(Lm(e))<128?`#fff`:`#000`,Bm=e=>{let t=document.createElement(`dialog`);return t.classList.add(`nostr-zap-dialog`),t.innerHTML=e,t.addEventListener(`click`,function({clientX:e,clientY:n}){let{left:r,right:i,top:a,bottom:o}=t.getBoundingClientRect();(e!==0||n!==0)&&(e<r||e>i||n<a||n>o)&&t.close()}),Ym(),Mm.appendChild(t),t},Vm=(e=!1)=>`<p class="zap-anon-notice">Extension signing was declined or failed. This zap ${e?`was`:`will be`} sent anonymously.</p>`,Hm=()=>{let e=Bm(`
    <button class="close-button">X</button>
    ${Vm(!0)}
    <button class="cta-button">OK</button>
  `);return e.addEventListener(`close`,function(){e.remove()}),e.querySelector(`.close-button`).addEventListener(`click`,function(){e.close()}),e.querySelector(`.cta-button`).addEventListener(`click`,function(){e.close()}),e},Um=({dialogHeader:e,invoice:t,relays:n,buttonColor:r,usedAnonymousFallback:i,recipientPubkey:a})=>{let o=Am(),s=Im(r),c=Bm(`
        <button class="close-button">X</button>
        ${e}
        ${i?Vm():``}
        <div class="qrcode">
          <div class="overlay">copied invoice to clipboard</div>
        </div>
        <p>click QR code to copy invoice</p>
        <select name="lightning-wallet">
          ${[{label:`Default Wallet`,value:`lightning:`},{label:`Strike`,value:`strike:lightning:`},{label:`Cash App`,value:`https://cash.app/launch/lightning/`},{label:`Muun`,value:`muun:`},{label:`Blue Wallet`,value:`bluewallet:lightning:`},{label:`Wallet of Satoshi`,value:`walletofsatoshi:lightning:`},{label:`Zebedee`,value:`zebedee:lightning:`},{label:`Zeus LN`,value:`zeusln:lightning:`},{label:`Phoenix`,value:`phoenix://`},{label:`Breez`,value:`breez:`},{label:`Bitcoin Beach`,value:`bitcoinbeach://`},{label:`Blixt`,value:`blixtwallet:lightning:`},{label:`River`,value:`river://`}].map(({label:e,value:t})=>`<option value="${t}" ${o===t?`selected`:``}>${e}</option>`).join(``)}
        </select>
        <button class="cta-button"
          ${s?`style="background-color: ${s}; color: ${zm(s)}"`:``} 
        >Open Wallet</button>
      `),l=c.querySelector(`.qrcode`),u=c.querySelector(`select[name="lightning-wallet"]`),d=c.querySelector(`.cta-button`),f=l.querySelector(`.overlay`),p=wm({relays:n,invoice:t,recipientPubkey:a,onSuccess:()=>{c.close()}});return new(Xc(tl))(l,{text:t,quietZone:10}),l.addEventListener(`click`,function(){navigator.clipboard.writeText(t),f.classList.add(`show`),setTimeout(()=>f.classList.remove(`show`),2e3)}),d.addEventListener(`click`,function(){jm(u.value),window.location.href=`${u.value}${t}`}),c.addEventListener(`close`,function(){p(),c.remove()}),c.querySelector(`.close-button`).addEventListener(`click`,function(){c.close()}),c},Wm=async({npub:e,nip19Target:t,relays:n,buttonColor:r,anon:i})=>{let a=e=>`${e.substring(0,12)}...${e.substring(e.length-12)}`,o=n?n.split(`,`):[`wss://relay.ditto.pub`,`wss://relay.damus.io`,`wss://nos.lol`],s=mm(e),c=_m(s),l=c.then(ym),u=Im(r),d=`https://pbs.twimg.com/profile_images/1604195803748306944/LxHDoJ7P_400x400.jpg`,f=async()=>{let[n,r]=await Promise.all([c,l]),i=vm(n),{picture:o,display_name:s,name:u}=i,f=o&&Pm(o)?o:d;return`
      <h2>${Nm(s||u||``)}</h2>
        <img
          src="${Nm(f)}"
          width="80"
          height="80"
          alt="nostr user avatar"
        />
      <p class="zap-destination">${Nm(Fm(i,r))}</p>
      <p>${Nm(a(t||e))}</p>
    `},p=Bm(`
      <button class="close-button">X</button>
      <div class="dialog-header-container">
        <h2 class="skeleton-placeholder"></h2>
          <img
            src="${d}"
            width="80"
            height="80"
            alt="placeholder avatar"
          />
        <p class="skeleton-placeholder"></p>
      </div>
      <div class="preset-zap-options-container">
        <button data-value="21">21 \u{26A1}\u{FE0F}</button>
        <button data-value="69">69 \u{26A1}\u{FE0F}</button>
        <button data-value="420">420 \u{26A1}\u{FE0F}</button>
        <button data-value="1337">1337 \u{26A1}\u{FE0F}</button>
        <button data-value="5000">5k \u{26A1}\u{FE0F}</button>
        <button data-value="10000">10k \u{26A1}\u{FE0F}</button>
        <button data-value="21000">21k \u{26A1}\u{FE0F}</button>
        <button data-value="1000000">1M \u{26A1}\u{FE0F}</button>
      </div>
      <form>
        <input name="amount" type="number" placeholder="amount in sats" required />
        <input name="comment" placeholder="optional comment" />
        <button class="cta-button" 
          ${u?`style="background-color: ${u}; color: ${zm(u)}"`:``} 
          type="submit" disabled>Zap</button>
      </form>
    `),m=p.querySelector(`.preset-zap-options-container`),h=p.querySelector(`form`),g=p.querySelector(`input[name="amount"]`),_=p.querySelector(`input[name="comment"]`),v=p.querySelector(`button[type="submit"]`),y=p.querySelector(`.dialog-header-container`),b=t=>{p.close(),Gm(t,e).showModal()};f().then(e=>{y.innerHTML=e,v.disabled=!1}).catch(b);let x=()=>{v.disabled=!0,v.innerHTML=`<div class="spinner">Loading</div>`},S=()=>{v.disabled=!1,v.innerHTML=`Zap`},C=e=>{g.value=e};return p.addEventListener(`close`,function(){S(),h.reset()}),p.querySelector(`.close-button`).addEventListener(`click`,function(){p.close()}),m.addEventListener(`click`,function(e){e.target.matches(`button`)&&(C(e.target.getAttribute(`data-value`)),g.focus())}),h.addEventListener(`submit`,async function(e){e.preventDefault(),x();let n=Number(g.value)*1e3,r=_.value;try{let{invoice:e,usedAnonymousFallback:a}=await Sm({zapEndpoint:await l,amount:n,comment:r,authorId:s,nip19Target:t,normalizedRelays:o,anon:i}),c=async()=>{let t=Um({dialogHeader:await f(),invoice:e,relays:o,buttonColor:u,usedAnonymousFallback:a,recipientPubkey:s}),n=t.querySelector(`.cta-button`);p.close(),t.showModal(),n.focus()};if(window.webln)try{if(await window.webln.enable(),await window.webln.sendPayment(e),p.close(),a){let e=Hm();e.showModal(),e.querySelector(`.cta-button`).focus()}}catch{c()}else c()}catch(e){b(e)}}),p},Gm=(e,t)=>{let n=Bm(`
    <button class="close-button">X</button>
    <p class="error-message">${Nm(e instanceof Error?e.message:String(e??`Something went wrong`))}</p>
    <a href="https://nosta.me/${encodeURIComponent(String(t??``))}" target="_blank" rel="noopener noreferrer">
      <button class="cta-button">View Nostr Profile</button>
    </a>
  `);return n.addEventListener(`close`,function(){n.remove()}),n.querySelector(`.close-button`).addEventListener(`click`,function(){n.close()}),n},Km=async({npub:e,noteId:t,naddr:n,relays:r,cachedAmountDialog:i,buttonColor:a,anon:o})=>{let s=i;try{return s||=await Wm({npub:e,nip19Target:n||t,relays:r,buttonColor:a,anon:o}),s.showModal(),window.matchMedia(`(max-height: 932px)`).matches||s.querySelector(`input[name="amount"]`).focus(),s}catch(t){s&&s.close(),Gm(t,e).showModal()}},qm=e=>{let t=null,n=null;e.addEventListener(`click`,async function(){let r=e.getAttribute(`data-npub`),i=e.getAttribute(`data-note-id`),a=e.getAttribute(`data-naddr`),o=e.getAttribute(`data-relays`),s=e.getAttribute(`data-button-color`),c=e.getAttribute(`data-anon`)===`true`;n&&(n.npub!==r||n.noteId!==i||n.naddr!==a||n.relays!==o||n.buttonColor!==s||n.anon!==c)&&(t=null),n={npub:r,noteId:i,naddr:a,relays:o,buttonColor:s,anon:c},t=await Km({npub:r,noteId:i,naddr:a,relays:o,cachedAmountDialog:t,buttonColor:s,anon:c})})},Jm=e=>{document.querySelectorAll(e||`[data-npub]`).forEach(qm)},Ym=()=>{if(Mm)return;let e=document.createElement(`style`);e.innerHTML=`
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
      .nostr-zap-dialog .zap-destination {
        font-size: 0.875em;
        color: #4a5568;
        margin: 4px;
        word-break: break-word;
      }
      .nostr-zap-dialog .zap-anon-notice {
        font-size: 0.875em;
        color: #744210;
        margin: 8px 0 0 0;
        word-break: break-word;
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
  `;let t=document.createElement(`div`);document.body.appendChild(t),Mm=t.attachShadow({mode:`closed`}),Mm.appendChild(e)},Xm=()=>{Ym(),Jm()};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,Xm):Xm(),window.nostrZap={init:Km,initTarget:qm,initTargets:Jm};export{Jc as t};