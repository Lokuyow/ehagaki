---
name: ehagaki-nostr
description: "eHagaki の Nostr event・tag・署名・relay 取得/配送を調査・変更・レビューする。表示だけの変更は対象外。"
---

# eHagaki Nostr

## Protocol と責務

- 対象の NIP、実際の event kind、tag/marker/author/relay hint/content の意味を確認する。UI 表示や NIP 番号だけから仕様を推測せず、NIP の wire semantics と eHagaki 固有の挙動を区別する。
- 既存 builder/resolver/adapter/service を使い、UI から直接 Nostr library を呼ばない。event 構築と取得、discovery/descriptor/fetch/cache/rendering の owner を保つ。
- `nostr-tools` の codec/署名補助、`rx-nostr` の relay transport/Observable、`@rx-nostr/crypto` の検証/秘密鍵署名、eHagaki の状態/永続化を混同しない。API はインストール済みの型と使用箇所を基準にする。

## Event と署名の制約

- event/tag 構築を変える場合は kind/content、tag 順序/重複、marker、root/parent、author/relay hint の該当する条件を protocol-focused test で直接検証する。NIP-10 の root と直接 parent、kind 42 の channel root を混同しない。
- quote/public chat/NIP-19 pointer は event ID だけでなく author/kind/relay hint の validation と sanitize 境界を保つ。
- signer pubkey、session pubkey、pointer author hint、relay-bound AUTH の一致検証を弱めない。署名結果の ID/署名/template 検証と operation の session ownership を維持する。
- 署名する kind を増やす場合は `NIP46_REQUESTED_PERMISSIONS` と関連テストを実際の範囲に合わせる。
- NIP-46 payload と署名要求本文も秘密情報として扱う。認証調査では kind/件数/長さ/状態など秘密を含まない情報だけを記録する。

## 取得・購読の制約

- 一回取得と継続購読を区別し、`createRxBackwardReq` / `createRxForwardReq`、REQ filter、relay 選択、EOSE/完了条件を対象経路で確認する。
- Observable/subscription と timeout/cancel/unsubscribe の owner を保つ。component 破棄、scope/account 変更、成功/失敗/timeout で解放し、旧 scope の async completion を新しい state に適用しない。
- 複数 relay の同一 event は既存の event ID 等で dedupe し、永続化/通知/状態遷移を重複実行しない。変更する cache の freshness、negative cache、invalidate/retry、同時要求共有を維持する。
- relay の検証は REQ/packet/EOSE/error/timeout を決定論的に mock し、実 relay に依存させない。

## 必要な詳細への入口

機能の owner/既存 test が不明な場合だけ [機能別索引](references/implementation-map.md#機能からownerを探す) を使う。投稿/Reaction、認証、履歴/coverage、upload の固有条件は同じ索引の該当節から確認する。NIP と製品 docs が仕様の入口、code/types/tests が実装の確認先であり、索引は仕様の代替ではない。一般的な検証量は [開発ガイド](../../guides/development.md) が所有する。

iframe/Direct Web Component の public API・delegation ownership は [embed runtime](../ehagaki-embed-runtime/SKILL.md)、browser realm/interception/geometry の実測は [browser debug](../ehagaki-browser-debug/SKILL.md)、editor representation/extraction は [editor](../ehagaki-editor/SKILL.md) の領域。該当部分を扱う場合だけ併用し、protocol-only 変更に browser 検証を追加しない。
