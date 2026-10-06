# Sensitive Content Payload方式 設計メモ

> **Status:** Design discussion / experimental  
> **Relation to existing document:** 本書は `docs/SENSITIVE_CONTENT.md` を置き換えない。現在の `kind 36 / 3636` 仕様とは別案として整理する。  
> **Reference implementation:** SnowCait/nostter PR #2680 が本案の read-only 対応を実装している。

## 1. 目的

NIP-36 の `content-warning` は通常 event の `.content` に本文を保持したまま表示制御を行うため、NIP-36 を解釈しない client では Sensitive 本文が通常本文として表示され得る。

この案では、Sensitive 本文を `kind 36` へ分離し、元の event kind 側には本文を置かない。

狙いは次のとおり。

- Sensitive 非対応 client に本文を露出しない
- 元 event kind の identity / topology / subscription semantics を維持する
- 既存の `kind 1 / 42 / 1111` subscription をそのまま利用できる
- 対応 client は必要に応じて `kind 36` を取得できる
- NIP-22 など既存 NIP の構造的 tag semantics を元 event 側に維持する
- 本文と密接に結び付く metadata は本文と同じ payload 側に保持できる

## 2. 基本モデル

1つの Sensitive 投稿を2 eventで表す。

```text
Structure event
  kind: 元の kind
  content: ""
  tags:
    元 kind の構造・routing・identity に必要な tags
    content-warning
    c: <kind36-id> + relay hint

             │
             │ c
             ▼

Sensitive payload
  kind: 36
  content: Sensitive本文
  tags:
    k: <元の kind>
    本文・添付コンテンツに従属する metadata
```

### 2.1 Structure event

元の event kind をそのまま使う。

- `.content` は空
- 元 kind の identity / topology / routing を表す tags はここに置く
- 標準 NIP-36 形式の `content-warning` tag を持つ
- `c` tag で Sensitive 本文を持つ `kind 36` を参照する
- `c` には `kind 36` を取得するための relay hint を付けられる

```json
["c", "<kind36-event-id>", "<relay-hint>"]
```

Structure event は投稿の canonical identity とする。

したがって、event ID、thread topology、reply、reaction、repost、zap、deletion、ActionMenu 等の event-targeted operation は原則として Structure event を対象にする。

### 2.2 Sensitive payload

Sensitive 本文は `kind 36` の `.content` に置く。

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "<sensitive-content>",
  "tags": [
    ["k", "<original-kind>"]
  ]
}
```

`kind 36` における `k` tag は、その payload が属する Structure event の kind を表す。

例:

- `["k", "1"]` — kind 1 Text Note 用
- `["k", "42"]` — kind 42 Public Chat Message 用
- `["k", "1111"]` — kind 1111 NIP-22 Comment 用

`kind 36` 自体は投稿の canonical identity ではなく、Sensitive body payload として扱う。

## 3. Existing NIP-36 との判定

既存の NIP-36 と本方式を明確に区別する。

Structure event が次を満たす場合のみ、本方式の payload reference として扱う。

- 対応する Structure kind である
- `content-warning` tag がある
- `.content === ""`
- 有効な event ID を値に持つ `c` tag がちょうど1つある

一方、`content-warning` tag があっても `.content` が空でない場合は、既存 NIP-36 を優先する。

```text
content-warning あり
│
├─ content != ""
│    → 既存 NIP-36
│      structure.content を本文として表示
│      c があっても payload は取得しない
│
└─ content == ""
     + 正規な c tag
     → Sensitive Content Payload方式
```

この precedence により、既存 NIP-36 event を誤って payload方式として解釈しない。

## 4. Payload validation

Structure event が `c` で参照する event を Sensitive payload として採用するには、少なくとも次を検証する。

- `payload.id` が `c` の参照先 ID と一致する
- `payload.kind === 36`
- `payload.pubkey` が Structure event の `pubkey` と一致する
- `payload` に `k` tag がちょうど1つある
- `payload` の `k` が Structure event の kind と一致する

例:

```text
kind 1    --c--> kind 36 / k=1      OK
kind 42   --c--> kind 36 / k=42     OK
kind 1111 --c--> kind 36 / k=1111   OK

kind 1    --c--> kind 36 / k=1111   NG
```

payload が取得できない、または validation に失敗した場合は fail closed とし、Sensitive 本文を表示しない。

Structure event の空 `.content` へ fallback して通常本文として扱ってはならない。

## 5. ルート投稿の例

### kind 1 Structure event

```json
{
  "id": "<kind1-id>",
  "pubkey": "<author>",
  "kind": 1,
  "content": "",
  "tags": [
    ["content-warning", "reason"],
    ["c", "<kind36-id>", "wss://relay.example.com"]
  ]
}
```

### kind 36 Sensitive payload

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "Sensitiveな本文",
  "tags": [
    ["k", "1"]
  ]
}
```

関係:

```text
kind 1
  content: ""
  content-warning
  c ───────────────► kind 36
                      k: "1"
                      content: Sensitive本文
```

## 6. NIP-22 リプライの例

NIP-22 topology はすべて kind 1111 Structure event 側に保持する。

### kind 1111 Structure event

```json
{
  "id": "<kind1111-id>",
  "pubkey": "<author>",
  "kind": 1111,
  "content": "",
  "tags": [
    ["E", "<root-id>", "<root-relay-hint>", "<root-author>"],
    ["K", "1"],
    ["P", "<root-author>", "<root-relay-hint>"],

    ["e", "<parent-id>", "<parent-relay-hint>", "<parent-author>"],
    ["k", "1"],
    ["p", "<parent-author>", "<parent-relay-hint>"],

    ["content-warning", "reason"],
    ["c", "<kind36-id>", "wss://relay.example.com"]
  ]
}
```

### kind 36 Sensitive payload

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "Sensitiveな返信本文",
  "tags": [
    ["k", "1111"]
  ]
}
```

同じ文字の `k` が別 event kind で別の意味を持つ。

- kind `1111` の `k` — NIP-22 が定義する direct parent kind
- kind `36` の `k` — Sensitive payload の Structure event kind

両者は別 event 上に存在するため衝突しない。

## 7. Public Chat の例

### kind 42 Structure event

```json
{
  "id": "<kind42-id>",
  "pubkey": "<author>",
  "kind": 42,
  "content": "",
  "tags": [
    ["e", "<channel-id>", "<relay-hint>", "root"],
    ["content-warning", "reason"],
    ["c", "<kind36-id>", "wss://relay.example.com"]
  ]
}
```

### kind 36 Sensitive payload

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "Sensitiveなチャット本文",
  "tags": [
    ["k", "42"]
  ]
}
```

## 8. Tag placement

「元 kind 固有の tags はすべて Structure event に置く」という単純なルールにはしない。

代わりに、tag の意味に応じて配置を分ける。

### 8.1 Structure event に置くもの

投稿の identity / topology / routing / discovery を成立させるために必要な tag。

例:

- `content-warning`
- `c`
- NIP-22 の `E / K / P / e / k / p`
- Public Chat の channel topology に必要な `e`
- その他、元 kind の event graph 上の意味を成立させるための tag

### 8.2 Sensitive payload に置くもの

payload の `.content` に含まれる本文・URL・添付コンテンツに直接従属する metadata。

代表例は NIP-92 `imeta`。

NIP-92 では `imeta` が event の `.content` に含まれる media URL と対応するため、Sensitive media URL を kind 36 の `.content` へ移す場合、対応する `imeta` も kind 36 側へ置く。

### 8.3 画像付き kind 1 の例

#### Structure event

```json
{
  "id": "<kind1-id>",
  "pubkey": "<author>",
  "kind": 1,
  "content": "",
  "tags": [
    ["content-warning", "reason"],
    ["c", "<kind36-id>", "wss://relay.example.com"]
  ]
}
```

#### Sensitive payload

```json
{
  "id": "<kind36-id>",
  "pubkey": "<author>",
  "kind": 36,
  "content": "猫の写真です\nhttps://cdn.example.com/cat.jpg",
  "tags": [
    ["k", "1"],
    [
      "imeta",
      "url https://cdn.example.com/cat.jpg",
      "m image/jpeg",
      "dim 1920x1080",
      "blurhash <blurhash>",
      "alt 猫の写真",
      "x <sha256>"
    ]
  ]
}
```

この配置により、reveal 前の Structure event から Sensitive media URL、alt、blurhash 等が露出することを避けられる。

### 8.4 その他の tag

`imeta` 以外にも、本文とセットで意味を持つ tag は payload 側に置く方が自然な場合がある。

一方で `t`、`q`、`emoji` 等は discovery / reference / rendering の責務が混在し得るため、一般ルールだけで一律に決めず、各 NIP の semantics と privacy leakage を確認して配置を決める。

## 9. Relay hint と取得

`c` tag の第3要素は kind 36 payload の relay hint とする。

```json
["c", "<kind36-id>", "wss://relay.example.com"]
```

relay hint は payload の取得先候補を示すが、取得成功や event の正当性を保証しない。

Structure event と kind 36 payload は原則として同じ relay 群へ publish するのが望ましい。

ただし relay は2 eventを原子的に保存するわけではないため、次の部分状態は起こり得る。

- Structure event だけ取得できる
- kind 36 payload だけ取得できる

### nostter の現在の取得方針

SnowCait/nostter PR #2680 では read-only 対応として次を採用している。

- payload は Content Warning の `Show` を押すまで取得しない
- relay candidate は `c` の relay hint と Structure event の seen-on relay の和集合
- URL は normalize / deduplicate する
- default read relay は自動追加しない
- relay hint や seen-on relay は authenticity の証明として扱わない
- unavailable result は fail closed
- in-flight request と取得済み payload を feature-local cache で再利用する

これらは有力な reference implementation behavior だが、すべてを protocol の MUST とするかは別途判断する。

## 10. Subscription

### 10.1 Baseline

この方式では Sensitive 対応 client でも既存の Structure kind subscription をそのまま利用できる。

ホームタイムライン:

```json
{"kinds":[1]}
```

Public Chat:

```json
{"kinds":[42]}
```

NIP-22 Comment:

```json
{"kinds":[1111]}
```

client は Structure event を受信し、必要になった時点で `c` が指す kind 36 を event ID で取得できる。

このため、kind 36 の常時購読は baseline 要件ではない。

### 10.2 Optional direct kind 36 subscription

`kind 36` は single-letter `k` tag で Structure kind ごとに Relay filter できる。

ホームタイムライン用 payload:

```json
{"kinds":[36],"#k":["1"]}
```

Public Chat 用 payload:

```json
{"kinds":[36],"#k":["42"]}
```

NIP-22 Comment 用 payload:

```json
{"kinds":[36],"#k":["1111"]}
```

ただし direct kind 36 subscription は optional discovery path と位置付ける。

SnowCait/nostter PR #2680 では direct kind 36 subscription は実装していない。

## 11. kind 36 から Structure event を逆引きする場合

`kind 36` を直接取得しただけでは、本文と Structure kind は分かるが、元 event 固有の topology / metadata は分からない。

例えば:

```json
{
  "kind": 36,
  "content": "Sensitiveな返信本文",
  "tags": [
    ["k", "1111"]
  ]
}
```

からは「Structure event は kind 1111」であることまでは分かるが、root / parent は分からない。

必要であれば、`kind 36` の ID を `c` tag で参照している Structure event を逆引きできる。

```json
{
  "kinds": [1111],
  "#c": ["<kind36-id>"]
}
```

ただしこの reverse lookup は baseline の閲覧経路には必須ではない。

SnowCait/nostter PR #2680 では `#c` reverse lookup を実装していない。

## 12. Canonical identity

本案では Structure event を canonical post とする。

```text
kind 1 / 42 / 1111
= 投稿そのもの
= canonical event ID
= thread / reaction / repost / zap / deletion 等の target

         │
         │ c
         ▼

kind 36
= Sensitive body payload
```

kind 36 を取得して本文を表示しても、表示モデル上の event identity を kind 36 に置き換えない。

SnowCait/nostter PR #2680 もこの方式を採用し、`item.event` を Structure event のまま維持している。

## 13. この案で 3636 は必要か

このモデルでは Sensitive reply でも Structure event は kind 1111 のままであり、NIP-22 topology も kind 1111 側に保持される。

そのため、Sensitive Comment 専用 kind `3636` は原理上不要になる。

```text
Sensitive Text Note:
kind 1    --c--> kind 36 / k=1

Sensitive Public Chat:
kind 42   --c--> kind 36 / k=42

Sensitive NIP-22 Comment:
kind 1111 --c--> kind 36 / k=1111
```

これは現在の `docs/SENSITIVE_CONTENT.md` の `kind 36 / 3636` 方式とは異なる別案である。

## 14. `k` tag を kind 36 で使う理由

当初は `o` や `c` など別の single-letter tag で original kind を表す案も検討した。

しかし、本モデルでは Structure event の `k` と kind 36 の `k` は別 event 上に存在する。

したがって、

```json
["k", "<structure-kind>"]
```

を kind 36 専用 semantics として定義しても、Structure event 上の `k` tag と同一 event 内で衝突しない。

例:

```text
kind 1111:
  k=1
  → direct parent kind

kind 36:
  k=1111
  → payload の Structure event kind
```

tag の意味は event kind ごとに定義できるため、この2つは両立できる。

## 15. Supported Structure kinds

現時点では少なくとも次を候補とする。

- kind 1
- kind 42
- kind 1111

SnowCait/nostter PR #2680 も read-only 対応をこの3 kind に限定している。

「任意の Nostr event をすべて kind 36 payload方式へ変換できる」とは現時点で定義しない。

元 event の `.content` 自体に protocol semantics がある kind では、`.content` を空にすると元 NIP の要件を壊す可能性がある。

例として NIP-25 kind 7 reaction は `.content` に reaction value を持つため、単純に payload 化できるかは別途検討が必要である。

kind 30023 のような addressable event でも、元 kind の address identity は維持できる一方、本文を外部 payload に移すことが NIP-23 client semantics と整合するかは別途検討が必要である。

## 16. Publish order / failure semantics

受信側の設計はかなり整理されたが、送信側の2-event publish semantics は未決定である。

決める必要がある事項:

- kind 36 payload と Structure event のどちらを先に publish するか
- payload publish 成功 / Structure publish 失敗時の扱い
- Structure publish 成功 / payload publish 失敗時の扱い
- retry をどこまで要求するか
- UI上の投稿成功をどの時点で確定するか

これは SnowCait/nostter PR #2680 では対象外であり、nostter の write path は既存 NIP-36 のまま変更されていない。

## 17. 現時点で採用候補の validation rules

protocol を確定する場合、次は採用候補としてかなり強い。

- Structure event は `content-warning` を持つ
- Structure event の `.content` は空
- Structure event の `c` tag はちょうど1つ
- `c[1]` は有効な event ID
- `c[2]` を relay hint として使う場合は有効な `wss://` URL
- payload は参照 ID と一致
- payload kind は36
- Structure / payload の pubkey は一致
- payload の `k` tag はちょうど1つ
- payload の `k` は Structure kind と一致
- validation failure / unavailable は fail closed
- non-empty `.content` の既存 NIP-36 を payload方式より優先

## 18. 現時点の未決定事項

主要な identity / validation はかなり収束した。

引き続き決める必要があるのは主に次。

1. **publish order / failure semantics**
2. **tag placement の詳細**
   - `imeta` は payload 側でほぼ確定
   - `t` / `q` / `emoji` 等をどちらへ置くか
3. **content-warning reason**
   - Structure event のみに置くか
   - kind 36 を direct subscription した client 向けに payload 側にも複製するか
4. **direct kind 36 subscription**
   - optional discovery として仕様化するか
5. **supported Structure kinds**
   - `1 / 42 / 1111` からどこまで広げるか

## 19. Reference implementation: nostter PR #2680

SnowCait/nostter PR #2680 は本設計メモを参照し、read-only 対応を実装している。

主な実装判断:

- 対応 Structure kind は `1 / 42 / 1111`
- `.content === ""` の場合のみ payload方式として解釈
- non-empty `.content` は既存 NIP-36 を優先
- `c` tag はちょうど1つ必要
- relay hint は有効な `wss://` の場合のみ使用
- Structure event を canonical identity として維持
- kind 36 は body payload のみ
- payload は reveal 時に on-demand fetch
- relay candidate は `c` hint ∪ Structure event seen-on relays
- payload ID / kind / pubkey / `k` を検証
- invalid / unavailable は fail closed
- direct kind 36 subscription は未実装
- `#c` reverse lookup は未実装
- write path は変更なし

この実装は protocol の最終仕様そのものではないが、別 client が本方式を自然に実装できることを示す有力な reference となる。

## 20. 参照する既存 NIP

- NIP-01 — Basic protocol flow description
- NIP-22 — Comment
- NIP-23 — Long-form Content
- NIP-25 — Reactions
- NIP-28 — Public Chat
- NIP-36 — Sensitive Content / content-warning
- NIP-92 — Media Attachments Metadata (`imeta`)

本書は上記 NIP の変更を提案するものではなく、Sensitive 本文分離方式の設計検討を整理するためのメモである。
