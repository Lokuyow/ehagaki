import { describe, expect, it } from 'vitest';
import { sharePostHistoryThreadGraphState } from '../../lib/postHistoryThreadGraphStateSharing';

function buildState(overrides: Record<string, unknown> = {}) {
    return {
        anchorEventId: 'anchor',
        parentNode: { eventId: 'parent', relayUrls: ['wss://a.example.com/'], profile: null },
        parentExpansion: { visibleParent: true, loadingParent: false },
        replyNodeStates: [{ node: { eventId: 'reply' }, replyNodeStates: [] }],
        ...overrides,
    };
}

describe('sharePostHistoryThreadGraphState', () => {
    it('前回の値がなければ新しい値を返す', () => {
        const next = buildState();
        expect(sharePostHistoryThreadGraphState(undefined, next)).toBe(next);
    });

    it('内容が同じなら前回のオブジェクトを返す', () => {
        const previous = buildState();
        expect(sharePostHistoryThreadGraphState(previous, buildState())).toBe(previous);
    });

    it('変わった部分だけ新しくし、変わらない部分は前回のものを使う', () => {
        const previous = buildState();
        const next = buildState({ parentExpansion: { visibleParent: false, loadingParent: false } });
        const shared = sharePostHistoryThreadGraphState(previous, next);

        expect(shared).not.toBe(previous);
        expect(shared).toEqual(next);
        expect(shared.parentNode).toBe(previous.parentNode);
        expect(shared.replyNodeStates).toBe(previous.replyNodeStates);
        expect(shared.parentExpansion).toBe(next.parentExpansion);
    });

    it('配列の長さやキーの増減を変化として扱う', () => {
        const previous = buildState();
        const longer = buildState({
            replyNodeStates: [
                { node: { eventId: 'reply' }, replyNodeStates: [] },
                { node: { eventId: 'reply-2' }, replyNodeStates: [] },
            ],
        });
        const shared = sharePostHistoryThreadGraphState(previous, longer);
        expect(shared).toEqual(longer);
        expect(shared.replyNodeStates[0]).toBe(previous.replyNodeStates[0]);

        const withExtraKey = buildState({ relatedEventsStatus: undefined });
        expect(sharePostHistoryThreadGraphState(previous, withExtraKey)).not.toBe(previous);
        expect(sharePostHistoryThreadGraphState(withExtraKey, buildState())).not.toBe(withExtraKey);
    });

    it('引数を書き換えず、プレーンでないオブジェクトは同一性で比べる', () => {
        const previousDate = new Date(0);
        const previous = Object.freeze({ at: previousDate, list: Object.freeze(['a']) });
        const next = Object.freeze({ at: new Date(0), list: Object.freeze(['a']) });
        const shared = sharePostHistoryThreadGraphState(previous, next);

        expect(shared.at).toBe(next.at);
        expect(shared.list).toBe(previous.list);
    });
});
