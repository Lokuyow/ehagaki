# ブラウザ計測メモ

原因を区別するために必要な節と値だけを使う。入口や既存の計測対象は [browser debug map](browser-debug-map.md) の対応する症状から探す。

## Viewport / keyboard

layout viewport (`innerWidth/innerHeight`、document client size)、VisualViewport (`width/height/offsetTop/offsetLeft/pageTop`)、必要なら VirtualKeyboard (`overlaysContent`、`boundingRect`) と scroll offset を同じ event/frame で比較する。対象 DOMRect と既存 CSS 変数の producer/consumer を対応付ける。keyboard の高さだけから visible frame の origin を推測しない。

resize/scroll/geometrychange と rAF の境界でずれる場合は、値に event 順と frame を付ける。別タイミングの snapshot を一つの状態として比較しない。通常タブと PWA、portrait/landscape、実キーボードと emulation を区別する。

## Focus / composition

`activeElement` だけでなく selection anchor、editor 内判定、composition 状態と focus/blur/selectionchange の順を照合する。eHagaki の focus utility は selection が editor 内に残る場合も扱う。Shadow DOM では document と shadow root の active element を分ける。本文や clipboard 内容ではなく状態と順序を記録する。

## Portal / container / media geometry

host document viewport、host element、component container、overlay mount target、対象要素の DOMRect と computed position/transform/overflow を比較する。fixed/absolute の基準や portal の所属は DOM の実測から確定する。

font/media load、placeholder と loaded state、animation の前後を区別する。画像/video は container と media の box、intrinsic size を対応付ける。描画上の差は screenshot と数値を合わせて説明し、待機は固定 sleep ではなく該当 load/state/event を使う。

実行条件は OS/browser/version、runtime、viewport、入力手段、再現操作を必要な範囲で残す。実端末でしか検証できない部分は結果と分け、調査用 instrumentation・trace・画像は完了時に削除する。
