---
name: ehagaki-browser-debug
description: "eHagaki のブラウザ固有・実ブラウザ統合の不具合を再現・計測・修正・レビューする。通常の UI/CSS/文言変更や protocol-only 変更は対象外。"
---

# eHagaki Browser Debug

ブラウザ/OS の制約と eHagaki の不具合を切り分け、値や event が最初に不正になる owner を特定する。jsdom の結果や screenshot だけで native input や geometry の原因を確定しない。

## 証拠と責務の境界

- standalone/PWA、iframe、Direct Web Component を区別する。iframe は別 document、Web Component は host と同じ Window realm であり、host document・host element・Shadow DOM 内部を分けて観測する。
- viewport と container の座標系を混同しない。Shadow DOM 内にあることは host-relative positioning の証拠ではない。geometry 問題では対象と containing/overlay target の DOMRect・computed style を同じ event/frame で比較する。
- Dialog の focus/portal 問題を editor や global viewport state の補償で隠さない。既存 viewport/focus utility と component/hook/controller の owner を保つ。
- 必要な原因の根拠が再現、コード、ログ、テスト、正常経路との比較で得られれば修正へ進める。実端末で再現できることを一律の着手条件にしない。ただし、実測が必要な現象を推測で確認済みにしない。
- Playwright project 名や device descriptor から engine を推測せず、現在の config の `browserName` と対象 test/fixture を確認する。emulation は Android IME、iOS keyboard、VirtualKeyboard 実 geometry、browser chrome、PWA standalone UI、WebView の実端末証拠ではない。必要な実端末確認ができない場合は未確認と報告する。
- 診断には投稿本文も含めない。既存 UA 分岐の変更は通常タブ/PWA と feature detection の違いを考慮し、資料だけを根拠に workaround を足さない。

## 必要な詳細への入口

- owner、event source、cleanup、既存 harness/test の場所が不明なときは [browser debug map](references/browser-debug-map.md) の該当症状の節を読む。map は索引であり現在の checkout を優先する。
- viewport/keyboard、focus/composition、portal/Shadow DOM の時系列や座標の比較が必要なときだけ [計測メモ](references/measurement.md) の対応する節を読む。すべての値を収集する checklist ではない。
- document/transaction に原因が及ぶときは [editor](../ehagaki-editor/SKILL.md)、runtime public contract/ownership を扱うときは [embed runtime](../ehagaki-embed-runtime/SKILL.md)、event/relay/signing の意味論を扱うときは [Nostr](../ehagaki-nostr/SKILL.md) を併用する。browser で動くという理由だけで全 Skill を読まない。
