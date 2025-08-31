<p align="center">
  <a href="https://lokuyow.github.io/ehagaki/">
    <img src="https://lokuyow.github.io/ehagaki/ehagaki_ogp.webp" alt="eHagaki OGP" width="50%" />
  </a>
</p>

# eHagaki
https://lokuyow.github.io/ehagaki/

eHagaki（えはがき）は、画像圧縮機能付きの投稿専用Nostrクライアントです。  
デバイス上で画像を自動圧縮し、効率的にNostrへ投稿できます。

## 主な特徴

- **Nostr投稿専用**: 投稿機能に特化し、シンプルなUIで快適な利用体験を提供
- **画像圧縮**: 画像はアップロード前に自動で圧縮され、通信量を削減
- **Tiptapエディター**: 画像・リンク・ハッシュタグ対応のリッチエディター搭載
- **PWA対応**: モバイル・デスクトップ両対応、androidは画像アプリの共有ボタンから画像アップロード可能

## 技術スタック

- Svelte + Vite
- [Tiptap](https://tiptap.dev/) (エディター)
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools)
- [rx-nostr](https://github.com/nostr-dev-kit/rx-nostr)
- TypeScript

## 注意事項

- 本アプリはNostr投稿専用です。タイムライン閲覧等はできません。
- 秘密鍵の管理には十分ご注意ください。