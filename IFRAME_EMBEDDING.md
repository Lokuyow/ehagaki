# eHagaki iframe埋め込みガイド

このドキュメントは、eHagaki を自分の Web サイトや Web アプリに iframe で埋め込みたい開発者向けの公開ガイドです。

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

### 初回埋め込み時の設定注入

親ページは iframe URL に埋め込み用設定クエリを付けることで、初回の埋め込み起動時だけ eHagaki の設定初期値を注入できます。

```html
<iframe
  src="https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com&embedLocale=en&embedTheme=dark&embedShowMascot=false"
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
- `embedMediaFreePlacement=true|false`
- `embedShowMascot=true|false`
- `embedShowBalloonMessage=true|false`

挙動は次のルールです。

- これらの値は embed 初回だけ適用されます
- ユーザーがすでに自分で変更した設定は、初回埋め込み時でも親ページから上書きされません
- ユーザーが設定変更した後の再訪問では、親ページの埋め込み設定で再上書きされません
- `embedShowMascot=false` のときは、フレーバーテキストもあわせて非表示になります
- `embedShowBalloonMessage=false` のときは info のフレーバーテキストだけを隠します。success / error / tips は簡素な表示で残ります
- `embedShowMascot` と `embedShowBalloonMessage` は設定ダイアログからユーザーが後で変更できます
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

- `embedTheme` 自体は `light|dark` だけを受け取ります
- 「OS に追従するかどうか」の判定は親ページ側で行い、その結果を child iframe に渡してください
- 既存の [public/embed-parent-client-example.html](public/embed-parent-client-example.html) もこの方式に合わせて、既定で親ページの `matchMedia` から初回テーマを注入するようになっています

## 2. リプライ / 複数引用状態で起動する

iframe の `src` に URL クエリを付けることで、埋め込み時点でリプライまたは引用を開始できます。

```html
<iframe
  src="https://lokuyow.github.io/ehagaki/?reply=nevent1..."
  width="600"
  height="400">
</iframe>

<iframe
  src="https://lokuyow.github.io/ehagaki/?quote=note1...&quote=nevent1..."
  width="600"
  height="400">
</iframe>

<iframe
  src="https://lokuyow.github.io/ehagaki/?content=Hello%20World&reply=nevent1...&quote=note1..."
  width="600"
  height="400">
</iframe>
```

- `reply` と `quote` は `nevent1...` / `note1...` の両方に対応します
- `reply` は最初に正しく decode できた 1 件だけを採用します
- `quote` は複数指定できます。同じ event id は重複排除されます
- `reply` と `quote` は同時指定できます
- `content` を一緒に渡すと、本文の初期値も設定できます

常時表示している iframe では、reply / quote を切り替えるたびに `src` を更新すると再読み込みが発生してチラつきます。その場合は初回表示だけ URL クエリを使い、起動後の更新は `postMessage` に切り替えてください。

### 常時表示 iframe の runtime 更新

iframe が `ready` を送った後は、親ページから `composer.setContext` と `composer.clearContext` を送ることで、iframe を再読み込みせずに reply / quote や本文を差し替えられます。

```js
iframe.contentWindow.postMessage({
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'composer.setContext',
  requestId: 'composer-1',
  payload: {
    reply: 'nevent1...',
    quotes: ['note1...', 'nevent1...'],
    content: 'Hello from parent',
  },
}, 'https://lokuyow.github.io');

iframe.contentWindow.postMessage({
  namespace: 'ehagaki.embed',
  version: 1,
  type: 'composer.clearContext',
  requestId: 'composer-2',
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
    console.log('iframe 側の reply / quote 変更', data.payload);
  }
});
```

- `composer.setContext` の `reply` と `quotes` は URL クエリと同じく `note1...` / `nevent1...` を使います
- `composer.setContext` の `content` は省略時は変更なし、文字列で本文置換、`null` で本文クリアです
- `composer.setContext` は mounted 済み iframe の reply / quote と本文を更新します
- `composer.clearContext` は現在の reply / quote だけをクリアします。本文は変更しません
- `requestId` を付けると、iframe は `composer.contextApplied` / `composer.contextError` に同じ `requestId` を載せて返します
- `composer.contextApplied` の payload は `{ timestamp }`、`composer.contextError` の payload は `{ timestamp, code, message? }` です
- iframe 内の UI で reply / quote を変更した場合、子側から `composer.contextUpdated` が送られます
- `composer.contextUpdated` の payload は `{ timestamp, reply, quotes }` です。`reply` は未設定時に `null`、`quotes` は常に配列です
- `event.origin` と `event.source` の検証は URL 起動時と同じく必須です

## 3. 親クライアント連携ログイン

親ページが Nostr signer を持っている場合、秘密鍵を iframe に渡さずに eHagaki をログインさせられます。

### 実動サンプル

リポジトリ内には実際に親ページとして動かせるサンプルを追加しています。

- [public/embed-parent-client-example.html](public/embed-parent-client-example.html)
- [public/embed-parent-client-example.js](public/embed-parent-client-example.js)

このサンプルは NIP-07 ログインと秘密鍵ログインの両方に対応しています。NIP-07 ログイン時は親ページの `window.nostr` を使って `signEvent` / `nip04.*` / `nip44.*` を委譲し、秘密鍵ログイン時は sample に保存した nsec で `signEvent` を処理します。受信時には namespace、version、type、requestId、payload shape を検証します。親クライアントのログインボタンを押すと sample 側にログイン状態を保存し、その時点で `auth.login` を iframe に送ります。ページを再読み込みした場合も、親がログイン済みなら `ready` 受信後に `auth.login` を再送して eHagaki を再同期します。さらに sample 内には `wss://nos.lol` を読む簡易タイムラインと本文同期 UI を追加してあり、各イベントの `reply` / `quote` ボタンと本文入力から iframe の runtime composer 更新を直接試せます。iframe が mounted 済みなら runtime の `composer.setContext` / `composer.clearContext` を使い、未接続時だけ URL 付きで再読み込みします。runtime 更新には `requestId` を付け、結果は `composer.contextApplied` / `composer.contextError` で確認できます。iframe 内で reply / quote を解除した場合は `composer.contextUpdated` が返り、sample 側の selection UI も自動で追従します。

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
5. ログイン後は `rpc.request` で `signEvent` / `nip04.*` / `nip44.*` を要求される

### 最小実装例

以下は最小例です。実際の運用では、上のサンプルのように受信メッセージを厳密に validate してください。

```html
<iframe
  id="ehagaki-iframe"
  src="https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com"
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
    'nip04.encrypt': async ({ pubkey, plaintext }) => plaintext,
    'nip04.decrypt': async ({ pubkey, ciphertext }) => ciphertext,
    'nip44.encrypt': async ({ pubkey, plaintext }) => plaintext,
    'nip44.decrypt': async ({ pubkey, ciphertext }) => ciphertext,
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
            capabilities: [
              'signEvent',
              'nip04.encrypt',
              'nip04.decrypt',
              'nip44.encrypt',
              'nip44.decrypt',
            ],
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
- `rpc.result`: 署名や暗号化の成功応答
- `rpc.error`: 署名や暗号化の失敗応答
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

- `requestId` は `auth.result` / `auth.error` / `rpc.result` / `rpc.error` にそのまま返してください
- `auth.login` だけではログインは完了しません。iframe から続けて来る `auth.request` に応答してください
- 親が未ログインなら `auth.request` に対して `auth.error` を返してください
- 未対応の RPC メソッドには machine-readable な `code` を含む `rpc.error` を返してください
- `event.origin` と `event.source` の検証は必須です
- 受信前に `namespace === "ehagaki.embed"` と `version === 1` を厳密に確認してください
- `type` は allowlist で検証してください。親ページが受ける想定は `ready`, `auth.request`, `rpc.request`, `post.success`, `post.error` です
- `requestId` は空文字を許可せず、応答系メッセージではそのままエコーしてください
- `auth.request.payload.capabilities` は string 配列で、許可した capability 名だけを受け付けてください
- `rpc.request.payload.method` は allowlist で検証し、`signEvent` は event shape、`nip04.*` / `nip44.*` は `pubkey` と text payload の型まで確認してください
- `post.success` / `post.error` も payload shape を検証し、不正メッセージは処理せずログだけ残すのが安全です