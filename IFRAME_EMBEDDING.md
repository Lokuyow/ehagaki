# eHagaki iframe埋め込みガイド

このドキュメントは、eHagaki を自分の Web サイトや Web アプリに iframe で埋め込みたい開発者向けの公開ガイドです。

> まずは動作確認用サンプルを直接開くには、以下の URL をブラウザで開いてください。
>
> https://lokuyow.github.io/ehagaki/embed-parent-client-example.html
>
このガイドでは、次の連携方法を説明します。

- iframe として埋め込む
- テーマ、言語、圧縮設定などを注入・同期する
- iOS Safari などで iframe 内 localStorage が使えない場合に、親ページへ設定保存を委譲する
- リプライ、引用、パブリックチャット、本文を起動時または実行中に指定する
- 親ページの signer を使ってログインを委譲する
- 投稿結果を親ページで受け取る

## 1. 基本の埋め込み

もっともシンプルな埋め込み例です。

```html
<iframe
  id="ehagaki-iframe"
  src="https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com"
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>

<script>
  const EMBED_NS = 'ehagaki.embed';

  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://lokuyow.github.io') return;

    const data = event.data;
    if (data?.namespace !== EMBED_NS || data?.version !== 1) return;

    if (data.type === 'post.success') {
      console.log('投稿成功', data.payload);
    } else if (data.type === 'post.error') {
      console.error('投稿失敗', data.payload);
    }
  });
</script>
```

投稿完了時は親ページへ `postMessage` が送られます。

- `post.success`: 投稿成功
- `post.error`: 投稿失敗

### デバイス内ローカル relay を使う場合

NIP-46 の bunker URL に `ws://127.0.0.1:4869/` のようなデバイス内ローカル relay を含める場合、Chrome 系ブラウザでは親ページ側の iframe から local / loopback network access を委譲する必要があることがあります。

```html
<iframe
  id="ehagaki-iframe"
  src="https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com"
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>
```

- `ws://127.0.0.1` や `ws://localhost` の relay を iframe 内で使う場合は、この `allow` を付けてください
- Chrome 系では policy 名が移行中のため 3 つ並べています。未対応ブラウザは未知の policy 名を無視します
- これが無いと、直アクセスでは接続できても cross-origin iframe 内だけ local relay 接続が失敗することがあります

### 初回埋め込み時の設定注入

親ページは iframe URL に埋め込み用設定クエリを付けることで、eHagaki の設定を起動時に注入できます。親ページから iframe 内の localStorage は通常読めないため、毎回強制したい設定と未保存時だけ使いたい既定値をクエリ名で分けます。

```html
<iframe
  src="https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com&embedLocale=en&embedTheme=dark&embedShowMascot=false"
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>
```

毎回強制するクエリは次のとおりです。iframe を開くたびに保存済み設定も上書きします。

- `embedLocale=ja|en`
- `embedTheme=system|light|dark`
- `embedUploadEndpoint=https://...`
- `embedImageQuality=none|low|medium|high`
- `embedVideoQuality=none|low|medium|high`
- `embedClientTag=true|false`
- `embedQuoteNotification=true|false`
- `embedReplyNotification=true|false`
- `embedMediaFreePlacement=true|false`
- `embedShowMascot=true|false`
- `embedShowFlavorText=true|false`

未保存時だけ使う既定値クエリは次のとおりです。対応する設定が eHagaki 側 localStorage に保存済みなら上書きしません。

- `defaultLocale=ja|en`
- `defaultTheme=system|light|dark`
- `defaultUploadEndpoint=https://...`
- `defaultImageQuality=none|low|medium|high`
- `defaultVideoQuality=none|low|medium|high`
- `defaultClientTag=true|false`
- `defaultQuoteNotification=true|false`
- `defaultReplyNotification=true|false`
- `defaultMediaFreePlacement=true|false`
- `defaultShowMascot=true|false`
- `defaultShowFlavorText=true|false`

挙動は次のルールです。

- `embed~` は毎回強制、`default~` は設定ごとに未保存時だけ適用されます
- 同じ設定に `embed~` と `default~` を両方付けた場合は `embed~` が優先されます
- `embedUploadEndpoint` / `defaultUploadEndpoint` は localStorage ではなく `eHagakiDB.uploadDestinations` の既定アップロード先へ反映されます
- `embedShowMascot=false` のときは、フレーバーテキストもあわせて非表示になります
- 旧クエリ `embedImageCompression` / `embedVideoCompression` / `defaultImageCompression` / `defaultVideoCompression` も互換用に受け付けます。旧クエリの `low` は旧 UI 上の「高」、`high` は旧 UI 上の「低」として解釈されます
- `embedShowFlavorText=false` のときは info のフレーバーテキストだけを隠します。success / error / tips は簡素な表示で残ります
- `embedQuoteNotification` は引用投稿時に相手の `p` タグを追加するかを指定します。既定値は `false` です
- `embedReplyNotification` はリプライ時に直接のリプライ先以外の継承 `p` タグを既定で追加するかを指定します。既定値は `false` です
- 起動後に親設定へ追従させたい場合は `postMessage` の `settings.set` を使ってください

### eHagaki 本体の初期設定

埋め込みクエリを指定しない場合、iframe 内の eHagaki は通常起動時と同じ初期設定で起動します。アップロード先は eHagaki 側 IndexedDB へ、その他の設定は初回参照時に eHagaki 側 localStorage へ保存されます。

| 設定                   | 初期値                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| 言語                   | ブラウザ言語が日本語なら `ja`、それ以外は `en`                                                         |
| テーマ                 | `system`。iframe 内で見えている `prefers-color-scheme` に追従                                          |
| アップロード先         | 言語が `ja` なら `https://share.yabu.me/api/v2/media`、それ以外は `https://nostrcheck.me/api/v2/media` |
| 画像圧縮               | `medium`                                                                                               |
| 動画圧縮               | `medium`                                                                                               |
| client tag             | `true`                                                                                                 |
| 引用通知               | `false`                                                                                                |
| メディア自由配置       | `false`                                                                                                |
| マスコット表示         | `true`                                                                                                 |
| フレーバーテキスト表示 | `true`                                                                                                 |

### テーマを指定する場合

eHagaki のテーマ設定は初回起動時の既定値が `system` です。そのため、通常は `embedTheme` を省略しても iframe 内 eHagaki はシステム設定に追従します。

親ページ側から毎回テーマを強制したい場合は `embedTheme=system|light|dark`、未保存時だけ既定値を渡したい場合は `defaultTheme=system|light|dark` を付けてください。`system` は iframe 内で見えている `prefers-color-scheme` の変化に追従します。iframe 内の `prefers-color-scheme` は親ページ側の `color-scheme` の影響を受けることがあります。

```html
<iframe id="ehagaki-iframe" width="600" height="400"></iframe>

<script>
  const iframe = document.getElementById('ehagaki-iframe');
  const src = new URL('https://lokuyow.github.io/ehagaki/');

  src.searchParams.set('parentOrigin', window.location.origin);
  src.searchParams.set('embedTheme', 'dark');

  iframe.src = src.toString();
</script>
```

ローカル relay も使う場合は、ここでも `allow="local-network-access; local-network; loopback-network"` を付けてください。

- `embedTheme=system` は iframe 起動ごとに system へ戻したい場合に使えます
- `defaultTheme=light|dark` は eHagaki 側にテーマ保存がない時だけ初期値を指定したい場合に使ってください
- 既存の [public/embed-parent-client-example.html](public/embed-parent-client-example.html) は、`embed~` / `default~` と実行中の `settings.set` を切り替えて試せます

## 2. リプライ / 複数引用 / パブリックチャット状態で起動する

iframe の `src` に URL クエリを付けることで、起動時の composer context を指定できます。composer context には、リプライ先、引用対象、パブリックチャット、本文の初期値が含まれます。

ここでいうパブリックチャットは Nostr の kind 40 channel を選択し、投稿を kind 42 channel message として送る状態です。

```html
<iframe
  src="https://lokuyow.github.io/ehagaki/?reply=nevent1..."
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>

<iframe
  src="https://lokuyow.github.io/ehagaki/?quote=note1...&quote=nevent1..."
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>

<iframe
  src="https://lokuyow.github.io/ehagaki/?content=Hello%20World&reply=nevent1...&quote=note1..."
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>

<iframe
  src="https://lokuyow.github.io/ehagaki/?channel=nevent1...&channelRelays=wss%3A%2F%2Fchannel-write.example.com%2Cwss%3A%2F%2Fchannel-backup.example.com&channelName=General&channelAbout=Public%20chat&channelPicture=https%3A%2F%2Fexample.com%2Fchannel.png"
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>
```

指定できる URL クエリは次のとおりです。

| クエリ | 用途 |
| ------ | ---- |
| `reply=nevent1...` または `reply=note1...` | リプライ先を指定します。最初に正しく decode できた 1 件だけを採用します |
| `quote=nevent1...` または `quote=note1...` | 引用対象を指定します。複数指定でき、同じ event id は重複排除されます |
| `channel=nevent1...` または `channel=note1...` | パブリックチャットの kind 40 channel を指定します |
| `channelRelays=wss://...,wss://...` | kind 42 の送受信に使う relay です。カンマ区切りで複数指定できます |
| `channelName=...` / `channelAbout=...` / `channelPicture=...` | パブリックチャットの preview metadata です。指定した値を iframe 側でそのまま使います |
| `content=...` | 本文の初期値です |

`reply`、`quote`、`channel`、`content` は同時に指定できます。`nevent1...` を使う場合は、できるだけ relay hint を含めてください。

パブリックチャットの relay と metadata は次のルールで扱われます。

- `channelRelays` が 1 件以上ある場合は、その一覧を kind 42 用 relay として使います
- `channelName`、`channelAbout`、`channelPicture` の非空値は、このcomposerセッション中の明示値として維持されます。欠落または空文字の項目だけ、IndexedDB cacheとkind 40 / kind 41から補完されます
- `channelRelays` は一時的な追加write relay候補として検証済みchannel relayより先に使われます。eHagaki自身の既定write relayも従来どおり併用されます
- 外部relayは`channelRelays`を先、`nevent`内のrelay hintを後の順に、両者合計で最大3件です。正規化と重複排除後、`channelRelays`へ割り当てた残りだけを一時read hintに使います
- URL由来の表示値やrelay候補は検証済みcacheとして保存されません
- URL由来の表示値と一時write relayはruntime-onlyです。verified値を含むstable contextとは分離され、現行V1下書きには保存されません

常時表示している iframe では、context を切り替えるたびに `src` を更新すると再読み込みが発生してチラつきます。その場合は初回表示だけ URL クエリを使い、起動後の更新は `postMessage` に切り替えてください。

### 常時表示 iframe の実行中更新

iframe が `ready` を送った後は、親ページから `composer.setContext` を送ることで、iframe を再読み込みせずに composer context を差し替えられます。

```js
iframe.contentWindow.postMessage({
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'composer.setContext',
  requestId: 'composer-1',
  payload: {
    reply: 'nevent1...',
    quotes: ['note1...', 'nevent1...'],
    channel: {
      reference: 'nevent1channel...',
      relays: ['wss://channel-write.example.com'],
      name: 'General',
      about: 'Public chat',
      picture: 'https://example.com/channel.png',
    },
    content: 'Hello from parent',
  },
}, 'https://lokuyow.github.io');

iframe.contentWindow.postMessage({
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'composer.setContext',
  requestId: 'composer-2',
  payload: {
    reply: null,
    quotes: [],
    channel: null,
  },
}, 'https://lokuyow.github.io');

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://lokuyow.github.io') return;
  if (event.source !== iframe.contentWindow) return;

  const data = event.data;
  if (data?.namespace !== 'ehagaki.embed' || data?.version !== 1) return;

  if (data.type === 'composer.contextApplied') {
    console.log('composer context 反映完了', data.requestId, data.payload);
  }

  if (data.type === 'composer.contextError') {
    console.error('composer context 反映失敗', data.requestId, data.payload);
  }

  if (data.type === 'composer.contextUpdated') {
    console.log('iframe 側の composer context 変更', data.payload);
  }
});
```

- `reply` と `quotes` は URL クエリと同じく `note1...` / `nevent1...` を使います
- `channel` は `{ reference, relays?, name?, about?, picture? }` です。`reference` は `note1...` / `nevent1...` を使います
- `channel.relays` は kind 42 用の一時的な追加write relay候補です。正規化・重複排除後、`channel.relays`を先、`reference`内のrelay hintを後の順に共有する最大3件枠へ制限され、検証済みcacheや現行V1下書きには保存されません
- `channel.name` / `channel.about` / `channel.picture` は三値です。省略（`undefined`）はDB・relayから補完可能、`null` は明示クリア、非空文字列は明示値として扱い、同じcomposerセッション中はDB・relay結果で上書きされません
- `composer.setContext`はpayload全体をstate変更前に検証します。metadataの空文字・空白のみ、型不一致、不正なreference、不正なrelay、または一部でも不正なquoteがあれば全体を適用せず`composer.contextError`を返します。`channel.reference`、`reply`、`quotes[]`の`nevent`内relayもすべて明示的な`ws:`/`wss:` URLである必要があり、不正値を1件でも含むreferenceはrejectします。重複quoteはevent idで重複排除します
- `composer.setContext` は patch として扱われます。`undefined` は変更なし、`reply: null` は reply 解除、`quotes: []` または `quotes: null` は quote 全解除、`channel: null` はパブリックチャット解除、`content: null` は本文クリアです
- `composer.setContext` の `requestId` は必須です。iframe は `composer.contextApplied` / `composer.contextError` に同じ `requestId` を載せて返します
- `composer.contextApplied` の payload は `{ timestamp }` です。payload全体の構文とreferenceを検証し、channel、reply、quotes、contentの利用可能な初期状態を設定した時点で返します。IndexedDB補完、kind 40 / kind 41取得、reply / quote参照イベントhydrate、プロフィール取得の完了は待ちません
- 同期検証に失敗した場合は `composer.contextApplied` を送らず、`composer.contextError`（`{ timestamp, code, message? }`）を返します。非同期補完の失敗は初期選択を維持する非致命的失敗であり、`composer.contextError`にはしません
- iframe 内のUI操作または非同期補完で通知対象のstable contextが変わった場合、子側から `composer.contextUpdated` が送られます。初期適用そのものや同一内容は重複通知しません
- `composer.contextUpdated` の payload は `{ timestamp, reply, quotes, channel }` です。`channel` は `{ reference, relays?, name?, about?, picture? } | null` で返ります。`reply` は未設定時に `null`、`quotes` は常に配列です
- 外部contextの`composer.contextUpdated.channel.relays`には親が指定した一時write overrideだけを返し、verified channel relayは含めません。stableなread hintは`reference`へ保持します。通常UI由来で外部provenanceがないcontextではstable channel relayを返します
- `event.origin` と `event.source` の検証は URL 起動時と同じく必須です

### 常時表示 iframe の設定同期

常時表示している iframe で親ページのテーマや言語設定に追従させたい場合は、iframe が `ready` を送った後と親設定が変わったタイミングで `settings.set` を送ってください。

```js
iframe.contentWindow.postMessage({
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'settings.set',
  requestId: 'settings-1',
  payload: {
    locale: 'en',
    themeMode: 'dark',
    showMascot: false,
  },
}, 'https://lokuyow.github.io');
```

- `settings.set` の `requestId` は必須です
- payload は部分更新です。指定できるキーは `locale`, `themeMode`, `uploadEndpoint`, `imageQualityLevel`, `videoQualityLevel`, `clientTagEnabled`, `quoteNotificationEnabled`, `replyNotificationEnabled`, `mediaFreePlacement`, `showMascot`, `showFlavorText` です。旧 `imageCompressionLevel` / `videoCompressionLevel` も互換用に受け付けます
- `uploadEndpoint` は localStorage ではなく `eHagakiDB.uploadDestinations` の既定アップロード先へ反映されます。他の設定は iframe 内 eHagaki の localStorage に保存されます
- 成功時は `settings.applied`、失敗時は `settings.error` が同じ `requestId` で返ります
- `settings.applied` の payload は `{ timestamp, applied }`、`settings.error` の payload は `{ timestamp, code, message? }` です

### iframe 内 storage が使えない場合の親保存委譲

iOS Safari など一部ブラウザでは、cross-origin iframe 内の localStorage が安定して使えないことがあります。その場合、親ページが `storage.*` メッセージに応答すると、eHagaki は設定を親ページ側 localStorage に委譲できます。

この仕組みは任意です。親ページが `storage.*` に対応していない場合、eHagaki は従来どおり iframe 内 localStorage だけを使います。

子 iframe から親ページへ送られる request は次の 3 種類です。

```js
// 保存済み値の読み込み
{
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'storage.get',
  requestId: 'storage-1',
  payload: {
    keys: ['locale', 'themeMode']
  }
}

// 値の保存
{
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'storage.set',
  requestId: 'storage-2',
  payload: {
    values: {
      locale: 'en',
      themeMode: 'dark'
    }
  }
}

// 値の削除
{
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'storage.remove',
  requestId: 'storage-3',
  payload: {
    keys: ['darkMode']
  }
}
```

親ページは同じ `requestId` で `storage.result` または `storage.error` を返してください。

```js
iframe.contentWindow.postMessage({
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'storage.result',
  requestId: 'storage-1',
  payload: {
    timestamp: Date.now(),
    values: {
      locale: 'en',
      themeMode: 'dark'
    }
  }
}, 'https://lokuyow.github.io');

iframe.contentWindow.postMessage({
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'storage.error',
  requestId: 'storage-1',
  payload: {
    timestamp: Date.now(),
    code: 'storage_parent_failed',
    message: 'optional error detail'
  }
}, 'https://lokuyow.github.io');
```

親保存に対応するキーは次の allowlist だけです。秘密鍵、アカウント、NIP-46 session、下書き、profile / relay 個別データは親保存委譲の対象外です。

- `locale`
- `themeMode`
- `darkMode`
- `clientTagEnabled`
- `quoteNotificationEnabled`
- `replyNotificationEnabled`
- `imageQualityLevel`
- `videoQualityLevel`
- `imageCompressionLevel`（旧キー、読み込み互換用）
- `videoCompressionLevel`（旧キー、読み込み互換用）
- `mediaFreePlacement`
- `showMascot`
- `showFlavorText`
- `settingsPreferenceMetadata`
- `firstVisit`
- `sharedMediaProcessed`

親ページ側では、eHagaki のキーと衝突しないように prefix を付けて保存することを推奨します。

```js
const STORAGE_PREFIX = 'ehagaki.embed.storage.v1:';
const ALLOWED_STORAGE_KEYS = new Set([
  'locale',
  'themeMode',
  'darkMode',
  'clientTagEnabled',
  'quoteNotificationEnabled',
  'replyNotificationEnabled',
  'imageQualityLevel',
  'videoQualityLevel',
  'imageCompressionLevel',
  'videoCompressionLevel',
  'mediaFreePlacement',
  'showMascot',
  'showFlavorText',
  'settingsPreferenceMetadata',
  'firstVisit',
  'sharedMediaProcessed',
]);

function postToIframe(message) {
  iframe.contentWindow.postMessage(message, 'https://lokuyow.github.io');
}

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://lokuyow.github.io') return;
  if (event.source !== iframe.contentWindow) return;

  const data = event.data;
  if (data?.namespace !== 'ehagaki.embed' || data?.version !== 1) return;
  if (!data.requestId) return;

  if (data.type === 'storage.get') {
    const values = {};
    for (const key of data.payload.keys) {
      if (!ALLOWED_STORAGE_KEYS.has(key)) return;
      values[key] = localStorage.getItem(STORAGE_PREFIX + key);
    }
    postToIframe({
      namespace: 'ehagaki.embed',
      version: 1,
      type: 'storage.result',
      requestId: data.requestId,
      payload: { timestamp: Date.now(), values },
    });
  }

  if (data.type === 'storage.set') {
    const applied = [];
    for (const [key, value] of Object.entries(data.payload.values)) {
      if (!ALLOWED_STORAGE_KEYS.has(key) || typeof value !== 'string') return;
      localStorage.setItem(STORAGE_PREFIX + key, value);
      applied.push(key);
    }
    postToIframe({
      namespace: 'ehagaki.embed',
      version: 1,
      type: 'storage.result',
      requestId: data.requestId,
      payload: { timestamp: Date.now(), applied },
    });
  }

  if (data.type === 'storage.remove') {
    const removed = [];
    for (const key of data.payload.keys) {
      if (!ALLOWED_STORAGE_KEYS.has(key)) return;
      localStorage.removeItem(STORAGE_PREFIX + key);
      removed.push(key);
    }
    postToIframe({
      namespace: 'ehagaki.embed',
      version: 1,
      type: 'storage.result',
      requestId: data.requestId,
      payload: { timestamp: Date.now(), removed },
    });
  }
});
```

初回描画のテーマや言語のちらつきを抑えたい場合は、親ページに保存済みの `themeMode` / `locale` を iframe URL の `defaultTheme` / `defaultLocale` にも反映してください。起動後に `storage.get` の結果が返ると、iframe 側の設定ストアも親保存値へ同期されます。

#### IndexedDB 設定の親保存委譲

アップロード先の一覧・既定値は `eHagakiDB.uploadDestinations` に保存されます。親ページが `idb.*` メッセージに応答すると、iframe 側はこの store の snapshot を親ページ側 IndexedDB に委譲できます。

現在の IndexedDB 委譲対象は `uploadDestinations` だけです。下書き、共有メディア、custom emoji、profile / relay cache など他 store は対象外です。

子 iframe から親ページへ送られる request は次の 2 種類です。

```js
// uploadDestinations snapshot の読み込み
{
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'idb.getSnapshot',
  requestId: 'idb-1',
  payload: {
    store: 'uploadDestinations',
    scopeKey: '__ehagaki_global__'
  }
}

// uploadDestinations snapshot の保存
{
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'idb.setSnapshot',
  requestId: 'idb-2',
  payload: {
    store: 'uploadDestinations',
    scopeKey: '__ehagaki_global__',
    records: [
      {
        id: '...',
        pubkeyHex: null,
        scopeKey: '__ehagaki_global__',
        name: 'blossom.band',
        protocol: 'blossom',
        serverUrl: 'https://blossom.band',
        presetId: 'blossom-band',
        isDefault: true,
        enabled: true,
        createdAt: 1710000000000,
        updatedAt: 1710000000000,
        capabilities: {
          maxUploadSize: null,
          supportedMimeTypes: [],
          supportsDelete: true,
          supportsList: true,
          supportsMirror: false,
          supportsMediaOptimization: false,
          authRequired: true,
          source: 'preset'
        },
        auth: { type: 'blossom-bud11' },
        schemaVersion: 1
      }
    ]
  }
}
```

親ページは同じ `requestId` で `idb.result` または `idb.error` を返してください。親側に snapshot がまだない場合、`idb.result` の `records` を省略します。iframe 側は local IndexedDB の内容を作成・読み込み後、親へ `idb.setSnapshot` で mirror します。

```js
iframe.contentWindow.postMessage({
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'idb.result',
  requestId: 'idb-1',
  payload: {
    timestamp: Date.now(),
    store: 'uploadDestinations',
    scopeKey: '__ehagaki_global__',
    records: []
  }
}, 'https://lokuyow.github.io');
```

既存の [public/embed-parent-client-example.html](public/embed-parent-client-example.html) は、localStorage 委譲と `uploadDestinations` の IndexedDB 委譲に対応しています。

### 都度生成 iframe の設定注入

普段は iframe を表示せず、ボタン押下などで毎回ダイアログ内に iframe を生成する場合は、生成する URL に親ページの現在設定を付けてください。

- 親設定に必ず合わせたい場合は `embedTheme=...` や `embedLocale=...` を付けます
- eHagaki 側に保存がない時だけ既定値を渡したい場合は `defaultTheme=...` や `defaultLocale=...` を付けます
- 生成直後に `ready` を受け取ったら、必要に応じて同じ内容を `settings.set` で再送できます
- 親ページから iframe 内 localStorage を読む前提にはしないでください

## 3. 親クライアント連携ログイン

親ページが Nostr signer を持っている場合、秘密鍵を iframe に渡さずに eHagaki をログインさせられます。

### 実動サンプル

リポジトリ内には実際に親ページとして動かせるサンプルを追加しています。

- [public/embed-parent-client-example.html](public/embed-parent-client-example.html)
- [public/embed-parent-client-example.js](public/embed-parent-client-example.js)

オンラインで直接確認するには [https://lokuyow.github.io/ehagaki/embed-parent-client-example.html](https://lokuyow.github.io/ehagaki/embed-parent-client-example.html) を開いてください。

サンプルでは、親ページ側の signer を使ったログインと composer context の更新を試せます。

ログイン方法は 2 種類です。

- NIP-07 ログイン: 親ページの `window.nostr` を使い、eHagaki が要求した capability だけを委譲します
- 秘密鍵ログイン: サンプルに保存した nsec で `signEvent` を処理します。デモ用実装です

現在の eHagaki が既定で要求する capability は `signEvent` です。将来の NIP-17 系フロー向け optional capability として `nip44.*` だけを扱い、NIP-04 はサポートしません。

親クライアントのログインボタンを押すと、サンプル側にログイン状態を保存して `auth.login` を iframe に送ります。ページ再読み込み後も、親がログイン済みなら `ready` 受信後に `auth.login` を再送します。受信メッセージは namespace、version、type、requestId、payload shape を検証します。

composer context の動作確認用に、サンプルには簡易タイムライン、パブリックチャット入力欄、本文同期 UI があります。各イベントの `reply` / `quote` ボタンや channel reference 入力から、iframe のリプライ、引用、パブリックチャット、本文を更新できます。

iframe のアプリが起動済みなら `composer.setContext` で更新し、未接続時だけ URL クエリ付きで再読み込みします。実行中更新では `requestId` が必須です。結果は `composer.contextApplied` / `composer.contextError` で確認できます。iframe 内で composer context を変更した場合は `composer.contextUpdated` が返り、サンプル側の selection UI も追従します。

### 必須条件

- iframe URL に `parentOrigin` を付ける
- 親ページ側で `event.origin` と `event.source` の両方を検証する
- iframe へ秘密鍵を渡さない
- サンプルの秘密鍵ログインはデモ用実装です。nsec を親ページの localStorage に平文保存し、ログアウト時に削除します
- NIP-07 ログインと秘密鍵ログインは排他的に扱い、切り替える前にログアウトします

推奨 URL 例:

```text
https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com
```

### ざっくりした流れ

1. iframe が `ready` を送る
2. 親がログイン済みなら、`ready` を受け取った時点で `auth.login` を送って iframe を再同期する
3. iframe が `auth.request` を送る
4. 親が `auth.result` または `auth.error` を返す
5. ログイン後は `rpc.request` で既定では `signEvent` を要求される。`nip44.*` は将来必要になった場合だけ opt-in で要求される

### 最小実装例

以下は最小例です。実際の運用では、上のサンプルのように受信メッセージを厳密に validate してください。

```html
<iframe
  id="ehagaki-iframe"
  src="https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com"
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>

<script type="module">
  const iframe = document.getElementById('ehagaki-iframe');
  const EHAGAKI_ORIGIN = 'https://lokuyow.github.io';
  const NS = 'ehagaki.embed';

  async function getCurrentPubkey() {
    return 'your-user-pubkey-hex';
  }

  async function signEventWithYourClient(event) {
    return event;
  }

  const rpcHandlers = {
    signEvent: async ({ event }) => signEventWithYourClient(event),
  };

  function postToIframe(message) {
    iframe.contentWindow.postMessage(message, EHAGAKI_ORIGIN);
  }

  window.addEventListener('message', async (event) => {
    if (event.origin !== EHAGAKI_ORIGIN) return;
    if (event.source !== iframe.contentWindow) return;

    const data = event.data;
    if (data?.namespace !== NS || data?.version !== 1) return;

    if (data.type === 'post.success') {
      console.log('投稿成功', data.payload);
      return;
    }

    if (data.type === 'post.error') {
      console.error('投稿失敗', data.payload);
      return;
    }

    if (data.type === 'ready') {
      const pubkeyHex = await getCurrentPubkey().catch(() => null);
      if (pubkeyHex) {
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'auth.login',
          payload: { pubkeyHex },
        });
      }
      return;
    }

    if (data.type === 'auth.request') {
      try {
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'auth.result',
          requestId: data.requestId,
          payload: {
            pubkeyHex: await getCurrentPubkey(),
            capabilities: ['signEvent'],
          },
        });
      } catch (error) {
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'auth.error',
          requestId: data.requestId,
          payload: {
            code: 'parent_client_not_logged_in',
            message: error instanceof Error ? error.message : 'parent_client_not_logged_in',
          },
        });
      }
      return;
    }

    if (data.type === 'rpc.request') {
      const handler = rpcHandlers[data.payload?.method];

      if (!handler) {
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'rpc.error',
          requestId: data.requestId,
          payload: {
            code: 'unsupported_method',
            message: 'unsupported method',
          },
        });
        return;
      }

      try {
        const result = await handler(data.payload.params ?? {});
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'rpc.result',
          requestId: data.requestId,
          payload: { result },
        });
      } catch (error) {
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'rpc.error',
          requestId: data.requestId,
          payload: {
            code: 'rpc_failed',
            message: error instanceof Error ? error.message : 'sign failed',
          },
        });
      }
    }
  });
</script>
```

### 親ページが返す主なメッセージ

- `auth.login`: 親側のログイン状態が変わったので iframe に再認証してほしい
- `auth.result`: 認証成功。`pubkeyHex` と利用可能な capability を返す
- `auth.error`: 未ログイン、拒否、または認証不能。`auth.request` への失敗応答
- `rpc.result`: 署名や optional capability の成功応答
- `rpc.error`: 署名や optional capability の失敗応答
- `auth.logout`: iframe 側をログアウトさせる

## 4. 投稿結果のメッセージ形式

### 投稿成功

```javascript
{
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'post.success',
  payload: {
    timestamp: 1729788000000,
    eventId: 'published-event-id',
    replyToEventId: 'abc123...',
    quotedEventIds: ['def456...', 'ghi789...']
  }
}
```

- `eventId` は投稿成功時のイベント id です
- `replyToEventId` はリプライ投稿時のみ付きます
- `quotedEventIds` はストア由来の引用対象一覧です

### 投稿失敗

```javascript
{
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'post.error',
  payload: {
    timestamp: 1729788000000,
    code: 'empty_content',
    message: 'empty_content'
  }
}
```

エラーコード:

| コード            | 説明                       |
| ----------------- | -------------------------- |
| `empty_content`   | 投稿内容が空               |
| `login_required`  | ログインが必要             |
| `nostr_not_ready` | Nostr クライアント初期化前 |
| `key_not_found`   | 秘密鍵が見つからない       |
| `post_error`      | 一般的な投稿エラー         |

## 5. 実装時の注意

- `auth.request` / `rpc.request` には必ず non-empty な `requestId` を付け、`auth.result` / `auth.error` / `rpc.result` / `rpc.error` にそのまま返してください
- `auth.login` だけではログインは完了しません。iframe から続けて来る `auth.request` に応答してください
- 親が未ログインなら `auth.request` に対して `auth.error` を返してください
- 未対応の RPC メソッドには machine-readable な `code` を含む `rpc.error` を返してください
- `event.origin` と `event.source` の検証は必須です
- 受信前に `namespace === "ehagaki.embed"` と `version === 1` を厳密に確認してください
- `type` は allowlist で検証してください。親ページが受ける想定は `ready`, `auth.request`, `rpc.request`, `post.success`, `post.error` に加えて settings / composer 関連通知です。未知の type は warn のみで無視すると、将来の optional 拡張に追従しやすくなります
- `requestId` は空文字を許可せず、応答系メッセージではそのままエコーしてください
- `auth.request.payload.capabilities` は string 配列で、許可した capability 名だけを受け付けてください
- `rpc.request.payload.method` は allowlist で検証し、`signEvent` は event shape を確認してください。`nip44.*` を許可する場合だけ追加で `pubkey` と text payload の型まで確認してください
- `post.success` / `post.error` も payload shape を検証し、不正メッセージは処理せずログだけ残すのが安全です
