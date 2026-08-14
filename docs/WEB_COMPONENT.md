# eHagaki Composer Web Component ガイド

Web Component 版では、`<ehagaki-composer>` を一般の Web ページへ直接配置できます。
iframe 版のように別 document と `postMessage` で通信するのではなく、ホストページと同じ
Window realm で動作し、ホストの JavaScript からは通常の要素・メソッド・CustomEvent として
扱います。iframe の parent-client auth/RPC や `postMessage` は使用しません。

そのため、ホスト JavaScript から秘密情報を隔離したい場合は [iframe 版のガイド](./IFRAME_EMBEDDING.md)
を使用してください。Web Component は、ホストとコンポーネントが同じ実行環境を信頼でき、
DOM へ直接組み込みたい場合に適しています。

実際に操作できる公開リファレンスは、[Web Component 親ページサンプル](https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html)
です。ページを開いただけではコンポーネントを自動的に接続しません。ページを開いた後、
`Create / Mount` を押すと Web Component が生成されます。サンプルでは、モジュールの読み込み、
作成・破棄・再作成、設定、投稿コンテキスト、各種イベント、2 個目のインスタンスの拒否、
CSS Custom Properties、`::part()` を確認できます。

## 最小構成で埋め込む

最初に Web Component のモジュールを読み込み、`asset-base` を指定した
`<ehagaki-composer>` をページへ追加します。その後、要素を取得して `whenReady()` を待ちます。
以下は GitHub Pages で公開されている実際の配布物を使う最小例です。

```html
<script type="module" src="https://lokuyow.github.io/ehagaki/web-component/ehagaki-composer.js"></script>

<div class="composer-host">
  <ehagaki-composer
    asset-base="https://lokuyow.github.io/ehagaki/web-component/"
  ></ehagaki-composer>
</div>

<style>
  .composer-host { height: 580px; }
  ehagaki-composer { display: block; height: 100%; }
</style>

<script type="module">
  const composer = document.querySelector('ehagaki-composer');
  await composer.whenReady();
  console.log('eHagaki Composer is ready');
</script>
```

## 下部 UI と高さ契約

Web Component の下部 UI は常に component-bound layout です。`FooterComponent`、
`KeyboardButtonBar`、`ReasonInput` は component の境界内に配置され、host page を scroll すると
component と一緒に移動します。ブラウザ viewport 下端へ固定する Web Component 公開機能はありません。

host は `.composer-host { height: 580px; }` のように解決済みの definite CSS height を指定し、
`ehagaki-composer` がその高さを継承するようにしてください。height 未指定または `auto` は
サポート対象外で、viewport 高への暗黙 fallback は行いません。

host page が外側 scroll を所有し、composer 本文は既存の `.composer-scroll-region` が internal
scroll を所有します。keyboard 表示時は component-local inset を使って下部 UI と composer
reservation を調整します。dialog、tooltip、popover、PhotoSwipe などの overlay root と
positioning 責務は変更されません。

通常版/PWA と iframe は、Web Component とは異なり、従来の viewport 基準レイアウトを維持します。
以前の Web Component 実装では下部 UI が browser viewport 基準でしたが、通常の埋め込みで component
外へ出ないよう、現在は component-bound layout に統一しています。

`asset-base` は、コンポーネントが実行時に参照する配信元のディレクトリです。エントリ
モジュールを読み込む URL と、配布物内の `assets/`、`icons/`、`ffmpeg-core/` などを置いた
ディレクトリを指定します。要素を接続する前に設定してください。

要素を JavaScript で生成する場合は、`assetBase` property でも指定できます。

```js
await import('https://cdn.example/ehagaki/web-component/ehagaki-composer.js');

const composer = document.createElement('ehagaki-composer');
composer.assetBase = 'https://cdn.example/ehagaki/web-component/';
document.querySelector('#composer-mount').append(composer);

await composer.whenReady();
```

`asset-base` と `assetBase` は同じ設定を表します。接続後に値を変更しても、現在接続中の
アプリの配信先やモジュール読み込み先は切り替わりません。別の配信先を使う場合は、
値を変更してから要素をいったん削除し、再作成してください。すでに読み込んだモジュールを
別実装へ切り替える場合は、Custom Elements Registry の制約があるためページを再読み込みします。

## 配布物と読み込み方法

Web Component の配布物には、PWA の manifest、共有ターゲット、eHagaki Service Worker の登録、
iframe 連携は含まれません。

- `npm run build:web-component` は、単独配布物を
  `dist-web-component/ehagaki-composer.js` とその関連アセットとして生成します。
- `npm run build` は通常の PWA build に加えて Web Component build を実行し、
  `dist-web-component/` の内容を `dist/web-component/` に組み立てます。
- eHagaki サイトと一緒に配信する場合は、`dist/web-component/` のディレクトリ構成を保ったまま
  サイトの出力として配信し、上記の GitHub Pages 例のように `/web-component/` を
  `asset-base` に指定します。
- CDN や別ホストへ置く場合は、`dist-web-component/` 全体をコピーしてください。エントリだけでなく、
  `assets/`、`icons/`、`ffmpeg-core/`、`ehagaki_icon.svg` などの関連ファイルも必要です。
  モジュール URL と `asset-base` は、その配布構成に対応する URL にします。

単独配布物は、PWA サイトの出力と独立して別の配信方法に利用できます。通常の PWA build
との分離を保つため、Web Component 用ディレクトリへ PWA の Service Worker や manifest を
追加しないでください。

## ローカル開発

通常のアプリ開発には `npm run dev` を使います。Web Component の公開サンプルをローカルで
確認する場合は `npm run dev:web-component` を使い、
`http://localhost:5173/ehagaki/web-component-parent-client-example.html` を開いてください。
このコマンドは Web Component の初回buildとwatchを起動します。Web Component のソースを変更した後は、
watchによる再buildの完了を待ってからページを再読み込みします。`vite.web-component.config.ts` などの
build設定を変更した場合は、コマンドを再起動してください。

Android ChromeやiPhone Safariなど、同じLAN上の実機から確認する場合は、明示的なLANモードを使います。

```text
npm run dev:web-component:lan
```

コンソールに表示された `http://<PCのLAN IP>:5173/ehagaki/web-component-parent-client-example.html`
を実機で開いてください。PCと実機を同じWi-Fi/LANへ接続し、Windowsでは必要に応じてWindows Firewallで
Node/ViteのPrivate networkアクセスを許可します。LANモードではViteのsample serverだけを公開し、
Web Component assetの内部server（5174）は `127.0.0.1` のままです。実機から5174を直接開く必要はありません。

## `asset-base` / `assetBase`

`asset-base` は、コンポーネントが配布物内のアセットを解決するための配信元です。実装では、
次のようなファイルを配信元ディレクトリから解決します。

- Web Component のエントリから参照される動的チャンクと関連アセット
- アプリ内のアイコンや `ehagaki_icon.svg`
- FFmpeg の class-worker とそのワーカー用アセット
- `ffmpeg-core/ffmpeg-core.js`
- `ffmpeg-core/ffmpeg-core.wasm`

動的チャンクは build が作る相対的なディレクトリ構成を保って配信してください。FFmpeg の
class-worker、core、WASM は、特にクロスオリジン配信時に `asset-base` から到達できる必要があります。

同一オリジンでサイトと一緒に配信する場合の例です。

```html
<script type="module" src="/ehagaki/web-component/ehagaki-composer.js"></script>
<ehagaki-composer asset-base="/ehagaki/web-component/"></ehagaki-composer>
```

GitHub Pages のようにサイトがサブパス配下にある場合は、root-relative URL を固定せず、
実際の配信ベースを使ってください。公開サンプルは `./web-component/` を基準に URL を解決しています。

## 準備完了を待つ `whenReady()`

`whenReady(): Promise<void>` は、アプリのマウントと公開 part の準備が完了した後に解決します。
`ehagaki-ready` も同じ準備完了時に発火します。

```js
const composer = document.querySelector('ehagaki-composer');

try {
  await composer.whenReady();
  await composer.setSettings({
    locale: 'ja',
    themeMode: 'light',
  });
  await composer.setContext({
    content: 'ホストから設定した本文',
  });
} catch (error) {
  console.error('eHagaki Composer initialization or setup failed', error);
}
```

初期化に失敗した場合、`whenReady()` は拒否されます。2 個目の接続されたインスタンスも
初期化されず、`multiple_instances_unsupported` の `ehagaki-initialization-error` を発火して
`whenReady()` を拒否します。準備完了前に DOM から切断された要素の `whenReady()` は
`disconnected` のエラーで拒否されます。

`setSettings()` と `setContext()` は接続前にも呼び出せます。実装は呼び出しをキューに入れ、
準備完了後に順番に適用します。一般的には、要素を生成して初期値を設定し、DOM へ追加してから
`whenReady()` を待つ次の書き方が分かりやすいです。

```js
const composer = document.createElement('ehagaki-composer');
composer.setAttribute('asset-base', 'https://cdn.example/ehagaki/web-component/');

const settingsPromise = composer.setSettings({ locale: 'ja' });
const contextPromise = composer.setContext({ content: '初期本文' });
document.querySelector('#composer-mount').append(composer);

await composer.whenReady();
await settingsPromise;
await contextPromise;
```

## 設定を変更する `setSettings()`

`setSettings(settings)` は、対応している設定だけを受け付け、適用された key の配列を
`Promise<ReadonlyArray<...>>` として返します。未知の key、型が違う値、指定可能値以外の値を
含むペイロードは拒否され、ペイロード全体を検証してから適用するため部分適用されません。

| key | 型・指定可能値 | 用途 |
| --- | --- | --- |
| `locale` | `'ja'` / `'en'` | 表示言語 |
| `themeMode` | `'system'` / `'light'` / `'dark'` | テーマ |
| `imageQualityLevel` | `'none'` / `'low'` / `'medium'` / `'high'` | 画像圧縮の品質 |
| `videoQualityLevel` | `'none'` / `'low'` / `'medium'` / `'high'` | 動画圧縮の品質 |
| `imageCompressionLevel` | `'none'` / `'low'` / `'medium'` / `'high'` | 旧画像圧縮設定。新規利用では `imageQualityLevel` を使用 |
| `videoCompressionLevel` | `'none'` / `'low'` / `'medium'` / `'high'` | 旧動画圧縮設定。新規利用では `videoQualityLevel` を使用 |
| `clientTagEnabled` | `boolean` | 投稿への client tag 付与 |
| `quoteNotificationEnabled` | `boolean` | 引用通知 |
| `replyNotificationEnabled` | `boolean` | リプライ通知 |
| `mediaFreePlacement` | `boolean` | メディアの自由配置 |
| `showMascot` | `boolean` | マスコット表示 |
| `showFlavorText` | `boolean` | フレーバーテキスト表示 |
| `uploadEndpoint` | `string` | アップロード先の設定 |

`imageCompressionLevel` と `videoCompressionLevel` は互換性のために残る旧 key です。同じ
payload に新しい `imageQualityLevel` / `videoQualityLevel` と旧 key の両方を指定した場合は、
新しい key が優先されます。`uploadEndpoint` は文字列として受け付けられますが、Web Component
側で URL の形式を別途検証する API ではありません。

```js
const applied = await composer.setSettings({
  locale: 'ja',
  themeMode: 'dark',
  imageQualityLevel: 'high',
  videoQualityLevel: 'medium',
  clientTagEnabled: true,
  quoteNotificationEnabled: false,
  replyNotificationEnabled: true,
  mediaFreePlacement: false,
  showMascot: true,
  showFlavorText: true,
  // 必要な場合は、実際のアップロード先に置き換えてコメントを外します。
  // uploadEndpoint: 'https://your-upload-endpoint.example/api',
});

console.log('applied settings:', [...applied]);
```

## 投稿コンテキストを設定する `setContext()`

`setContext(context)` は投稿本文、リプライ、引用、パブリックチャットのコンテキストをまとめて
設定します。各フィールドは省略可能です。省略したフィールドは現在の値を維持し、`null` を指定した
フィールドは解除します。

`reply`、`quotes` の各値、`channel.reference` には NIP-19 の `note1...` または `nevent1...`
を使用します。実際のイベント参照に置き換えてください。

### 通常投稿と本文の初期値

```js
await composer.setContext({
  content: 'この本文を投稿画面へ初期入力します',
});
```

本文を消去する場合は `content: null` を指定します。空文字列 `''` は文字列として受け付けられる
ため、明示的に本文を解除する用途では `null` を使ってください。

### リプライ

```js
await composer.setContext({
  reply: 'nevent1ここに実際のリプライ対象を指定',
});
```

リプライを解除する場合は `reply: null` を指定します。

### 単一引用と複数引用

```js
await composer.setContext({
  quotes: ['note1ここに実際の引用対象を指定'],
});

await composer.setContext({
  quotes: [
    'note1ここに1つ目の実際の引用対象を指定',
    'nevent1ここに2つ目の実際の引用対象を指定',
  ],
});
```

`quotes: null` は引用をすべて解除します。引用配列内で同じイベントを指す値が重複した場合、
復号後のイベント ID 単位で重複が除去されます。

### パブリックチャット

`channel` は `reference` が必須です。`relays`、`name`、`about`、`picture` は任意です。
`relays` はリレー URL の配列、メタデータのフィールドは文字列または `null` を指定します。

```js
await composer.setContext({
  channel: {
    reference: 'nevent1ここに実際のchannel eventを指定',
    relays: [
      'wss://relay.example.com',
      'wss://relay-backup.example.com',
    ],
    name: 'お知らせ',
    about: '公開チャットの説明',
    picture: 'https://example.com/channel.png',
  },
});
```

`channel: null` はチャンネルのコンテキストを解除します。`picture` は表示用の任意値で、形式を
正規化できない値はチャンネル全体を拒否せず無視されます。

### 本文・リプライ・引用・channel の組み合わせ

同じ payload に複数のフィールドを指定できます。

```js
await composer.setContext({
  content: '返信と引用を含む初期本文',
  reply: 'note1ここに実際のリプライ対象を指定',
  quotes: [
    'note1ここに1つ目の実際の引用対象を指定',
    'nevent1ここに2つ目の実際の引用対象を指定',
  ],
  channel: {
    reference: 'nevent1ここに実際のchannel eventを指定',
    relays: ['wss://relay.example.com'],
  },
});
```

### 検証と拒否

コンテキストは状態を変更する前に全体を検証します。次のようなペイロードは拒否されます。

- payload がオブジェクトではない場合
- `reply`、`quotes`、`channel.reference` が有効な `note1...` / `nevent1...` ではない場合
- `quotes` が配列ではない場合、または配列内に不正な reference がある場合
- `channel` がオブジェクトではない場合
- `channel.relays` が配列ではない場合、またはリレー URL が不正な場合
- `channel.name` / `channel.about` が指定されているのに、空でない文字列または `null` ではない場合

不正な参照を含むペイロードは、本文だけ先に適用されることはありません。`content`、
reply、quotes、channel をまとめて指定した場合も、検証が失敗すれば状態は変更されません。
ただし、妥当なペイロードを適用した後のリレー取得や引用情報の補完など、非同期の補完処理は
別途進行します。

フィールドの部分更新は意図された契約です。例えば、現在の reply を維持したまま本文だけを変えるには
`{ content: '新しい本文' }` を指定し、reply と引用を同時に解除するには
`{ reply: null, quotes: null }` を指定します。

## 初期化前の設定とコンテキスト

次の 3 つのタイミングで呼び出せます。

- **接続前**: `document.createElement()` で生成した要素に `setSettings()` / `setContext()` を
  呼び出すとキューに入り、接続後の準備完了後に適用されます。
- **準備完了前**: 接続後でも `whenReady()` 完了前の呼び出しはキューに入り、順番に処理されます。
- **準備完了後**: 通常の実行時更新として直ちに処理されます。

接続前に `assetBase` を設定し、初期設定・コンテキストをキューへ追加してから要素を接続する方法は、
公開サンプルの `Create / Mount` が使用しています。初期化自体に失敗した場合は、キューに入った
操作も成功せず拒否されます。

## 投稿成功・失敗イベント

すべての Web Component イベントは `bubbles: true`、`composed: true` の CustomEvent です。
ShadowRoot の外側にあるホスト側のリスナーで受け取れます。

```js
composer.addEventListener('ehagaki-post-success', (event) => {
  const detail = event.detail;
  console.log('投稿成功', {
    eventId: detail.eventId,
    replyToEventId: detail.replyToEventId,
    quotedEventIds: detail.quotedEventIds,
  });
});

composer.addEventListener('ehagaki-post-error', (event) => {
  console.error('投稿失敗', event.detail.code);
});
```

`ehagaki-post-success` の detail は次の形です。各フィールドは該当する投稿内容がある場合
だけ存在します。

```js
{
  eventId?: string,
  replyToEventId?: string,
  quotedEventIds?: string[]
}
```

`ehagaki-post-error` の detail は `{ code: string }` です。秘密鍵、認証 payload、生の Error は
イベント detail に含めません。投稿エラーを処理する場合はイベントリスナーを登録してください。

## その他の CustomEvent

### `ehagaki-ready`

mount と公開 part の準備が完了したときに発火します。detail は `{ apiVersion: 1 }` です。

```js
composer.addEventListener('ehagaki-ready', (event) => {
  console.log('ready', event.detail.apiVersion);
});
```

### `ehagaki-composer-context-updated`

コンポーネント内の操作などで、ホストが参照できる composer コンテキストが変化したときに発火します。
detail は現在のコンテキストを表します。

```js
composer.addEventListener('ehagaki-composer-context-updated', (event) => {
  const { reply, quotes, channel } = event.detail;
  console.log('context updated', { reply, quotes, channel });
});
```

形は次のとおりです。

```js
{
  reply: string | null,
  quotes: string[],
  channel: {
    reference: string,
    relays?: string[],
    name?: string | null,
    about?: string | null,
    picture?: string | null
  } | null
}
```

### `ehagaki-initialization-error`

初期化に失敗した場合、または document 内の 2 個目のインスタンスを接続した場合に発火します。
detail は `{ code: string, message: string }` です。通常確認する code は次のとおりです。

- `initialization_failed`: Web Component の初期化に失敗した場合
- `multiple_instances_unsupported`: 同じ document に 2 個目を接続した場合

```js
composer.addEventListener('ehagaki-initialization-error', (event) => {
  const { code, message } = event.detail;
  console.error('初期化失敗', code, message);
});
```

`setSettings()` / `setContext()` の直接呼び出しは、入力エラーをそれぞれの Promise の拒否
として通知します。これらの処理を監視するときは、必ず `await` または `.catch()` を使ってください。
イベント detail には安全な code/message だけを使用し、秘密鍵、認証 payload、生のエラー
は含めません。

## 作成・破棄・再生成

Web Component は通常の DOM API で作成・接続・破棄できます。

```js
async function createComposer() {
  const element = document.createElement('ehagaki-composer');
  element.assetBase = 'https://cdn.example/ehagaki/web-component/';
  document.querySelector('#composer-mount').append(element);
  await element.whenReady();
  return element;
}

const composer = await createComposer();

composer.remove(); // Destroy / Unmount

const replacement = await createComposer(); // Recreate
```

要素を切断すると実行時のマウントと observer が cleanup され、1 インスタンス用の枠が
解放されます。保存済みの localStorage や IndexedDB のデータは削除されません。最初の要素を
削除した後なら、新しい `ehagaki-composer` を接続できます。

## 1 document 1 instance 制約

1 つの document で接続できる `ehagaki-composer` は 1 個だけです。2 個目を接続すると、2 個目は
非活性のままになり、`ehagaki-initialization-error` に
`multiple_instances_unsupported` が設定され、`whenReady()` が拒否されます。

```js
const first = document.createElement('ehagaki-composer');
document.body.append(first);
await first.whenReady();

const second = document.createElement('ehagaki-composer');
second.addEventListener('ehagaki-initialization-error', (event) => {
  console.log(event.detail.code); // multiple_instances_unsupported
});
document.body.append(second);

await second.whenReady().catch((error) => {
  console.log(error.name); // multiple_instances_unsupported
});

first.remove();
const replacement = document.createElement('ehagaki-composer');
document.body.append(replacement);
await replacement.whenReady();
```

## CSS Custom Properties

Shadow DOM の内部へ通常のホスト側 selector で直接 style を適用する代わりに、公開されている
CSS Custom Properties を使用できます。

| CSS Custom Property | 用途 |
| --- | --- |
| `--ehagaki-background` | メイン背景 |
| `--ehagaki-text` | 文字色 |
| `--ehagaki-border` | 境界線 |
| `--ehagaki-link` | リンク色 |
| `--ehagaki-input-background` | 入力欄の背景 |
| `--ehagaki-footer-background` | フッターの背景 |
| `--ehagaki-dialog-background` | ダイアログの背景 |
| `--ehagaki-font-family` | フォント |

```css
ehagaki-composer {
  --ehagaki-background: #f4f4f4;
  --ehagaki-text: #183028;
  --ehagaki-border: #b8c7be;
  --ehagaki-link: #28764f;
  --ehagaki-input-background: #ffffff;
  --ehagaki-footer-background: #e2ebe5;
  --ehagaki-dialog-background: #ffffff;
  --ehagaki-font-family: system-ui, sans-serif;
}
```

## `::part()` によるスタイル調整

公開されている part は `shell`、`header`、`composer`、`footer`、`overlay-root` です。
ホスト側のスタイルシートから、次のように指定できます。

```css
ehagaki-composer::part(header) {
  border-bottom: 1px solid #b8c7be;
}

ehagaki-composer::part(composer) {
  min-height: 240px;
}
```

ShadowRoot は open ですが、公開 API として案内していない内部 DOM を
`shadowRoot.querySelector()` などで操作することは推奨しません。レイアウトや表示の調整には、
CSS Custom Properties と公開された `::part()` を使用してください。

## ログイン・認証

Web Component 専用の signer callback/provider API はありません。

- NIP-07 では、コンポーネントと同じ Window realm にあるホストの `window.nostr` を直接利用します。
- NIP-46 は、コンポーネント内の既存 eHagaki UI からログインします。
- nsec / managed account も、コンポーネント内の既存 eHagaki UI から利用します。
- iframe の `auth.*` / `rpc.*` メッセージは Web Component では使いません。
- ホスト側から nsec をコンポーネントへ渡す API はありません。

NIP-07 の有無をホストから確認するだけなら、`window.nostr` と必要な method の存在を
確認します。これは signer を Web Component へ渡すコードではありません。実際の署名処理は
eHagaki の既存ログイン経路が `window.nostr` を利用します。

```js
const nip07Available =
  !!window.nostr &&
  typeof window.nostr.getPublicKey === 'function';

console.log('NIP-07 available:', nip07Available);
```

ホスト JavaScript から秘密情報を隔離したい用途では、Web Component ではなく iframe 版を
選択してください。Web Component の localStorage、IndexedDB、同じ Window realm の状態は、
信頼されたホストから観測可能です。

## iframe 版との使い分け

| 項目 | iframe | Web Component |
| --- | --- | --- |
| DOM 統合 | 別 document。`postMessage` で連携 | 同じ document の要素として配置 |
| スタイル | iframe 内 document の CSS 境界 | ShadowRoot。CSS Custom Properties / `::part()` を公開 |
| Window realm | ホストとは分離 | ホストと共有 |
| NIP-07 | iframe の認証経路または parent-client 連携 | ホストの `window.nostr` を直接利用 |
| parent-client auth/RPC | 利用可能 | 使用しない |
| `postMessage` | 使用する | 使用しない |
| 保存 | 親側の storage / IndexedDB 委譲を構成可能 | ホストオリジンに保存。専用 localStorage namespace を使用 |
| 秘密情報の隔離 | origin 境界を設計可能 | 隔離されない。信頼できるホスト向け |
| ライフサイクル | iframe の生成・再読み込みなど | DOM の追加・削除・再作成 |

iframe の通信、parent storage、parent-client auth/RPC が必要な場合は、[iframe 埋め込みガイド](./IFRAME_EMBEDDING.md)
を参照してください。

## ストレージ

Web Component はホストの Window realm で動作し、ホストオリジンへ直接保存します。

- localStorage の key は `ehagaki.web-component.v1:` namespace に限定されます。
- アカウント、nsec、NIP-46、リレー、設定、legacy-cleanup などの eHagaki 管理値も、この namespace の対象です。
- ホストの namespace なしの生の key を読み取り、上書き、削除することはありません。
- この namespace は衝突防止のためのものであり、秘密情報の隔離境界ではありません。
- iframe の parent-storage プロトコルを通じて以前に委譲されていたデータは、Web Component へ
  切り替えても自動移行されません。
- IndexedDB はホストオリジンのアプリ固有 `eHagakiDB` を使用します。database name や schema の
  migration はありません。

同じホストオリジン上のコードであれば、このストレージを検査できることを前提にしてください。
Web Component を信頼できないページへ配置する用途や、ホスト JavaScript からストレージを分離する
用途には iframe 版を使用します。

## Service Worker / WebSocket

Web Component 自身は eHagaki Service Worker を登録せず、Service Worker へメッセージも送りません。
ホストページに別の Service Worker が登録されている場合、その Service Worker は通常の HTTP fetch、
画像、アップロードなどを観測できます。

ただし、Service Worker の `fetch` イベントだけでは Nostr WebSocket のリレー通信の傍受を
証明できません。Web Component はホストの Window realm を共有し、現在の
`initializeNostrSession()` 経路は `websocketCtor` なしで rx-nostr を生成します。そのため、
rx-nostr は relay を開くとき `globalThis.WebSocket` を使います。モジュールの import 前にホストが
`globalThis.WebSocket` の wrapper を導入した場合、その wrapper が適用される境界になります。

このリリースはブラウザレベルの relay-interceptor 保証をうたいません。通常のアプリのリレー経路
には認証済みセッションが必要で、既存アプリケーションには認証情報不要で決定的な
ローカルリレー経路が見つかっていません。専用の relay-interceptor API は提供せず、Issue #89 の
relay-interceptor proof も未完了です。

## CORS / CSP / FFmpeg / Worker

クロスオリジン埋め込みでは、モジュール、チャンク、ワーカー、FFmpeg ファイル、WASM を、埋め込み元
オリジンを許可する CORS ヘッダー付きで配信してください。`asset-base` は配信元のディレクトリを
指し、そこから以下のファイルへアクセスできる必要があります。

- Web Component のモジュール、チャンク、ワーカー用アセット
- `ffmpeg-core.js`
- `ffmpeg-core.wasm`

FFmpeg は `asset-base` から同梱の class-worker モジュールを取得し、ホストオリジンの Blob URL を
そのワーカー用に作成した後、`asset-base` から `ffmpeg-core.js` と `ffmpeg-core.wasm` を読み込みます。
CSP の `worker-src` では配信元オリジンと `blob:` の両方を許可してください。この経路のプロキシを
ホストの Service Worker に依存しないでください。

同一オリジンの PWA 配信では、生成されたワーカー用アセットを引き続き直接利用します。iOS Safari は
実際の配信元オリジンで確認してください。モバイルエミュレーションだけではワーカーや CORS の動作を
検証できません。

## ShadowRoot と外部入力

コンポーネントは open ShadowRoot を使います。Dialog、popover、tooltip、suggestion、PhotoSwipe
はコンポーネントの overlay root を対象にします。一方、browser-history と URL/share-target の
入力処理は無効化されています。

## 実動サンプル

公開サンプルは [https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html](https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html)
です。ページを開いた後、`Create / Mount` を押すと Web Component が生成されます。ページロード時に
モジュールやコンポーネントを自動的に接続することはありません。

サンプルでは次の操作を確認できます。

- `Create / Mount`、`Destroy / Unmount`、`Recreate`
- `setSettings()` による初期設定と実行時設定
- `setContext()` による本文、reply、quote、multiple quote、channel
- `ehagaki-ready`、`ehagaki-post-success`、`ehagaki-post-error`、
  `ehagaki-composer-context-updated`、`ehagaki-initialization-error`
- 2 個目のインスタンスの `multiple_instances_unsupported` 拒否
- CSS Custom Properties と `::part()`

サンプルのイベントログは、秘密情報、署名要求 payload、生の Error を表示せず、安全な要約
だけを記録します。外部モジュールはホストページと同じ JavaScript 権限で実行されるため、
module URL と `asset-base` には信頼できる URL だけを指定してください。
