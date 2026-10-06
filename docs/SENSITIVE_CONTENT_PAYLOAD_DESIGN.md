# Sensitive Content Payload方式 設計メモ

> **Status:** Design discussion / experimental  
> **Relation to existing document:** 本書は `docs/SENSITIVE_CONTENT.md` を置き換えない。現在の `kind 36 / 3636` 仕様とは別案として整理する。

## 1. 目的

NIP-36 の `content-warning` は通常 event の `.content` に本文を保持したまま表示制御を行うため、NIP-36 を解釈しない client では Sensitive 本文が通常本文として表示され得る。

この案では、Sensitive 本文を `kind 36` へ分離し、元の event kind 側には本文を置かない。

狙いは次のとおり。

- Sensitive 非対応 client に本文を露出しない
- 元 event kind の topology / metadata / subscription semantics を維持する
- 対応 client は `kind 36` を直接購読・分類できる
- NIP-22 など既存 NIP の tag semantics を kind 36 側へ無理に移植しない

## 2. 基本モデル

1つの Sensitive 投稿を2 eventで表す。

### 2.1 構造 event

元の event kind をそのまま使う。

- `.content` は空
- 元 kind 固有の tags / topology / metadata はここに置く
- 標準 NIP-36 形式の `content-warning` tag を持つ
- `c` tag で Sensitive 本文を持つ `kind 36` を参照する
- `c` には `kind 36` を取得するための relay hint を付けられる

```json
["c", "<kind36-event-id>", "<relay-hint>"]
```

### 2.2 Sensitive payload

本文は `kind 36` に置く。

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

`kind 36` における `k` tag は、その payload が属する元 event kind を表す。

例:

- `["k", "1"]` — kind 1 Text Note 用
- `["k", "42"]` — kind 42 Public Chat Message 用
- `["k", "1111"]` — kind 1111 NIP-22 Comment 用

元 event 固有の tags は `kind 36` へコピーしない。

## 3. ルート投稿の例

### kind 1 側

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

### kind 36 側

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

## 4. NIP-22 リプライの例

NIP-22 topology はすべて kind 1111 側に保持する。

### kind 1111 側

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

### kind 36 側

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

この構造では同じ文字の `k` が別 event kind で別の意味を持つ。

- kind `1111` の `k` — NIP-22 が定義する direct parent kind
- kind `36` の `k` — Sensitive payload の元 event kind

両者は別 event 上に存在するため衝突しない。

## 5. Public Chat の例

### kind 42 側

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

### kind 36 側

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

## 6. Subscription

### 既存 client

既存 client は従来どおり元 kind を購読できる。

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

Sensitive 非対応 client が構造 event を受信しても `.content` は空であり、Sensitive 本文そのものは露出しない。

### Sensitive 対応 client

`kind 36` は single-letter `k` tag で元 kind ごとに Relay filter できる。

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

## 7. kind 36 から構造 event を復元する

`kind 36` を直接取得しただけでは、本文と元 kind は分かるが、元 event 固有の topology / metadata は分からない。

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

からは「元は kind 1111」であることまでは分かるが、root / parent は分からない。

完全な event semantics を得るには、`kind 36` の id を `c` tag で参照している構造 event を逆引きする。

```json
{
  "kinds": [1111],
  "#c": ["<kind36-id>"]
}
```

したがって `c` tag は、

- 構造 event → kind 36 の参照
- kind 36 → 構造 event の逆引き用 index key

の両方に使える。

## 8. relay hint

`c` tag の第3要素は kind 36 payload の relay hint とする。

```json
["c", "<kind36-id>", "wss://relay.example.com"]
```

構造 event と kind 36 payload は原則として同じ relay 群へ publish するのが望ましいが、relay は2 eventを原子的に保存するわけではない。

そのため、次の部分状態は起こり得る。

- 構造 event だけ取得できる
- kind 36 payload だけ取得できる

relay hint は payload の取得先候補を示すが、取得成功や event の正当性を保証するものではない。

## 9. この案で 3636 は必要か

このモデルでは Sensitive reply でも元 event は kind 1111 のままであり、NIP-22 topology も kind 1111 側に保持される。

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

## 10. `k` tag を kind 36 で使う理由

当初は `o` や `c` など別の single-letter tag で original kind を表す案も検討した。

しかし、このモデルでは元 event 固有の tags を kind 36 へコピーしない。

したがって、

```json
["k", "<original-kind>"]
```

を kind 36 専用 semantics として定義しても、元 event 上の `k` tag と同一 event 内で衝突しない。

例:

```text
kind 1111:
  k=1
  → direct parent kind

kind 36:
  k=1111
  → payload の元 event kind
```

tag の意味は event kind ごとに定義できるため、この2つは両立できる。

## 11. generic wrapper としての範囲

この方式は、少なくとも本文主体の次の kind には自然に適用できる候補である。

- kind 1
- kind 42
- kind 1111

一方、「任意の Nostr event をすべて kind 36 payload 方式へ変換できる」とまでは現時点で定義しない。

元 event の `.content` 自体に protocol semantics がある kind では、`.content` を空にすると元 NIP の要件を壊す可能性がある。

例として NIP-25 kind 7 reaction は `.content` に reaction value を持つため、単純に本文を kind 36 へ移して kind 7 の `.content` を空にする方式が妥当かは別途検討が必要である。

kind 30023 のような addressable event では、元 kind を維持するため addressable identity 自体は保持できるが、本文を外部 payload に移すことが NIP-23 client semantics と整合するかは別途検討が必要である。

## 12. 現時点の未決定事項

この設計を protocol として確定する前に、少なくとも次を決める必要がある。

1. **canonical identity**
   - 元 kind の構造 event を canonical post とするか
   - kind 36 payload を canonical とするか
   - reaction / quote / deletion / reply がどちらを target にするか

2. **publish order / failure semantics**
   - 構造 event と payload のどちらを先に publish するか
   - 片方だけ成功した場合をどう扱うか
   - retry を要求するか

3. **validation**
   - 構造 event と payload の pubkey 一致を必須にするか
   - `c` が指す event は必ず kind 36 でなければならないか
   - kind 36 の `k` と構造 event の kind の一致を必須にするか
   - `k` tag の重複を許すか

4. **content-warning metadata**
   - reason は構造 event だけに置くか
   - kind 36 にも複製するか
   - kind 36 を直接購読した client が reason を取得する方法

5. **direct kind 36 subscription**
   - `kind 36 + #k` を正式な discovery path とするか
   - direct discovery 後の構造 event 逆引きを必須とするか
   - reverse lookup できない場合の表示をどうするか

6. **対象 kind**
   - 最初は `1 / 42 / 1111` のみに限定するか
   - 他 kind を追加するための適合条件を定義するか

## 13. 現時点の設計要約

```text
構造 event
  kind: 元の kind
  content: ""
  tags:
    元 kind 固有の tags / topology
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
```

この分離により、

- 既存 subscription を維持できる
- 非対応 client に Sensitive 本文を露出しない
- kind 36 を `#k` で用途別に購読できる
- NIP-22 等の既存 tag semantics を元 event 側に維持できる
- `3636` を使わず Sensitive Comment を表現できる可能性がある

という構造になる。

## 14. 参照する既存 NIP

- NIP-01 — Basic protocol flow description
- NIP-22 — Comment
- NIP-23 — Long-form Content
- NIP-25 — Reactions
- NIP-28 — Public Chat
- NIP-36 — Sensitive Content / content-warning

本書は上記 NIP の変更を提案するものではなく、Sensitive 本文分離方式の設計検討を整理するためのメモである。
