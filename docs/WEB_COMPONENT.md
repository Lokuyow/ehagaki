# eHagaki Composer Web Component ガイド

`npm run build:web-component` は `dist-web-component/ehagaki-composer.js` を生成します。
これは ES module 形式の配布物で、PWA のビルドとは意図的に分離されています。manifest、share target、eHagaki Service Worker の登録、iframe bridge は含みません。通常の `npm run build` では、この standalone 配布物を `dist/web-component/` にも組み立てるため、PWA site の出力から live sample と component asset をまとめて配信できます。standalone の `dist-web-component/` 出力は、CDN など別の配布方法にも利用できます。

操作できる公開リファレンスは
[https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html](https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html)
です。module URL / asset base、Create / Destroy / Recreate、`whenReady()`、
initial/runtime settings、content/reply/quote/multiple quote/channel context、
安全な event log、2 個目の instance の拒否、CSS Custom Properties と
`::part()` を確認できます。ページロード時には component も任意の module も
自動実行せず、`Create / Mount` が明示的な import・接続操作になります。
外部 module は host と同じ JavaScript 権限で実行されるため、信頼できる URL
だけを指定してください。module load 後は Custom Elements Registry の制約により
module URL を変更できず、別実装を試すにはページを reload します。

```html
<script type="module" src="https://cdn.example/ehagaki-composer.js"></script>
<ehagaki-composer
  asset-base="https://cdn.example/"
  style="--ehagaki-background: #f4f4f4; --ehagaki-font-family: system-ui"
></ehagaki-composer>
<script type="module">
  const composer = document.querySelector('ehagaki-composer');
  await composer.whenReady();
  await composer.setSettings({ locale: 'ja', themeMode: 'light' });
  await composer.setContext({ content: 'Hello from the host.' });
</script>
```

1 つの document で接続できる `ehagaki-composer` は 1 個だけです。2 個目の
element は inert のままになり、`multiple_instances_unsupported` を付けた
`ehagaki-initialization-error` を発生させ、`whenReady()` を reject します。最初の
element を disconnect すると、その slot は解放されます。disconnect しても保存済み
データは削除されません。

## API と event

- `whenReady(): Promise<void>` は component の mount 完了後に resolve します。
- `setContext(context)` は iframe の `composer.setContext` と同じ reply、quote、
  channel、content の validation/apply ロジックを使います。
- `setSettings(settings)` は対応している settings を適用し、適用された key とともに
  resolve します。
- `assetBase` property / `asset-base` attribute は、chunk、worker、WASM、FFmpeg
  asset を配信する base を選択します。connection 前に設定してください。

すべての event は bubble し、composed です。対象は `ehagaki-ready`（detail は
`{ apiVersion: 1 }`）、`ehagaki-post-success`、`ehagaki-post-error`、
`ehagaki-composer-context-updated`、`ehagaki-initialization-error` です。
Error detail には安全な code/message だけを使用し、secret key、authentication
payload、raw error は含めません。

component の authentication model は、意図的に既存の eHagaki の model を使います。
Web Component 専用の signer callback/provider API は追加していません。component は
host の Window realm を共有するため、NIP-07 では host の `window.nostr` を直接利用
します。NIP-46 と nsec/managed-account の login には、component 内の eHagaki 既存
login UI を使います。sample が表示するのは `window.nostr` と既知の capability の
有無だけです。nsec を受け取ったり保存したりせず、iframe の `auth.*` / `rpc.*`
message も実装していません。

sample の context controls は `element.setContext(...)` を直接呼び出します。
payload には `content`、`reply`、`quotes`、`channel` を使います。channel には必須の
`reference` と、任意の `relays`、`name`、`about`、`picture` があります。settings
controls では、現在対応している `locale`、`themeMode`、quality、notification、
client-tag、media-placement、mascot、flavor-text、upload endpoint の key を使い、
未対応の key は reject します。

公開している CSS Custom Properties は `--ehagaki-background`、
`--ehagaki-text`、`--ehagaki-border`、`--ehagaki-link`、
`--ehagaki-input-background`、`--ehagaki-footer-background`、
`--ehagaki-dialog-background`、`--ehagaki-font-family` です。component は
`shell`、`header`、`composer`、`footer`、`overlay-root` の part も公開しています。

## Storage、origin、trust boundary

component は host の Window realm で動作し、host origin に直接保存します。ただし、
eHagaki の localStorage key はすべて `ehagaki.web-component.v1:` namespace に限定
されます。対象には account、nsec、NIP-46、relay、settings、legacy-cleanup の path
が含まれます。host の raw key を読み取り、上書き、削除することはありません。この
first release には migration がありません。iframe parent-storage protocol を通じて
以前に委譲されていた data は、Web Component へ切り替えても自動移行されません。

IndexedDB は host origin の app-specific な `eHagakiDB` のままです。schema や
database name の migration はありません。host は component を実行する trusted
環境であり、same-origin storage を検査できます。namespace は衝突防止のためのもの
であり、secret boundary ではありません。

## Service Worker、relay、FFmpeg、CSP

component 自身は eHagaki Service Worker を register せず、message も送りません。host
Service Worker は通常の HTTP fetch、image、upload を観測できますが、その `fetch`
event だけでは Nostr WebSocket relay traffic の interception を示せません。component
は host の Window realm を共有し、現在の `initializeNostrSession()` path は
`websocketCtor` なしで rx-nostr を生成します。そのため rx-nostr は relay を開くとき
`globalThis.WebSocket` を使います。この module の import 前に host が wrapper を
install した場合、その wrapper が適用される boundary になります。
この release は browser-level の relay-interceptor 保証をうたいません。通常の app
relay path には authenticated session が必要で、既存 application には credential-free
で deterministic な local-relay route が見つかっていません。専用の relay-interceptor
API は提供せず、Issue #89 の relay-interceptor proof も未完了です。

module、chunk、worker、FFmpeg file、WASM は、埋め込み元 origin を許可する CORS header
付きで配信するか、`asset-base` にアクセス可能な delivery base を指定してください。
cross-origin embedding では、FFmpeg は `asset-base` から bundled class-worker module
を取得し、host origin の Blob URL をその worker 用に作成した後、`asset-base` から
`ffmpeg-core.js` と `ffmpeg-core.wasm` を読み込みます。`worker-src` では delivery
origin と `blob:` の両方を許可してください。この path の proxy を host Service
Worker に依存しないでください。同一 origin の PWA 配信では、生成された worker
asset を引き続き直接利用します。iOS Safari は実際の delivery origin で確認して
ください。mobile emulation では worker や CORS の動作は検証できません。

component は open ShadowRoot を使います。Dialog、popover、tooltip、suggestion、
PhotoSwipe は component の overlay root を対象にします。一方、browser-history と
URL/share-target input handling は無効化されています。

host sample では CSS Custom Properties `--ehagaki-background`,
`--ehagaki-text`, `--ehagaki-border`, `--ehagaki-link`,
`--ehagaki-input-background`, `--ehagaki-footer-background`,
`--ehagaki-dialog-background`、`--ehagaki-font-family` を確認できます。また、host
stylesheet から宣言済みの `shell`、`header`、`composer`、`footer`、`overlay-root`
part を style できます。これらは Web Component API であり、iframe sample からは
この方法で iframe 内部の stylesheet にアクセスできません。
