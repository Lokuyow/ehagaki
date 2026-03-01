<p align="center">
  <a href="https://lokuyow.github.io/ehagaki/">
    <img src="https://lokuyow.github.io/ehagaki/ehagaki_ogp.webp" alt="eHagaki OGP" width="50%" />
  </a>
</p>

# eHagaki
https://lokuyow.github.io/ehagaki/

eHagaki（えはがき）は、画像・動画圧縮機能付きの投稿専用Nostrクライアントです。  
デバイス上で画像や動画を自動圧縮し、効率的にNostrへ投稿できます。

## 主な特徴

- **Nostr投稿専用**: 投稿機能に特化し、シンプルなUIで快適な利用体験を提供
- **画像・動画圧縮**: 画像・動画はアップロード前に自動で圧縮され、通信量を削減（圧縮レベル調整可能）
- **Tiptapエディター**: 画像・動画・リンク・#ハッシュタグ対応のリッチエディター搭載
- **PWA対応**: モバイル・デスクトップ両対応、Androidはメディアアプリの共有ボタンからメディアアップロード可能
- **ドラフト機能**: 投稿内容を下書きとして保存し、後から編集・投稿が可能
- **多言語対応**: 日本語・英語に対応（ブラウザ設定から自動判定）

## URLクエリ

アクセス時にエディターへテキストを事前入力できます：

```
https://lokuyow.github.io/ehagaki/?content={url-encoded-text-here}
```

## iframe埋め込み

eHagakiは他のWebサイトにiframeとして埋め込むことができます。投稿の成功・失敗時には親ウィンドウへ`postMessage`で通知されます。

### 基本的な埋め込み例

```html
<!-- eHagakiをiframeで埋め込み -->
<iframe 
  id="ehagaki-iframe"
  src="https://lokuyow.github.io/ehagaki/"
  width="600" 
  height="400">
</iframe>

<script>
  // postMessageを受信
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://lokuyow.github.io') return;
    
    const data = event.data;
    if (data.type === 'POST_SUCCESS') {
      console.log('投稿成功:', data);
    } else if (data.type === 'POST_ERROR') {
      console.error('投稿失敗:', data);
    }
  });
</script>
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

## 技術スタック

### フロントエンド
- [Svelte 5](https://svelte.dev/) + [Vite](https://vitejs.dev/) - UI フレームワーク
- [bits-ui](https://www.bits-ui.com/) - Svelte UI コンポーネント
- [Tiptap v3](https://tiptap.dev/) - リッチテキストエディター
- [svelte-tiptap](https://github.com/sibiraj-s/svelte-tiptap) - Svelte向けTiptap統合
- [svelte-i18n](https://github.com/kaisermann/svelte-i18n) - 多言語対応

### Nostr
- [rx-nostr](https://penpenpng.github.io/rx-nostr/) - リレー管理とイベントストリーミング
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools) - Nostrプロトコル実装
- [nostr-login](https://github.com/nostrband/nostr-login) - 認証UI（拡張機能/Nostr Connect対応）

### メディア処理
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) - 画像圧縮
- [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) - 動画圧縮（WebAssembly版）
- [mediabunny](https://mediabunny.dev/) - 動画圧縮（WebCodecs API）
- [blurhash](https://github.com/woltapp/blurhash) - 画像プレースホルダー生成

### PWA
- [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) - Progressive Web App対応