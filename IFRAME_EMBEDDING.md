# eHagaki iframe埋め込みガイド

このドキュメントは、eHagaki を自分の Web サイトや Web アプリに iframe で埋め込みたい開発者向けの公開ガイドです。

> まずは動作確認用サンプルを直接開くには、以下の URL をブラウザで開いてください。
>
> https://lokuyow.github.io/ehagaki/embed-parent-client-example.html
>
できることは主に次の 3 つです。

- iframe として埋め込む
- リプライ / 複数引用状態で起動する
- 親ページの signer を使ってログインを委譲する

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

親ページは iframe URL に埋め込み用設定クエリを付けることで、初回の埋め込み起動時だけ eHagaki の設定初期値を注入できます。

```html
<iframe
  src="https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com&embedLocale=en&embedTheme=dark&embedShowMascot=false"
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>
```

使えるクエリは次のとおりです。

- `embedLocale=ja|en`
- `embedTheme=light|dark`
- `embedUploadEndpoint=https://...`
- `embedImageCompression=none|low|medium|high`
- `embedVideoCompression=none|low|medium|high`
- `embedClientTag=true|false`
- `embedQuoteNotification=true|false`
- `embedMediaFreePlacement=true|false`
- `embedShowMascot=true|false`
- `embedShowBalloonMessage=true|false`

挙動は次のルールです。

- これらの値は embed 初回だけ適用されます
- ユーザーがすでに自分で変更した設定は、初回埋め込み時でも親ページから上書きされません
- ユーザーが設定変更した後の再訪問では、親ページの埋め込み設定で再上書きされません
- `embedShowMascot=false` のときは、フレーバーテキストもあわせて非表示になります
- `embedShowBalloonMessage=false` のときは info のフレーバーテキストだけを隠します。success / error / tips は簡素な表示で残ります
- `embedQuoteNotification` は引用投稿時に相手の `p` タグを追加するかを指定します。既定値は `false` です
- `embedShowMascot`、`embedShowBalloonMessage`、`embedQuoteNotification` は設定ダイアログからユーザーが後で変更できます
- 起動後の live 同期は行いません。初期値だけを渡したいときに使ってください

### 初回から OS のダークモードに合わせたい場合

iframe 内では `prefers-color-scheme` が親ページ側の `color-scheme` の影響を受けることがあります。そのため、子 iframe 側だけで「ユーザーの OS 設定そのもの」を初回起動時に確実に復元することはできません。

初回表示から OS に合わせたい場合は、親ページ側で `window.matchMedia('(prefers-color-scheme: dark)')` を評価し、その結果を `embedTheme=dark|light` として iframe URL に付けてください。

```html
<iframe id="ehagaki-iframe" width="600" height="400"></iframe>

<script>
  const iframe = document.getElementById('ehagaki-iframe');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const src = new URL('https://lokuyow.github.io/ehagaki/');

  src.searchParams.set('parentOrigin', window.location.origin);
  src.searchParams.set('embedTheme', prefersDark ? 'dark' : 'light');

  iframe.src = src.toString();
</script>
```

ローカル relay も使う場合は、ここでも `allow="local-network-access; local-network; loopback-network"` を付けてください。

- `embedTheme` 自体は `light|dark` だけを受け取ります
- 「OS に追従するかどうか」の判定は親ページ側で行い、その結果を child iframe に渡してください
- 既存の [public/embed-parent-client-example.html](public/embed-parent-client-example.html) もこの方式に合わせて、既定で親ページの `matchMedia` から初回テーマを注入するようになっています

## 2. リプライ / 複数引用 / channel 状態で起動する

iframe の `src` に URL クエリを付けることで、埋め込み時点でリプライ、引用、channel context を開始できます。

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
  src="https://lokuyow.github.io/ehagaki/?channel=nevent1...&channelRelay=wss%3A%2F%2Fchannel-write.example.com&channelRelay=wss%3A%2F%2Fchannel-backup.example.com&channelName=General&channelAbout=Public%20chat&channelPicture=https%3A%2F%2Fexample.com%2Fchannel.png"
  allow="local-network-access; local-network; loopback-network"
  width="600"
  height="400">
</iframe>
```

- `reply` と `quote` は `nevent1...` / `note1...` の両方に対応します
- `reply` は最初に正しく decode できた 1 件だけを採用します
- `quote` は複数指定できます。同じ event id は重複排除されます
- `reply` と `quote` は同時指定できます
- `channel` は kind 40 channel event の `nevent1...` / `note1...` を受け取ります
- `nevent1...` を使う場合は、出来るだけその中に relay hint を含めてください。
- `channelRelay` は複数指定できます。これは kind 42 の送受信に使う relay 一覧です
- `channelName`、`channelAbout`、`channelPicture` は任意です。親が渡した場合は iframe 側でそのまま preview に使います
- `channelRelay` が 1 件以上ある場合は、その relay 一覧を channel message 用 `relays` としてそのまま使います
- `channelName`、`channelAbout`、`channelPicture` が 1 つも渡されなかった場合は、iframe 側が relay に REQ して kind 40 / kind 41 event から metadata と `relays` を解決します
- `channelRelay` が無く、親が `channelName`、`channelAbout`、`channelPicture` のどれかを渡した場合は、`relays` は未指定として扱い、kind 42 は eHagaki 自身の write relay 一覧を使います
- `content` を一緒に渡すと、本文の初期値も設定できます

常時表示している iframe では、reply / quote / channel を切り替えるたびに `src` を更新すると再読み込みが発生してチラつきます。その場合は初回表示だけ URL クエリを使い、起動後の更新は `postMessage` に切り替えてください。

### 常時表示 iframe の runtime 更新

iframe が `ready` を送った後は、親ページから `composer.setContext` を送ることで、iframe を再読み込みせずに reply / quote / channel や本文を差し替えられます。

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

- `composer.setContext` の `reply` と `quotes` は URL クエリと同じく `note1...` / `nevent1...` を使います
- `composer.setContext` の `channel` は `{ reference, relays?, name?, about?, picture? }` です。`reference` は `note1...` / `nevent1...` を使います
- `nevent1...` を使う場合は、出来るだけその中に relay hint を含めてください。
- `channel.relays` は kind 42 を送受信するための relay 一覧です。親がこれを渡した場合は、その relay 一覧をそのまま使います
- `channel.name` / `channel.about` / `channel.picture` のうち 1 つでも渡された場合は、その値を iframe 側の channel preview に使います
- `channel.relays` も preview metadata も渡されなかった場合は、iframe 側が relay に REQ して kind 40 / kind 41 から `name` / `about` / `picture` と `relays` を解決します
- `channel.relays` が無く、`channel.name` / `channel.about` / `channel.picture` のどれかを親が渡した場合は、`relays` は未指定として扱い、eHagaki 自身の write relay 一覧を使います
- `composer.setContext` は patch として扱われます。`undefined` は変更なし、`reply: null` は reply 解除、`quotes: []` または `quotes: null` は quote 全解除、`channel: null` は channel context 解除、`content: null` は本文クリアです
- `composer.setContext` は mounted 済み iframe の reply / quote / channel と本文を更新します
- `composer.setContext` の `requestId` は必須です。iframe は `composer.contextApplied` / `composer.contextError` に同じ `requestId` を載せて返します
- `composer.contextApplied` の payload は `{ timestamp }`、`composer.contextError` の payload は `{ timestamp, code, message? }` です
- iframe 内の UI で reply / quote / channel を変更した場合、子側から `composer.contextUpdated` が送られます
- `composer.contextUpdated` の payload は `{ timestamp, reply, quotes, channel }` です。`channel` は `{ reference, relays?, name?, about?, picture? } | null` で返ります。`reply` は未設定時に `null`、`quotes` は常に配列です
- `event.origin` と `event.source` の検証は URL 起動時と同じく必須です

## 3. 親クライアント連携ログイン

親ページが Nostr signer を持っている場合、秘密鍵を iframe に渡さずに eHagaki をログインさせられます。

### 実動サンプル

リポジトリ内には実際に親ページとして動かせるサンプルを追加しています。

- [public/embed-parent-client-example.html](public/embed-parent-client-example.html)
- [public/embed-parent-client-example.js](public/embed-parent-client-example.js)

オンラインで直接確認するには [https://lokuyow.github.io/ehagaki/embed-parent-client-example.html](https://lokuyow.github.io/ehagaki/embed-parent-client-example.html) を開いてください。

このサンプルは NIP-07 ログインと秘密鍵ログインの両方に対応しています。現在の eHagaki は親クライアントへ既定で `signEvent` だけを要求し、将来の NIP-17 系フロー向け optional capability として `nip44.*` だけを扱います。NIP-04 はサポートしません。NIP-07 ログイン時は親ページの `window.nostr` を使って要求された capability だけを委譲し、秘密鍵ログイン時は sample に保存した nsec で `signEvent` を処理します。受信時には namespace、version、type、requestId、payload shape を検証します。親クライアントのログインボタンを押すと sample 側にログイン状態を保存し、その時点で `auth.login` を iframe に送ります。ページを再読み込みした場合も、親がログイン済みなら `ready` 受信後に `auth.login` を再送して eHagaki を再同期します。さらに sample 内には `wss://nos.lol` を読む簡易タイムライン、channel context 入力欄、本文同期 UI を追加してあり、各イベントの `reply` / `quote` ボタンと channel reference 入力から iframe の runtime composer 更新を直接試せます。iframe が mounted 済みなら runtime の `composer.setContext` を使い、未接続時だけ URL 付きで再読み込みします。runtime 更新では `requestId` が必須で、結果は `composer.contextApplied` / `composer.contextError` で確認できます。iframe 内で reply / quote / channel を変更した場合は `composer.contextUpdated` が返り、sample 側の selection UI も自動で追従します。

### 必須条件

- iframe URL に `parentOrigin` を付ける
- 親ページ側で `event.origin` と `event.source` の両方を検証する
- iframe へ秘密鍵を渡さない
- sample の秘密鍵ログインは demo 用実装です。nsec を親ページの localStorage に平文保存し、ログアウト時に削除します
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
- `type` は allowlist で検証してください。親ページが受ける想定は `ready`, `auth.request`, `rpc.request`, `post.success`, `post.error` に加えて composer 関連通知です。未知の type は warn のみで無視すると、将来の optional 拡張に追従しやすくなります
- `requestId` は空文字を許可せず、応答系メッセージではそのままエコーしてください
- `auth.request.payload.capabilities` は string 配列で、許可した capability 名だけを受け付けてください
- `rpc.request.payload.method` は allowlist で検証し、`signEvent` は event shape を確認してください。`nip44.*` を許可する場合だけ追加で `pubkey` と text payload の型まで確認してください
- `post.success` / `post.error` も payload shape を検証し、不正メッセージは処理せずログだけ残すのが安全です
