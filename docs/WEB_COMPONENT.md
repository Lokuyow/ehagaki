# eHagaki Composer Web Component ガイド

Web Component 版では、`<ehagaki-composer>` を一般の Web ページへ直接配置できます。
iframe 版のように別 document と `postMessage` で通信するのではなく、ホストページと同じ
Window realm で動作し、ホストの JavaScript からは通常の要素・メソッド・CustomEvent として
扱います。iframe の parent-client auth/RPC や `postMessage` は使用しません。

そのため、ホスト JavaScript から秘密情報を隔離したい場合は [iframe 版のガイド](./IFRAME_EMBEDDING.md)
を使用してください。Web Component は、ホストとコンポーネントが同じ実行環境を信頼でき、
DOM へ直接組み込みたい場合に適しています。

実際に操作できる公開リファレンスは、[Web Component 親ページサンプル](https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html)
です。通常モードではページを開くと、既定の同梱モジュールとコンポーネントが自動的に接続されます。
任意のモジュールを試す場合は URL に `?manual=1` を付けて manual mode に入り、module URL を編集してから
`Create / Mount` を押してください。manual mode では明示的な操作までモジュールを読み込みません。サンプルでは、モジュールの読み込み、
作成・破棄・再作成、設定、投稿コンテキスト、各種イベント、2 個目のインスタンスの拒否、
CSS Custom Properties を確認できます。

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
モジュールを読み込む URL と、配布物内の `assets/`、`icons/` などを置いた
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
  `assets/`、`icons/`、`ehagaki_icon.svg` などの関連ファイルも必要です。
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
このLAN URLはHTTP originです。LAN内実機での一般的なlayout、Destroy/Create、host scroll、fallback keyboard behavior
などの確認には利用できますが、secure context限定APIは本番HTTPSと同じ経路にならない場合があります。
特にAndroid ChromeのVirtualKeyboard API経路（`navigator.virtualKeyboard`、`overlaysContent`、`boundingRect`、
`geometrychange`）の最終確認は、PR previewなど利用可能なHTTPS deployment、または端末から信頼されるHTTPS originで行ってください。
iPhone Safariを含む一般的な実機確認には、LAN mode自体を引き続き利用できます。

## `asset-base` / `assetBase`

`asset-base` は、コンポーネントが配布物内のアセットを解決するための配信元です。実装では、
次のようなファイルを配信元ディレクトリから解決します。

- Web Component のエントリから参照される動的チャンクと関連アセット
- アプリ内のアイコンや `ehagaki_icon.svg`
動的チャンクは build が作る相対的なディレクトリ構成を保って配信してください。動画圧縮で必要になる
MediaBunnyの動的チャンクも、特にクロスオリジン配信時に `asset-base` から到達できる必要があります。

同一オリジンでサイトと一緒に配信する場合の例です。

```html
<script type="module" src="/ehagaki/web-component/ehagaki-composer.js"></script>
<ehagaki-composer asset-base="/ehagaki/web-component/"></ehagaki-composer>
```

GitHub Pages のようにサイトがサブパス配下にある場合は、root-relative URL を固定せず、
実際の配信ベースを使ってください。公開サンプルは `./web-component/` を基準に URL を解決しています。

## `auto-login` / `autoLogin`

`auto-login` は、起動時の復元で認証状態が得られなかった場合に、ホストの `window.nostr` で
NIP-07 ログインを行う opt-in です。既定は無効で、指定しない限り現在の動作から変わりません。

```html
<ehagaki-composer asset-base="/ehagaki/web-component/" auto-login></ehagaki-composer>
```

`disabled` などと同じ HTML の boolean 属性で、存在すれば有効です（`auto-login="false"` も
有効になります）。無効にするには属性を削除するか `element.autoLogin = false` を使ってください。

- ホストが `window.nostr` を用意していて、誰として署名するかが決まっている埋め込みを想定した
  opt-in です。NIP-07 拡張は公開鍵の取得時に確認ダイアログを出すことが多いため、既定では
  行いません。
- Full self-publish distribution 専用です。Lite Host-owned では属性/propertyを指定しても無視され、
  eHagaki の認証は開始しません。`setSettings()` の設定項目ではありません。
- `asset-base` と同じく mount 時に読み取られます。接続後に変更しても現在の mount では認証を開始せず、
  次の mount から有効です。
- 起動時は先に、NIP-07 / NIP-46 など保存済み managed account を既存順序ですべて復元します。どれかを
  復元できれば NIP-07 fallback は行いません。候補を正常に評価し終えても未認証だった場合だけ、
  初回に限らずホストの NIP-07 identity を fallback として使います。1候補の storage 読み取りなどで
  認証基盤異常が起きても残りの保存済み候補を試し、どれも復元できなかった場合は NIP-07 を開始せず、
  ゲスト起動へ進みます。legacy nsec migration の異常時も、安全な strict snapshot を取得できる限り
  保存済み候補の復元を続けます。
- 保存済み NIP-07 の identity mismatch で現在の identity を取得済みなら、残りの保存済み候補を
  最後まで試し、すべて失敗した場合だけ同じ identity を再問い合わせせず fallback に使います。
- 再利用できる identity がない場合、`window.nostr` の注入を最大 3 秒待ちます。拡張未検出、ユーザー拒否、
  その他の通常の NIP-07 失敗では通知を表示せず、ゲスト状態で起動を続行します。自動試行は 1 mount
  につき 1 回です。
- 成功した identity は通常の NIP-07 アカウントとして保存され、active account になります。同じ pubkey が
  別認証方式で保存済みなら type を NIP-07 へ更新し、旧方式固有の credential/session だけを best-effort
  で削除します。プロフィール、リレー設定、別 pubkey の保存済みアカウントは維持します。

## 準備完了を待つ `whenReady()`

`whenReady(): Promise<void>` は、アプリのマウントと初期化が完了した後に解決します。
`ehagaki-ready` も同じ準備完了時に発火します。

Full で `auto-login` を有効にした場合は、保存済み認証または NIP-07 fallback の認証後 bootstrap
（Nostr session、リレー・プロフィール、ストア同期を含む）、もしくは失敗後の guest session
bootstrap が完了するまで、どちらも成立しません。`auto-login` 未指定の Full と Lite Host-owned の
既存 ready timing は変更されません。

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

## Full self-publish と Lite Host-owned

通常の Full distribution (`/web-component/ehagaki-composer.js`) は eHagaki が署名・Relay
publish を行う self-publish 専用です。既存の `whenReady()`、`assetBase`、`setContext()`、
`setSettings()`、イベント、Shadow DOM、single-instance 制約はそのまま利用できます。Full
element には Host-owned の `configureHostOwned()` と `setCustomEmojis()` は公開されません。

Host-owned を組み込むページは Lite distribution
(`/web-component/host-owned/ehagaki-composer.js`) だけを import してください。両方の
distribution は同じ `<ehagaki-composer>` tag を定義するため、1 document では **exactly one**
だけを import します。Lite は `configureHostOwned()` を element の生成後、**最初の
`connectedCallback` より前に一度だけ**呼び出す必要があります。接続・切断・再接続後に mode や
handler を交換することはできません。変更が必要な場合は新しい element instance を生成して
ください。

`asset-base`/`assetBase` は import した distribution のディレクトリを connection 前に指定します。
Full は `/web-component/`、Lite は `/web-component/host-owned/` です。これにより icons、dynamic
chunks、MediaBunny、optional AAC encoder、image compression が同じ distribution から解決されます。
省略時の既存 fallback 挙動は維持され、新しい readiness error にはなりません。
`auto-login`/`autoLogin` は Full 専用で、Lite は指定されても無視します。

唯一の Host-owned manual sample は
[host-owned-composer-lite-example.html](../public/host-owned-composer-lite-example.html) です。

```js
const composer = document.createElement('ehagaki-composer');
composer.configureHostOwned({
  async submit(output, { signal }) {
    // The host owns kind, tags that express references, pubkey, timestamp,
    // signing and publication. `output` is not an unsigned Nostr event.
    const result = await publishFromHost(output, { signal });
    return { eventId: result.id };
  },
  // Optional. Omitting it makes this a text-only composer.
  async uploadMedia(file, metadata, { signal }) {
    const result = await uploadFromHost(file, metadata, { signal });
    return { url: result.url, imeta: { alt: metadata.originalName } };
  },
  contentWarningEnabled: true,
  hashtagPinEnabled: true,
});
const customEmojisReady = composer.setCustomEmojis([
  { shortcode: 'wave', url: 'https://cdn.example/emoji/wave.webp' },
]);
document.querySelector('#composer-mount').append(composer);
await composer.whenReady();
await customEmojisReady;
```

`submit` は Lite で必須です。`uploadMedia` は optional capability で、未指定時は file picker、paste、
drag & drop、gallery への新規メディア入力を受け付けず、eHagaki の upload destination や Nostr
認証への fallback は行いません。指定時は、eHagaki が圧縮・プレビュー・ギャラリー処理を行った
同じ Window realm の `File` を handler へ渡します。Base64 化はしません。handler は HTTP(S) URL と
allowlist 済みの imeta field だけを返せます。

Lite の Host handler に渡る `output` は `{ content, tags, context }` です。`tags` には hashtag、content
warning、custom emoji、imeta など composer-owned tag のみが入り、`kind`、`pubkey`、`created_at`、
`id`、`sig`、`e`/`p`/`q`/`a`/`k`、`client` は入りません。`context` は reply/quote/channel を
immutable snapshot として保持します。Host-owned mode では eHagaki は認証、guest Relay、target
fetch、profile/history/custom-emoji relay load を開始しません。reply/quote は reference-only の
non-loading state で表示され、host は snapshot を使って最終 event の構造 tag を決定します。

upload 中は submit を開始できず、submit 中は media input を開始できません。この判定はボタンだけで
なく keyboard shortcut、long press、PostComponent の公開 submit/upload path にも適用されます。
`setContext()` は既存どおり利用できますが、Host-owned submit 中は `submission_in_progress` で
reject されます。`ehagaki-composer-context-updated`、clear、`whenReady()`、`setSettings()` は維持されます。

Lite の `setCustomEmojis(catalog)` は Host-owned instance 専用のメモリ内 catalog を置換します。全 item を
検証してから atomic に反映し、空配列は clear です。catalog は reconnect では保持し、別 element や
self-publish mode の account-scoped catalog へは漏れません。

Host-owned Lite は host が提供した optional feature だけを表示します。`uploadMedia` を省略すると media
操作は表示されず、空または未設定の custom emoji catalog では custom emoji ボタンと picker は表示されません。
`setCustomEmojis([])` は開いている picker も閉じ、後から non-empty catalog を設定すると再び利用できます。
`contentWarningEnabled: true` と `hashtagPinEnabled: true` はそれぞれ Content Warning と hashtag pin の
UI・状態・出力後処理を有効にします。未指定または `false` の場合は無効で、以前の mount から共有 store に
残った状態も Lite の出力へ持ち越しません。hashtag pin が無効でも、本文の通常 hashtag 解析と
composer-owned `t` tag は維持されます。

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

親がすでに完全な署名済みNostr eventを保持している場合は、event IDをkeyにした
`preloadedEvents` を同じ `setContext()` に指定できます。これはその呼び出しのreply / quote
hydrationだけに使われ、保存や後続のcontextへは持ち越されません。

```js
await composer.setContext({
  reply: 'nevent1...',
  preloadedEvents: {
    'event-id-hex': {
      id: 'event-id-hex',
      pubkey: 'author-pubkey-hex',
      created_at: 1700000000,
      kind: 1,
      tags: [],
      content: '親が取得済みの本文',
      sig: 'event-signature-hex',
    },
  },
});
```

eventは構造、ID、hash、署名、reference ID、author hintとの一致を検証し、検証済みの
wire-field snapshotだけがhydrationへ渡されます。不正なpreloadだけが無視され、context全体は
rejectされません。relay runtimeがある場合は既存relay取得へfallbackし、Host-owned modeでは
従来どおりreference-only表示を維持します。

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
- `preloadedEvents` は補助入力のため、containerがobjectでない場合や個別eventが不正な場合も、
  context全体を拒否せずpreloadなしとして扱います

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

アプリの mount と初期化が完了したときに発火します。detail は `{ apiVersion: 1 }` です。

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

まず、少数の指定で埋め込み先に合わせる簡易テーマとして、次の2色を指定できます。

| CSS Custom Property | 用途 |
| --- | --- |
| `--ehagaki-accent-color` | 投稿ボタン、focus、選択状態などの主要アクセント |
| `--ehagaki-base-color` | neutralな背景・入力欄・footer・button surface・borderなどへ混ぜる基準色 |
| `--ehagaki-default-accent-color` | 内部ユーザーAccentが無い場合だけ使う弱い外部default |
| `--ehagaki-default-base-color` | 内部ユーザーBaseが無い場合だけ使う弱い外部default |

Base Colorは指定色でsurfaceを直接塗りつぶさず、light/darkそれぞれの既定neutral色へ
少量mixします。文字、アイコン、link、visited link、hashtag、danger、success、warningなどの
意味色はBase Colorから生成されません。指定値は有効なCSS `<color>` としてください。任意の色の
組み合わせについてコントラストを自動補正するAPIではないため、極端なAccent/Baseを指定する場合の
可読性はhost側で確認してください。

個別のtokenを調整したい場合は、従来の詳細overrideを使用できます。テーマ生成後に、指定された
個別overrideのtokenだけが上書きされます。

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
  /* 強制レイヤー */
  --ehagaki-accent-color: #28764f;
  --ehagaki-base-color: #dcefe4;

  /* ユーザー設定より弱いdefaultレイヤー */
  --ehagaki-default-accent-color: #1f7a4d;
  --ehagaki-default-base-color: #eef8f1;

  /* 詳細override（必要なtokenだけ） */
  --ehagaki-text: #183028;
  --ehagaki-font-family: system-ui, sans-serif;
}
```

Accent / Baseの優先順位は、`--ehagaki-accent-color` / `--ehagaki-base-color`（外部強制） > Full Web Component内部のユーザー設定 > `--ehagaki-default-accent-color` / `--ehagaki-default-base-color`（外部default） > eHagaki標準です。外部CSS値は内部ユーザー設定へ保存されず、強制値を削除すると保存済みユーザー色へ戻ります。Full Web ComponentのSettingsDialogは内部ユーザーAccent / Baseを表示・保存でき、強制中も無効化されません。Host-owned LiteにはSettingsDialogを追加せず、これらのCSS Custom Propertiesだけを利用できます。

Accent / Baseをどちらも指定しない場合は、現在のeHagakiの既定色が使われます。`themeMode` の
`system` / `light` / `dark` とhostへ適用される `color-scheme` に応じてsurfaceが切り替わります。

## ログイン・認証

Web Component 専用の signer callback/provider API はありません。

- NIP-07 では、コンポーネントと同じ Window realm にあるホストの `window.nostr` を直接利用します。
- 保存済み認証を優先し、復元できない場合に NIP-07 fallback を行うには、Full distribution で
  [`auto-login`](#auto-login--autologin) を指定します。既定では行いません。
- NIP-46 は、コンポーネント内の既存 eHagaki UI からログインします。
- ローカル秘密鍵（nsec）の入力、保存、保存済みアカウントの復元には対応しません。
- iframe の `auth.*` / `rpc.*` メッセージは Web Component では使いません。
- ホスト側から nsec をコンポーネントへ渡す API はありません。

Web Component はホストページと同じ Window realm / origin で動作します。信頼できない埋め込み元の
JavaScript から入力・保存された秘密鍵を取得されることを防ぐため、認証には NIP-07 や NIP-46 など、
秘密鍵そのものを Web Component へ入力しない方式を使用してください。この制限は Direct Web Component
固有であり、通常版/PWA と iframe 版では従来どおりローカル nsec 認証を利用できます。

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
| スタイル | iframe 内 document の CSS 境界 | ShadowRoot。CSS Custom Properties を公開 |
| Window realm | ホストとは分離 | ホストと共有 |
| NIP-07 | iframe の認証経路または parent-client 連携 | ホストの `window.nostr` を直接利用 |
| ローカル nsec | 利用可能 | 利用不可 |
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
- アカウント、NIP-46、リレー、設定、legacy-cleanup などの eHagaki 管理値も、この namespace の対象です。
- 旧 Web Component 版がこの namespace 内へ保存した nsec credential、nsec 型 account record、対応する
  active-account 状態は起動時に整理され、再利用されません。NIP-07/NIP-46 の account/session は保持されます。
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

## CORS / CSP / 動的chunk / Worker

クロスオリジン埋め込みでは、モジュール、チャンク、ワーカー、WASM を、埋め込み元
オリジンを許可する CORS ヘッダー付きで配信してください。`asset-base` は配信元のディレクトリを
指し、そこから以下のファイルへアクセスできる必要があります。

- Web Component のモジュール、動的chunk、ワーカー用アセット

CSP の `worker-src` では、動画圧縮が遅延ロードするworkerがある場合に備え、配信元オリジンを許可してください。
この経路のプロキシをホストの Service Worker に依存しないでください。

同一オリジンの PWA 配信では、生成されたワーカー用アセットを引き続き直接利用します。iOS Safari は
実際の配信元オリジンで確認してください。モバイルエミュレーションだけではワーカーや CORS の動作を
検証できません。

## ShadowRoot と外部入力

コンポーネントは open ShadowRoot を使います。Dialog、popover、tooltip、suggestion、PhotoSwipe
はコンポーネントの overlay root を対象にします。一方、browser-history と URL/share-target の
入力処理は無効化されています。

## 実動サンプル

公開サンプルは [https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html](https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html)
です。通常モードではページを開くと、既定の同梱モジュールとコンポーネントが自動的に接続されます。
任意のモジュールを試す場合は URL に `?manual=1` を付けて manual mode に入り、module URL を編集してから
`Create / Mount` を押してください。manual mode では明示的な操作までモジュールを読み込みません。

サンプルでは次の操作を確認できます。

- `Create / Mount`、`Destroy / Unmount`、`Recreate`
- `setSettings()` による初期設定と実行時設定
- `setContext()` による本文、reply、quote、multiple quote、channel
- `ehagaki-ready`、`ehagaki-post-success`、`ehagaki-post-error`、
  `ehagaki-composer-context-updated`、`ehagaki-initialization-error`
- 2 個目のインスタンスの `multiple_instances_unsupported` 拒否
- CSS Custom Properties

サンプルのイベントログは、秘密情報、署名要求 payload、生の Error を表示せず、安全な要約
だけを記録します。外部モジュールはホストページと同じ JavaScript 権限で実行されるため、
module URL と `asset-base` には信頼できる URL だけを指定してください。

Lite の Host-owned sample では text-only / media-enabled の切替、catalog、context、host submit/upload
の成功・失敗を、既存の Parent Client sample とは独立して確認できます。
