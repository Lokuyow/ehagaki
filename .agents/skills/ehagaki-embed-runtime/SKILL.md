---
name: ehagaki-embed-runtime
description: "eHagaki の runtime 責務と iframe/Web Component の公開契約を調査・変更・レビューする。"
---

# eHagaki Embed Runtime

app/host/delegation の責務、公開 API/message、runtime ごとの初期化・配信を扱うときに使う。通常の standalone UI や browser 固有現象の計測だけには適用しない。

## Runtime と ownership

- 対象を standalone、iframe、Direct Web Component Full、Host-owned Lite から特定する。判定は `AppRuntimeEnvironment.runtimeKind`、iframe service、entrypoint の実装を使い、DOM/layout から推測しない。
- standalone/iframe は `src/main.ts`、Full は `src/web-component/entry.ts`、Lite は `src/web-component/host-owned-entry.ts` が入口。共通 App と runtime adapter の責務を保ち、runtime 固有の修正を global workaround にしない。
- iframe は別 document と `postMessage` を使う。auth、settings、composer context、storage、IndexedDB delegation は独立した service/contract であり、同じ transport だからと統合しない。
- Web Component は host と同じ Window realm にあり、public method と composed DOM event を使う。host document と app-owned Shadow DOM を分ける。
- Full は self-publish 専用。`configureHostOwned()` / `setCustomEmojis()` は Lite が所有する。Lite の submit/media handoff は Host の責務であり、auth/account/session、relay/NIP-46、event sign/send を Lite の graph に持ち込まない。
- 値/副作用の app-owned、host-owned、delegated の境界を維持する。delegated state に local fallback や二重 source of truth を加えず、service worker、external input、history、local nsec auth、storage namespace の runtime 制御を他 runtime へ漏らさない。

## Public contract と lifecycle

- 変更する API/message は現在の producer と consumer、型、対応する docs/sample/test を照合する。URL input、bootstrap、runtime message は別経路であり、同じ入力に見えても一部だけで契約を変えない。
- iframe の namespace/version/envelope、`parentOrigin`、`event.origin` / `event.source`、schema、capability、request ID の validation を維持する。request の timeout と pending cleanup を保ち、検証失敗を fallback で迂回しない。
- Web Component の ready/error、single-instance、reconnect 契約を保つ。connect/disconnect の generation、Svelte mount/unmount、listener/observer、operation queue、pending ready promise、instance slot は既存 owner で管理する。
- 初期化中/parent auth 中の composer context は既存 controller の queue/flush 境界に従う。任意の timer で readiness を推測しない。
- 未実装の attribute/event、`::part()`、複数 instance 対応を既存仕様とみなさない。互換性/versioning は現在の code/docs と明示要件から判断する。

## Assets と表示境界

active runtime の `assetBase` と `resolveAppAssetUrl()` を使う。document の Vite base と Web Component bundle の `asset-base` は同一とは限らない。host origin の root-relative asset や host global CSS に依存させない。

Shadow DOM、`:host`、container、overlay target、公開済み CSS custom properties の境界を保つ。viewport と container の geometry、portal/focus の実測が必要なら [browser debug](../ehagaki-browser-debug/SKILL.md) を併用する。

## 必要な詳細への入口

入口/owner/test が不明な場合だけ [runtime 索引](references/embed-runtime-map.md#契約からownerを探す) を使う。詳細な API/message は索引から公開 docs・型・test へ進み、契約の写しを索引へ増やさない。初期化・権限・ready の固有条件は [注意点](references/embed-runtime-map.md#初期化とownershipの注意点)、asset/build は [配信の入口](references/embed-runtime-map.md#assetと配信の入口) を参照する。一般的なコマンド・検証量は [開発ガイド](../../guides/development.md) が所有する。

signer delegation の transport/owner は本 Skill、署名内容や NIP/event/tag/relay semantics は [Nostr](../ehagaki-nostr/SKILL.md)、受領後の document 適用は [editor](../ehagaki-editor/SKILL.md) が扱う。該当する境界を変更するときだけ併用する。
