# eHagaki 埋め込み・統合ガイド

eHagaki の Composer は、次の3方式で外部ページへ統合できます。

1. [iframe](./IFRAME_EMBEDDING.md)
2. Full Web Component
3. Host-owned Composer Lite Web Component

iframe の parent-client、storage delegation、`postMessage` API は [iframe詳細ガイド](./IFRAME_EMBEDDING.md) を、Web Component の公開 API は [Web Component APIリファレンス](./WEB_COMPONENT.md) を参照してください。

## どれを選ぶか

既存の Nostr クライアントが account、signer、event 構築、publish をすでに所有しているなら、まず **Host-owned Composer Lite** を選んでください。eHagaki の Composer UI と編集・メディア処理だけを同じ document に組み込み、最終 event の作成・署名・publish はホストへ戻せます。

eHagaki 自身に account/auth、relay、upload、sign、publish まで所有させ、同じ document に直接組み込みたい場合は **Full Web Component** を選びます。Full は eHagaki が self-publish します。

ホスト JavaScript との origin / 実行環境の隔離が必要な場合、または iframe の parent-client auth/RPC や storage / IndexedDB delegation を利用したい場合は **iframe** を選びます。

Host-owned Lite は既存 Nostr クライアントへ eHagaki の Composer UI / 編集処理を組み込む方式です。Lite 側は auth/account/session、Relay、target fetch、profile/history、draft、sign/send を所有せず、認証・署名・publish へ fallback しません。`submit` に渡る output は unsigned Nostr event ではなく、ホストが event を構築するための `{ content, tags, context }` です。

## 3方式比較

| 項目 | iframe | Full Web Component | Host-owned Composer Lite |
| --- | --- | --- | --- |
| DOM / Window境界 | 別 document、別 Window realm | 同じ document / Window realm、Shadow DOM | 同じ document / Window realm、Shadow DOM |
| trust boundary | origin境界を設計可能 | ホストと共有、隔離なし | ホストと共有、隔離なし |
| account / auth | eHagaki または parent-client | eHagaki が所有。NIP-07 は host の `window.nostr`、NIP-46 も利用可能 | ホストが所有。Lite は auth/account/session を持たない |
| event構築・署名・publish | eHagaki が event構築・publish。通常認証で署名し、parent-client利用時は署名を親へ委譲 | eHagaki が所有し self-publish | ホストが kind、reference tag、pubkey、timestamp、署名、publish を所有 |
| Relay | eHagaki が Relay接続・publish | eHagaki が所有 | ホストが所有。Lite は relay 接続しない |
| storage | iframe内、parent storage / IndexedDB delegation | ホスト origin の localStorage / IndexedDB | Composer固有の内部認証・履歴等は持たず、投稿処理はホスト所有 |
| styling / theme | iframe内設定、query、runtime `settings.set`、delegation | Shadow DOM と公開 CSS Custom Properties | Shadow DOM と公開 CSS Custom Properties。内部 SettingsDialog なし |
| contextの渡し方 | `postMessage` の embed protocol | `setContext()` と CustomEvent | `setContext()` と Host-owned output の `context` |
| 主な用途 | 隔離、parent-client連携、storage委譲 | eHagaki完結の直接組み込み | 既存Nostrクライアントへの Composer組み込み |

3方式のうち iframe だけが、別 origin で配信することで host JavaScript との origin 境界を設計できます。同一 origin で self-host する iframe にはこの隔離は成立しません。Web Component は host と同じ Window realm で動くため、host JavaScript から秘密情報を隔離する用途には使わないでください。Web Component distribution は compiled ES module なので、host framework は Svelte に限定されません。plain JavaScript、Svelte、React、Vue などから Custom Element として利用できます。

## Quick Start

### iframe

```html
<iframe
  src="https://lokuyow.github.io/ehagaki/"
  width="600"
  height="400"
  title="eHagaki Composer"
></iframe>
```

parent-client auth、`parentOrigin`、`postMessage`、storage delegation が必要な場合は [iframe詳細ガイド](./IFRAME_EMBEDDING.md) を参照してください。

### Full Web Component

```html
<script type="module" src="https://lokuyow.github.io/ehagaki/web-component/ehagaki-composer.js"></script>
<div style="height: 580px">
  <ehagaki-composer
    asset-base="https://lokuyow.github.io/ehagaki/web-component/"
  ></ehagaki-composer>
</div>

<script type="module">
  const composer = document.querySelector('ehagaki-composer');
  await composer.whenReady();
</script>
```

Full は eHagaki の UI から認証・署名・publish を行います。local nsec は Web Component では利用できません。NIP-07 は host の `window.nostr` を直接利用でき、NIP-46 も利用できます。

### Host-owned Composer Lite

Lite は Full と別 distribution です。1 document で Full と Lite の両方を import しないでください。`configureHostOwned()` は最初の connection より前に実行します。

```html
<div id="composer-mount" style="height: 580px"></div>
<script type="module">
  await import('https://lokuyow.github.io/ehagaki/web-component/host-owned/ehagaki-composer.js');

  const composer = document.createElement('ehagaki-composer');
  composer.assetBase = 'https://lokuyow.github.io/ehagaki/web-component/host-owned/';
  composer.configureHostOwned({
    async submit(output, { signal }) {
      // ここをhost自身の投稿処理へ接続する。
      // outputを使ってhostがeventを構築し、署名・publishする。
      void output;
      void signal;
      return undefined;
    },
  });
  document.querySelector('#composer-mount').append(composer);
  await composer.whenReady();
</script>
```

Lite の `submit(output, { signal })` に渡る `output` は unsigned Nostr event ではありません。host が event の kind、reference を表す構造 tag、pubkey、timestamp、署名、publish を所有します。Lite は eHagaki 側で認証・Relay・sign/send を開始しません。メディアをホストへ渡す場合は `uploadMedia` も `configureHostOwned()` に指定します。詳しい型と optional capability は [Web Component APIリファレンス](./WEB_COMPONENT.md) を参照してください。

## Web Component共通の重要事項

- Full と Lite はどちらも同じ `<ehagaki-composer>` tag を登録するため、1 document で両 distribution を import しないでください。接続可能なのは1 documentにつき1 instanceです。
- host は definite height を指定してください。`asset-base` / `assetBase` は connection 前に、import した distribution のディレクトリへ設定します。
- Shadow DOM 内のテーマ変更には公開 CSS Custom Properties を使用します。通常の host selector で内部 DOM を直接 style する契約ではありません。
- Full と Host-owned Lite は `focusEditor()` / `blurEditor()` で現在の投稿 Editor を制御できます。これは iframe の `postMessage` API ではありません。
- `ehagaki-ready.detail.apiVersion` は現在 `1` です。
- self-host する場合は entry だけでなく、その distribution の関連 assets、chunks、icons をディレクトリ構成ごと配信します。

### Theme

standalone / iframe / Full / Lite は Accent / Base から surface を生成する共通 generator と mix率を使用します。

Full Web Component の Accent / Base の優先順位は、`--ehagaki-accent-color` / `--ehagaki-base-color`（外部強制） > 内部ユーザー設定 > `--ehagaki-default-accent-color` / `--ehagaki-default-base-color`（外部 default） > eHagaki 標準です。Full の SettingsDialog では内部ユーザー Accent / Base を設定・保存できます。

Host-owned Lite には SettingsDialog を追加せず、host が公開 CSS Custom Properties で theme を指定します。`--ehagaki-background` などの詳細 CSS override は、Accent / Base 生成後の対象 token を直接上書きする既存契約です。

iframe の優先順位は、外部 forced（`embedAccentColor` / `embedBaseColor`、runtime `settings.set`） > iframe 内部ユーザー設定 > external default（`defaultAccentColor` / `defaultBaseColor`） > eHagaki 標準です。`settings.set` の `accentColor` / `baseColor` は `null` で runtime 強制を解除できます。詳細は [iframe詳細ガイド](./IFRAME_EMBEDDING.md) と [Web Component APIリファレンス](./WEB_COMPONENT.md) を参照してください。

## 公開サンプル

- iframe: [embed-parent-client-example.html](https://lokuyow.github.io/ehagaki/embed-parent-client-example.html)
- Full Web Component: [web-component-parent-client-example.html](https://lokuyow.github.io/ehagaki/web-component-parent-client-example.html)
- Host-owned Lite: [host-owned-composer-lite-example.html](https://lokuyow.github.io/ehagaki/host-owned-composer-lite-example.html)
