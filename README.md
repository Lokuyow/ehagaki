<p align="center">
  <a href="https://lokuyow.github.io/ehagaki/">
    <img src="https://lokuyow.github.io/ehagaki/ehagaki_ogp.webp" alt="eHagaki OGP" width="50%" />
  </a>
</p>

# eHagaki
https://lokuyow.github.io/ehagaki/

eHagaki（えはがき）は、画像・動画圧縮機能付きの投稿専用Nostrクライアントです。  
デバイス上で画像や動画を自動圧縮し、効率的にNostrへ投稿できます。

## URLクエリ
アクセス時にエディターにテキストを入れる
```
https://lokuyow.github.io/ehagaki/?content={url-encoded-text-here}
```

## iframe埋め込み

eHagakiは他のWebサイトにiframeとして埋め込むことができます。投稿の成功・失敗時には親ウィンドウへ`postMessage`で通知されます。

### 基本的な埋め込み例

```html
<!DOCTYPE html>
<html>
<head>
  <title>eHagaki 埋め込み例</title>
</head>
<body>
  <h1>Nostr投稿フォーム</h1>
  
  <!-- eHagakiをiframeで埋め込み -->
  <iframe 
    id="ehagaki-iframe"
    src="https://lokuyow.github.io/ehagaki/"
    width="600" 
    height="400"
    style="border: 1px solid #ccc;">
  </iframe>

  <div id="status"></div>

  <script>
    // postMessageを受信
    window.addEventListener('message', (event) => {
      // セキュリティ: 送信元のオリジンを確認
      if (event.origin !== 'https://lokuyow.github.io') {
        return;
      }

      const data = event.data;
      const statusDiv = document.getElementById('status');

      if (data.type === 'POST_SUCCESS') {
        console.log('投稿成功:', data);
        statusDiv.textContent = '✅ 投稿に成功しました！';
        statusDiv.style.color = 'green';
      } 
      else if (data.type === 'POST_ERROR') {
        console.error('投稿失敗:', data);
        statusDiv.textContent = `❌ 投稿に失敗: ${data.error || '不明なエラー'}`;
        statusDiv.style.color = 'red';
      }
    });
  </script>
</body>
</html>
```

### メッセージフォーマット

#### 投稿成功時
```javascript
{
  type: 'POST_SUCCESS',
  timestamp: 1729788000000  // Unix timestamp (ミリ秒)
}
```

#### 投稿失敗時
```javascript
{
  type: 'POST_ERROR',
  timestamp: 1729788000000,
  error: 'empty_content'  // エラーコード
}
```

### エラーコード一覧

| エラーコード      | 説明                                  |
| ----------------- | ------------------------------------- |
| `empty_content`   | 投稿内容が空                          |
| `login_required`  | ログインが必要                        |
| `nostr_not_ready` | Nostrクライアントが初期化されていない |
| `key_not_found`   | 秘密鍵が見つからない                  |
| `post_error`      | 一般的な投稿エラー                    |

### セキュリティに関する注意

iframe埋め込みを使用する際は、必ず送信元のオリジンを確認してください：

```javascript
window.addEventListener('message', (event) => {
  // 必ずオリジンをチェック
  if (event.origin !== 'https://lokuyow.github.io') {
    return; // 信頼できないオリジンからのメッセージは無視
  }
  
  // メッセージを処理
  // ...
});
```

## 主な特徴

- **Nostr投稿専用**: 投稿機能に特化し、シンプルなUIで快適な利用体験を提供
- **画像・動画圧縮**: 画像・動画はアップロード前に自動で圧縮され、通信量を削減
- **Tiptapエディター**: 画像・動画・リンク・ハッシュタグ対応のリッチエディター搭載
- **PWA対応**: モバイル・デスクトップ両対応、androidは画像アプリの共有ボタンから画像アップロード可能

## 技術スタック

- Svelte + Vite
- [Tiptap](https://tiptap.dev/) (エディター)
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools)
- [rx-nostr](https://github.com/nostr-dev-kit/rx-nostr)
- TypeScript