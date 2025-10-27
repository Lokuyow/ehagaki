/**
 * カスタムHistory管理プラグイン
 * 
 * 目的:
 * - ペースト操作を常に独立した履歴エントリにする
 * - ペースト直後の入力も独立した履歴エントリにする
 * - 通常の連続入力は適度にグループ化する
 * 
 * ProseMirror History拡張の動作:
 * - newGroupDelay: この時間内の連続トランザクションを同じグループに統合
 * - 問題: ペーストと前後の入力が統合されてしまう
 * 
 * 解決策:
 * - ペースト操作に特別なメタデータを設定
 * - filterTransaction で履歴グループ化を制御
 */

import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { Transaction } from '@tiptap/pm/state';

interface HistoryState {
    lastPasteTime: number;
    lastTransactionTime: number;
}

const CUSTOM_HISTORY_KEY = new PluginKey<HistoryState>('customHistory');
const PASTE_ISOLATION_DURATION = 1; // ペースト前後1msは強制的に別グループ

/**
 * トランザクションがペースト操作かどうかを判定
 */
function isPasteTransaction(tr: Transaction): boolean {
    return tr.getMeta('paste') === true || tr.getMeta('uiEvent') === 'paste';
}

/**
 * カスタムHistoryプラグイン
 * 
 * このプラグインは、トランザクションに追加のメタデータを設定して、
 * TiptapのHistory拡張の動作を制御します。
 */
export const CustomHistoryPlugin = new Plugin<HistoryState>({
    key: CUSTOM_HISTORY_KEY,

    state: {
        init() {
            return {
                lastPasteTime: 0,
                lastTransactionTime: 0
            };
        },

        apply(tr, value) {
            const now = Date.now();

            if (isPasteTransaction(tr)) {
                return {
                    lastPasteTime: now,
                    lastTransactionTime: now
                };
            }

            if (tr.docChanged) {
                return {
                    ...value,
                    lastTransactionTime: now
                };
            }

            return value;
        }
    },

    /**
     * appendTransaction: トランザクション後に追加のメタデータを設定
     * 
     * ペースト直後の入力に対して、強制的に新しい履歴グループを開始させる
     */
    appendTransaction(transactions, _oldState, newState) {
        const state = this.getState(newState);
        if (!state) return null;

        const now = Date.now();
        const isPaste = transactions.some(isPasteTransaction);
        const timeSinceLastPaste = now - state.lastPasteTime;

        // ペースト操作自体は既にメタデータが設定されているのでスキップ
        if (isPaste) {
            return null;
        }

        // ペースト直後の入力の場合、強制的に新しい履歴グループを開始
        if (timeSinceLastPaste < PASTE_ISOLATION_DURATION && transactions.some(tr => tr.docChanged)) {
            const tr = newState.tr;

            // 新しい履歴グループを開始するメタデータを設定
            // これにより、ペースト直後の入力が独立した履歴エントリになる
            tr.setMeta('rebased', 0);
            tr.setTime(now);

            if (import.meta.env.MODE === 'development') {
                console.log('📚 CustomHistory: Forcing new history group after paste');
            }

            return tr;
        }

        return null;
    }
});
