# eHagaki iframe埋め込みガイド

このドキュメントは、eHagaki を自分の Web サイトや Web アプリに iframe で埋め込みたい開発者向けの公開ガイドです。

できることは主に次の 3 つです。

- iframe として埋め込む
- リプライ / 引用状態で起動する
- 親ページの signer を使ってログインを委譲する

## 1. 基本の埋め込み

もっともシンプルな埋め込み例です。

```html
<iframe
  id="ehagaki-iframe"
  src="https://lokuyow.github.io/ehagaki/"
  width="600"
  height="400">
</iframe>

<script>
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://lokuyow.github.io') return;

    const data = event.data;
    if (data.type === 'POST_SUCCESS') {
      console.log('投稿成功', data);
    } else if (data.type === 'POST_ERROR') {
      console.error('投稿失敗', data);
    }
  });
</script>
```

投稿完了時は親ページへ `postMessage` が送られます。

- `POST_SUCCESS`: 投稿成功
- `POST_ERROR`: 投稿失敗

## 2. リプライ / 引用状態で起動する

iframe の `src` に URL クエリを付けることで、埋め込み時点でリプライまたは引用を開始できます。

```html
<iframe
  src="https://lokuyow.github.io/ehagaki/?reply=nevent1..."
  width="600"
  height="400">
</iframe>

<iframe
  src="https://lokuyow.github.io/ehagaki/?quote=note1..."
  width="600"
  height="400">
</iframe>
```

- `reply` と `quote` は `nevent1...` / `note1...` の両方に対応します
- `content` を一緒に渡すと、本文の初期値も設定できます
- 起動後は通常 UI と同じようにキャンセルできます

## 3. 親クライアント連携ログイン

親ページが Nostr signer を持っている場合、秘密鍵を iframe に渡さずに eHagaki をログインさせられます。

### 必須条件

- iframe URL に `parentOrigin` を付ける
- 親ページ側で `event.origin` と `event.source` の両方を検証する
- iframe へ秘密鍵を渡さない

推奨 URL 例:

```text
https://lokuyow.github.io/ehagaki/?parentOrigin=https%3A%2F%2Fexample.com
```

### ざっくりした流れ

1. iframe が `ready` を送る
2. 親がログイン済みなら `auth.login` を送る
3. iframe が `capabilities` と必要に応じて `silent` を含む `auth.request` を送る
4. 親が `auth.result` または `auth.error` を返す
5. ログイン後は `rpc.request` で `signEvent` / `nip04.*` / `nip44.*` を要求される

### 最小実装例

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
  const NS = 'ehagaki.parentClient';

  async function getCurrentPubkey() {
    return 'your-user-pubkey-hex';
  }

  async function signEventWithYourClient(event) {
    return event;
  }

  async function encryptNip04(peer, plaintext) {
    return plaintext;
  }

  async function decryptNip04(peer, ciphertext) {
    return ciphertext;
  }

  async function encryptNip44(peer, plaintext) {
    return plaintext;
  }

  async function decryptNip44(peer, ciphertext) {
    return ciphertext;
  }

  const rpcHandlers = {
    signEvent: async ({ event }) => signEventWithYourClient(event),
    'nip04.encrypt': async ({ peer, plaintext }) => encryptNip04(peer, plaintext),
    'nip04.decrypt': async ({ peer, ciphertext }) => decryptNip04(peer, ciphertext),
    'nip44.encrypt': async ({ peer, plaintext }) => encryptNip44(peer, plaintext),
    'nip44.decrypt': async ({ peer, ciphertext }) => decryptNip44(peer, ciphertext)
  };

  function postToIframe(message) {
    iframe.contentWindow.postMessage(message, EHAGAKI_ORIGIN);
  }

  window.addEventListener('message', async (event) => {
    if (event.origin !== EHAGAKI_ORIGIN) return;
    if (event.source !== iframe.contentWindow) return;

    const data = event.data;

    if (data?.type === 'POST_SUCCESS') {
      console.log('投稿成功', data);
      return;
    }

    if (data?.type === 'POST_ERROR') {
      console.error('投稿失敗', data);
      return;
    }

    if (data?.namespace !== NS || data?.version !== 1) return;

    if (data.type === 'ready') {
      const pubkeyHex = await getCurrentPubkey().catch(() => null);
      if (pubkeyHex) {
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'auth.login',
          payload: { pubkeyHex }
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
              'nip44.decrypt'
            ]
          }
        });
      } catch (error) {
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'auth.error',
          requestId: data.requestId,
          payload: {
            code: 'parent_client_not_logged_in',
            message: error instanceof Error ? error.message : 'parent_client_not_logged_in'
          }
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
          payload: { message: 'unsupported method' }
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
          payload: { result }
        });
      } catch (error) {
        postToIframe({
          namespace: NS,
          version: 1,
          type: 'rpc.error',
          requestId: data.requestId,
          payload: {
            message: error instanceof Error ? error.message : 'sign failed'
          }
        });
      }
    }
  });
</script>
```

### 親ページが返すメッセージ

- `auth.login`: 親側のログイン状態が変わったので iframe に再認証してほしい
- `auth.result`: 認証成功。`pubkeyHex` と利用可能な capability を返す
- `auth.error`: 未ログイン、拒否、または認証不能。`auth.request` への失敗応答
- `rpc.result`: 署名や暗号化の成功応答
- `rpc.error`: 署名や暗号化の失敗応答
- `auth.logout`: iframe 側をログアウトさせる

### 親ページが受ける主な payload

- `ready`: iframe 側の待受開始通知。`payload.capabilities` が付くことがあります
- `auth.request`: `payload.capabilities` と `payload.silent` を含みます
- `rpc.request`: `payload.method` と `payload.params` を含みます
- `nip04.*` / `nip44.*` の `params` は現行実装では `pubkey` ではなく `peer` キーを使います

### capability 一覧

- `signEvent`
- `nip04.encrypt`
- `nip04.decrypt`
- `nip44.encrypt`
- `nip44.decrypt`

## 4. 投稿結果のメッセージ形式

### 投稿成功

```javascript
{
  type: 'POST_SUCCESS',
  timestamp: 1729788000000,
  replyTo: 'abc123...',
  quotedEvent: 'def456...'
}
```

- `replyTo` はリプライ投稿時のみ付きます
- `quotedEvent` は引用投稿時のみ付きます

### 投稿失敗

```javascript
{
  type: 'POST_ERROR',
  timestamp: 1729788000000,
  error: 'empty_content'
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
- 未対応の RPC メソッドには `rpc.error` を返してください
- `event.origin` と `event.source` の検証は必須です