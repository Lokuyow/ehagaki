---
name: ehagaki-embed-runtime
description: "eHagaki の runtime ownership と iframe/Web Component の公開契約を調査・変更・レビューする。通常の standalone UI や browser 固有現象の計測だけは対象外。"
---

# eHagaki Embed Runtime

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

入口/owner/test が不明な場合、または変更する公開契約の詳細が必要な場合だけ [embed runtime map](references/embed-runtime-map.md) の関連節を読む。現在の checkout を優先し、map 全体を起動時に読まない。

- iframe: detection/protocol、auth delegation、settings/composer、storage のうち対象 message の節。
- Web Component: public API、lifecycle、storage/auth/navigation のうち対象契約の節。Full/Lite の違いは public API 節で確認する。
- asset/base/build/sample: asset/style と build/delivery の節。

signer delegation の transport/owner は本 Skill、署名内容や NIP/event/tag/relay semantics は [Nostr](../ehagaki-nostr/SKILL.md)、受領後の document 適用は [editor](../ehagaki-editor/SKILL.md) が扱う。該当する境界を変更するときだけ併用する。
