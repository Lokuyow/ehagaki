# eHagaki Composer Web Component ガイド

`npm run build:web-component` は `dist-web-component/ehagaki-composer.js` を生成します。
これは ES module 形式の配布物で、PWA のビルドとは意図的に分離されています。manifest、共有ターゲット、eHagaki Service Worker の登録、iframe 連携は含みません。通常の `npm run build` では、この単独配布物を `dist/web-component/` にも組み立てるため、PWA サイトの出力から実動サンプルとコンポーネント用アセットをまとめて配信できます。単独配布物の `dist-web-component/` 出力は、CDN など別の配布方法にも利用できます。

操作できる公開リファレンスは
[https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html](https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html)
です。モジュール URL / アセットの基準、作成 / 破棄 / 再作成、`whenReady()`、
初期設定 / 実行時設定、本文 / 返信 / 引用 / 複数引用 / チャンネルのコンテキスト、
安全なイベントログ、2 個目のインスタンスの拒否、CSS Custom Properties と
`::part()` を確認できます。ページロード時にはコンポーネントも任意のモジュールも
自動実行せず、`Create / Mount` が明示的な import・接続操作になります。
外部モジュールはホストと同じ JavaScript 権限で実行されるため、信頼できる URL
だけを指定してください。モジュールの読み込み後は Custom Elements Registry の制約により
モジュール URL を変更できず、別実装を試すにはページを再読み込みします。

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
要素は非活性のままになり、`multiple_instances_unsupported` を付けた
`ehagaki-initialization-error` を発生させ、`whenReady()` を拒否します。最初の
要素を切断すると、その枠は解放されます。切断しても保存済み
データは削除されません。

## APIとイベント

- `whenReady(): Promise<void>` はコンポーネントの mount 完了後に解決します。
- `setContext(context)` は iframe の `composer.setContext` と同じ reply、quote、
  channel、content の検証・適用ロジックを使います。
- `setSettings(settings)` は対応している設定を適用し、適用された key とともに
  解決します。
- `assetBase` プロパティ / `asset-base` 属性は、チャンク、ワーカー、WASM、FFmpeg
  アセットを配信する基準を選択します。接続前に設定してください。

すべてのイベントは bubble し、composed です。対象は `ehagaki-ready`（detail は
`{ apiVersion: 1 }`）、`ehagaki-post-success`、`ehagaki-post-error`、
`ehagaki-composer-context-updated`、`ehagaki-initialization-error` です。
エラーの detail には安全な code/message だけを使用し、秘密鍵、認証 payload、
生のエラーは含めません。

コンポーネントの認証モデルは、意図的に既存の eHagaki のモデルを使います。
Web Component 専用の signer callback/provider API は追加していません。コンポーネントは
ホストの Window realm を共有するため、NIP-07 ではホストの `window.nostr` を直接利用
します。NIP-46 と nsec/managed-account の login には、コンポーネント内の eHagaki 既存
ログイン UI を使います。サンプルが表示するのは `window.nostr` と既知の対応機能の
有無だけです。nsec を受け取ったり保存したりせず、iframe の `auth.*` / `rpc.*`
メッセージも実装していません。

サンプルのコンテキスト操作は `element.setContext(...)` を直接呼び出します。
payload には `content`、`reply`、`quotes`、`channel` を使います。channel には必須の
`reference` と、任意の `relays`、`name`、`about`、`picture` があります。設定
操作では、現在対応している `locale`、`themeMode`、品質、通知、クライアントタグ、
メディア配置、マスコット、フレーバーテキスト、アップロード先の key を使い、
未対応の key は拒否します。

公開している CSS Custom Properties は `--ehagaki-background`、
`--ehagaki-text`、`--ehagaki-border`、`--ehagaki-link`、
`--ehagaki-input-background`、`--ehagaki-footer-background`、
`--ehagaki-dialog-background`、`--ehagaki-font-family` です。コンポーネントは
`shell`、`header`、`composer`、`footer`、`overlay-root` の part も公開しています。

## ストレージ、オリジン、信頼境界

コンポーネントはホストの Window realm で動作し、ホストオリジンに直接保存します。ただし、
eHagaki の localStorage key はすべて `ehagaki.web-component.v1:` 名前空間に限定
されます。対象にはアカウント、nsec、NIP-46、リレー、設定、legacy-cleanup の経路
が含まれます。ホストの生の key を読み取り、上書き、削除することはありません。この
初回リリースには移行がありません。iframe parent-storage プロトコルを通じて
以前に委譲されていたデータは、Web Component へ切り替えても自動移行されません。

IndexedDB はホストオリジンの eHagaki 専用 `eHagakiDB` のままです。schema や
データベース名の移行はありません。ホストはコンポーネントを実行する信頼された
環境であり、同一オリジンのストレージを検査できます。名前空間は衝突防止のためのもの
であり、秘密の境界ではありません。

## Service Worker、リレー、FFmpeg、CSP

コンポーネント自身は eHagaki Service Worker を登録せず、メッセージも送りません。ホストの
Service Worker は通常の HTTP fetch、画像、アップロードを観測できますが、その `fetch`
イベントだけでは Nostr WebSocket のリレー通信を傍受できることの証明にはなりません。コンポーネント
はホストの Window realm を共有し、現在の `initializeNostrSession()` 経路は
`websocketCtor` なしで rx-nostr を生成します。そのため rx-nostr はリレーを開くとき
`globalThis.WebSocket` を使います。このモジュールの import 前にホストがラッパーを
導入した場合、そのラッパーが適用される境界になります。
このリリースはブラウザレベルの relay-interceptor 保証をうたいません。通常のアプリの
リレー経路には認証済みセッションが必要で、既存アプリケーションには認証情報不要で
決定的なローカルリレー経路が見つかっていません。専用の relay-interceptor
API は提供せず、Issue #89 の relay-interceptor の証明も未完了です。

モジュール、チャンク、ワーカー、FFmpeg ファイル、WASM は、埋め込み元オリジンを許可する CORS ヘッダー
付きで配信するか、`asset-base` からアクセスできる配信基準を指定してください。
クロスオリジン埋め込みでは、FFmpeg は `asset-base` から同梱の class-worker モジュール
を取得し、ホストオリジンの Blob URL をそのワーカー用に作成した後、`asset-base` から
`ffmpeg-core.js` と `ffmpeg-core.wasm` を読み込みます。`worker-src` では delivery
配信元オリジンと `blob:` の両方を許可してください。この経路のプロキシをホストの Service
Worker に依存しないでください。同一オリジンの PWA 配信では、生成されたワーカー用
アセットを引き続き直接利用します。iOS Safari は実際の配信元オリジンで確認して
ください。モバイルエミュレーションではワーカーや CORS の動作は検証できません。

コンポーネントは open ShadowRoot を使います。Dialog、popover、tooltip、suggestion、
PhotoSwipe はコンポーネントの overlay root を対象にします。一方、ブラウザ履歴と
URL/share-target の入力処理は無効化されています。

ホストのサンプルでは CSS Custom Properties `--ehagaki-background`,
`--ehagaki-text`, `--ehagaki-border`, `--ehagaki-link`,
`--ehagaki-input-background`, `--ehagaki-footer-background`,
`--ehagaki-dialog-background`、`--ehagaki-font-family` を確認できます。また、ホストの
スタイルシートから宣言済みの `shell`、`header`、`composer`、`footer`、`overlay-root`
part をスタイル設定できます。これらは Web Component API であり、iframe のサンプルからは
この方法で iframe 内部のスタイルシートにアクセスできません。
