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

### リプライ・引用投稿

URLクエリパラメータでリプライや引用投稿を指定できます。`nevent1...` または `note1...` 形式（NIP-19）に対応しています。

```
# リプライ
https://lokuyow.github.io/ehagaki/?reply=nevent1...

# note1形式でも可
https://lokuyow.github.io/ehagaki/?reply=note1...

# 引用
https://lokuyow.github.io/ehagaki/?quote=nevent1...

# note1形式でも可
https://lokuyow.github.io/ehagaki/?quote=note1...
```

- リプライ: NIP-10準拠のe/pタグを自動構築（スレッドroot引き継ぎ対応）
- 引用: NIP-18準拠のqタグを自動構築し、投稿時に引用イベントとして処理されます
- URLクエリ由来の参照イベントはプレビュー表示されます
- エディタ本文に `nostr:nevent1...` または `nostr:note1...` を含めた場合も引用として処理されます
- 本文中の複数の `nostr:` URI は出現順に処理されます
- 本文中の `nostr:` URI からの引用ではプレビューは表示されません
- ×ボタンでリプライ/引用をキャンセルし、通常投稿に戻れます

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

### iframeからリプライ・引用を開始する

iframeの `src` に `reply` または `quote` クエリを含めると、埋め込み先からリプライ・引用状態で起動できます。

```html
<!-- リプライを開始 -->
<iframe
  id="ehagaki-reply"
  src="https://lokuyow.github.io/ehagaki/?reply=nevent1..."
  width="600"
  height="400">
</iframe>

<!-- 引用を開始 -->
<iframe
  id="ehagaki-quote"
  src="https://lokuyow.github.io/ehagaki/?quote=note1..."
  width="600"
  height="400">
</iframe>
```

- `content` と併用して投稿文の初期値も渡せます
- `reply` / `quote` には `nevent1...` と `note1...` の両方を使えます
- リプライ・引用の指定後は、通常のUIと同様にキャンセル可能です

### メッセージフォーマット

#### 投稿成功時
```javascript
{
  type: 'POST_SUCCESS',
  timestamp: 1729788000000,  // Unix timestamp (ミリ秒)
  replyTo: 'abc123...',      // リプライ先イベントID（リプライ投稿時のみ）
  quotedEvent: 'def456...'   // 引用元イベントID（引用投稿時のみ）
}
```

- `replyTo` はリプライ投稿時のみ含まれます
- `quotedEvent` は引用投稿時のみ含まれます
- 通常投稿ではどちらも含まれません

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

### メディア処理
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) - 画像圧縮
- [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) - 動画圧縮（WebAssembly版）
- [mediabunny](https://mediabunny.dev/) - 動画圧縮（WebCodecs API）
- [blurhash](https://github.com/woltapp/blurhash) - 画像プレースホルダー生成

### PWA
- [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) - Progressive Web App対応