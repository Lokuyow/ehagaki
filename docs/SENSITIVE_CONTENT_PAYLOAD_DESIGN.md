# Sensitive Content Payload方式 設計メモ

> **Status:** Implementation target / experimental  
> **Scope:** eHagaki PR #284 で検証中の fail-closed Content Warning 形式  
> **Reference implementation:** SnowCait/nostter PR #2680 が本方式の read-only 対応を実装している。  
> **Relation to previous branch design:** 本書は、PR #284 内で先に実装された `kind 36 / 3636` canonical event + kind 1 companion 方式を置き換える設計とする。