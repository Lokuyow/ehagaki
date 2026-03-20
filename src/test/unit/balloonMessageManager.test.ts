import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BalloonMessageManager } from '../../lib/balloonMessageManager';
import {
    BALLOON_MESSAGE_ERROR_KEY,
    BALLOON_MESSAGE_REJECTED_KEY,
    BALLOON_MESSAGE_TIMEOUT_KEY,
    BALLOON_MESSAGE_NETWORK_ERROR_KEY,
    BALLOON_MESSAGE_SUCCESS_KEYS,
    BALLOON_MESSAGE_TIPS_KEYS,
} from '../../lib/constants';

const mockJson = vi.hoisted(() => ({}));
const mockGet = vi.hoisted(() => vi.fn());

vi.mock('svelte-i18n', () => ({
    json: mockJson,
}));

vi.mock('svelte/store', () => ({
    get: mockGet,
}));

describe('BalloonMessageManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // デフォルト: infoメッセージ配列を返す
        mockGet.mockReturnValue((key: string) => {
            if (key === 'balloonMessage.info') return ['Info A', 'Info B'];
            return null;
        });
    });

    describe('getRandomInfoMessage', () => {
        it('候補が2件以上ある場合は同じ文言が連続しない', () => {
            mockGet.mockReturnValue((key: string) => {
                if (key === 'balloonMessage.info') return ['A', 'B', 'C'];
                return null;
            });
            vi.spyOn(Math, 'random').mockReturnValue(0);

            const manager = new BalloonMessageManager((key: string) => key);

            const first = manager.getRandomInfoMessage();
            const second = manager.getRandomInfoMessage();

            expect(first).toBe('A');
            expect(second).toBe('B');
        });

        it('候補が1件のみの場合はその文言を返す', () => {
            mockGet.mockReturnValue((key: string) => {
                if (key === 'balloonMessage.info') return ['A'];
                return null;
            });
            vi.spyOn(Math, 'random').mockReturnValue(0);

            const manager = new BalloonMessageManager((key: string) => key);

            expect(manager.getRandomInfoMessage()).toBe('A');
            expect(manager.getRandomInfoMessage()).toBe('A');
        });

        it('候補が空の場合は空文字を返す', () => {
            mockGet.mockReturnValue((key: string) => {
                if (key === 'balloonMessage.info') return [];
                return null;
            });

            const manager = new BalloonMessageManager((key: string) => key);

            expect(manager.getRandomInfoMessage()).toBe('');
        });
    });

    describe('getRandomSuccessMessage', () => {
        it('SUCCESSキーいずれかの翻訳を返す', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0);
            const manager = new BalloonMessageManager((key: string) => `t:${key}`);
            const result = manager.getRandomSuccessMessage();
            expect(result).toBe(`t:${BALLOON_MESSAGE_SUCCESS_KEYS[0]}`);
        });

        it('返値はSUCCESSキー配列のいずれかに対応する', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            const result = manager.getRandomSuccessMessage();
            expect(BALLOON_MESSAGE_SUCCESS_KEYS).toContain(result);
        });
    });

    describe('getRandomTipsMessage', () => {
        it('TIPSキーの翻訳を返す', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0);
            const manager = new BalloonMessageManager((key: string) => `t:${key}`);
            const result = manager.getRandomTipsMessage();
            expect(result).toBe(`t:${BALLOON_MESSAGE_TIPS_KEYS[0]}`);
        });
    });

    describe('getErrorMessage', () => {
        it('エラーキーの翻訳を返す', () => {
            const manager = new BalloonMessageManager((key: string) => `t:${key}`);
            expect(manager.getErrorMessage()).toBe(`t:${BALLOON_MESSAGE_ERROR_KEY}`);
        });
    });

    describe('createMessage', () => {
        it('指定した型のメッセージオブジェクトを返す', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            const result = manager.createMessage('success');
            expect(result.type).toBe('success');
            expect(result.message).not.toBe('');
        });

        it('500ms以内の連続呼び出しはデバウンスされ空メッセージを返す', () => {
            vi.useFakeTimers();
            try {
                const manager = new BalloonMessageManager((key: string) => key);
                manager.createMessage('success');
                const debounced = manager.createMessage('success');
                expect(debounced.message).toBe('');
            } finally {
                vi.useRealTimers();
            }
        });

        it('500ms経過後は新しいメッセージを生成できる', () => {
            vi.useFakeTimers();
            try {
                const manager = new BalloonMessageManager((key: string) => key);
                manager.createMessage('success');
                vi.advanceTimersByTime(600);
                const result = manager.createMessage('success');
                expect(result.message).not.toBe('');
            } finally {
                vi.useRealTimers();
            }
        });

        it('skipDebounce=trueはデバウンスをバイパスする', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            manager.createMessage('success'); // first call sets timestamp
            const result = manager.createMessage('success', undefined, true);
            expect(result.message).not.toBe('');
        });

        it('typeがerrorの場合はエラーメッセージを返す', () => {
            const manager = new BalloonMessageManager((key: string) => `[${key}]`);
            const result = manager.createMessage('error');
            expect(result.type).toBe('error');
            expect(result.message).toBe(`[${BALLOON_MESSAGE_ERROR_KEY}]`);
        });

        it('typeがtipsの場合はtipsメッセージを返す', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0);
            const manager = new BalloonMessageManager((key: string) => `t:${key}`);
            const result = manager.createMessage('tips');
            expect(result.type).toBe('tips');
            expect(result.message).toBe(`t:${BALLOON_MESSAGE_TIPS_KEYS[0]}`);
        });
    });

    describe('createMessageImmediate', () => {
        it('デバウンス中でもメッセージを生成する', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            manager.createMessage('success');
            const result = manager.createMessageImmediate('success');
            expect(result.message).not.toBe('');
        });
    });

    describe('createErrorMessage', () => {
        let manager: BalloonMessageManager;
        beforeEach(() => {
            manager = new BalloonMessageManager((key: string) => `t:${key}`);
        });

        it('post_timeoutはwarning型を返す', () => {
            const result = manager.createErrorMessage('post_timeout');
            expect(result.type).toBe('warning');
            expect(result.message).toBe(`t:${BALLOON_MESSAGE_TIMEOUT_KEY}`);
        });

        it('post_rejectedはerror型を返す', () => {
            const result = manager.createErrorMessage('post_rejected');
            expect(result.type).toBe('error');
            expect(result.message).toBe(`t:${BALLOON_MESSAGE_REJECTED_KEY}`);
        });

        it('post_network_errorはerror型を返す', () => {
            const result = manager.createErrorMessage('post_network_error');
            expect(result.type).toBe('error');
            expect(result.message).toBe(`t:${BALLOON_MESSAGE_NETWORK_ERROR_KEY}`);
        });

        it('その他のエラー種別はデフォルトerror型を返す', () => {
            const result = manager.createErrorMessage('unknown_error');
            expect(result.type).toBe('error');
            expect(result.message).toBe(`t:${BALLOON_MESSAGE_ERROR_KEY}`);
        });

        it('空文字列もデフォルトerror型を返す', () => {
            const result = manager.createErrorMessage('');
            expect(result.type).toBe('error');
        });
    });

    describe('scheduleHide', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('指定時間後にコールバックを呼び出す', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            const callback = vi.fn();
            manager.scheduleHide(callback, 3000);
            expect(callback).not.toHaveBeenCalled();
            vi.advanceTimersByTime(3000);
            expect(callback).toHaveBeenCalledOnce();
        });

        it('再スケジュール時は前のタイムアウトをキャンセルする', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            const callback1 = vi.fn();
            const callback2 = vi.fn();
            manager.scheduleHide(callback1, 3000);
            manager.scheduleHide(callback2, 3000);
            vi.advanceTimersByTime(3000);
            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalledOnce();
        });

        it('デフォルト遅延3000msで動作する', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            const callback = vi.fn();
            manager.scheduleHide(callback);
            vi.advanceTimersByTime(2999);
            expect(callback).not.toHaveBeenCalled();
            vi.advanceTimersByTime(1);
            expect(callback).toHaveBeenCalledOnce();
        });
    });

    describe('cancelScheduledHide', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('スケジュール済みコールバックをキャンセルする', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            const callback = vi.fn();
            manager.scheduleHide(callback, 3000);
            manager.cancelScheduledHide();
            vi.advanceTimersByTime(3000);
            expect(callback).not.toHaveBeenCalled();
        });

        it('スケジュールなしで呼び出してもエラーにならない', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            expect(() => manager.cancelScheduledHide()).not.toThrow();
        });
    });

    describe('dispose', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('スケジュールされたコールバックをキャンセルする', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            const callback = vi.fn();
            manager.scheduleHide(callback, 3000);
            manager.dispose();
            vi.advanceTimersByTime(3000);
            expect(callback).not.toHaveBeenCalled();
        });

        it('dispose後にcreateMessageを呼んでもエラーにならない', () => {
            const manager = new BalloonMessageManager((key: string) => key);
            manager.dispose();
            expect(() => manager.createMessage('success')).not.toThrow();
        });
    });

    describe('getTimePeriod', () => {
        it('5〜10時はmorningを返す', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0));
            const manager = new BalloonMessageManager((key: string) => key);
            expect(manager.getTimePeriod()).toBe('morning');
            vi.useRealTimers();
        });

        it('11〜15時はafternoonを返す', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 14, 0, 0));
            const manager = new BalloonMessageManager((key: string) => key);
            expect(manager.getTimePeriod()).toBe('afternoon');
            vi.useRealTimers();
        });

        it('16〜19時はeveningを返す', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 17, 0, 0));
            const manager = new BalloonMessageManager((key: string) => key);
            expect(manager.getTimePeriod()).toBe('evening');
            vi.useRealTimers();
        });

        it('20〜23時はnightを返す', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 21, 0, 0));
            const manager = new BalloonMessageManager((key: string) => key);
            expect(manager.getTimePeriod()).toBe('night');
            vi.useRealTimers();
        });

        it('0〜4時はmidnightを返す', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 2, 0, 0));
            const manager = new BalloonMessageManager((key: string) => key);
            expect(manager.getTimePeriod()).toBe('midnight');
            vi.useRealTimers();
        });

        it('境界値: 5時はmorning', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 5, 0, 0));
            const manager = new BalloonMessageManager((key: string) => key);
            expect(manager.getTimePeriod()).toBe('morning');
            vi.useRealTimers();
        });

        it('境界値: 4時はmidnight', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 4, 59, 59));
            const manager = new BalloonMessageManager((key: string) => key);
            expect(manager.getTimePeriod()).toBe('midnight');
            vi.useRealTimers();
        });
    });

    describe('getRandomInfoMessage (時間帯メッセージ対応)', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('Math.random < 0.3 かつ時間帯メッセージがある場合は時間帯メッセージプールから選択', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0)); // morning
            mockGet.mockReturnValue((key: string) => {
                if (key === 'balloonMessage.info') return ['InfoA', 'InfoB'];
                if (key === 'balloonMessage.infoByTime.morning') return ['Morning1', 'Morning2'];
                return null;
            });
            vi.spyOn(Math, 'random').mockReturnValue(0.1); // < 0.3 → 時間帯を使う

            const manager = new BalloonMessageManager((key: string) => key);
            const result = manager.getRandomInfoMessage();
            expect(['Morning1', 'Morning2']).toContain(result);
        });

        it('Math.random >= 0.3 の場合は通常infoプールから選択', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0)); // morning
            mockGet.mockReturnValue((key: string) => {
                if (key === 'balloonMessage.info') return ['InfoA', 'InfoB'];
                if (key === 'balloonMessage.infoByTime.morning') return ['Morning1'];
                return null;
            });
            vi.spyOn(Math, 'random').mockReturnValue(0.8); // >= 0.3 → 通常infoを使う

            const manager = new BalloonMessageManager((key: string) => key);
            const result = manager.getRandomInfoMessage();
            expect(['InfoA', 'InfoB']).toContain(result);
        });

        it('時間帯メッセージが空の場合は通常infoにフォールバック', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0)); // morning
            mockGet.mockReturnValue((key: string) => {
                if (key === 'balloonMessage.info') return ['InfoA', 'InfoB'];
                if (key === 'balloonMessage.infoByTime.morning') return [];
                return null;
            });
            vi.spyOn(Math, 'random').mockReturnValue(0.1); // < 0.3 だが時間帯が空 → フォールバック

            const manager = new BalloonMessageManager((key: string) => key);
            const result = manager.getRandomInfoMessage();
            expect(['InfoA', 'InfoB']).toContain(result);
        });

        it('時間帯メッセージがnull/undefinedの場合は通常infoにフォールバック', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0)); // morning
            mockGet.mockReturnValue((key: string) => {
                if (key === 'balloonMessage.info') return ['InfoA'];
                return null; // infoByTime.morning → null
            });
            vi.spyOn(Math, 'random').mockReturnValue(0.1);

            const manager = new BalloonMessageManager((key: string) => key);
            const result = manager.getRandomInfoMessage();
            expect(result).toBe('InfoA');
        });

        it('時間帯メッセージプール内でも直前と同じメッセージは連続しない', () => {
            vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0)); // morning
            mockGet.mockReturnValue((key: string) => {
                if (key === 'balloonMessage.info') return ['InfoA', 'InfoB'];
                if (key === 'balloonMessage.infoByTime.morning') return ['M1', 'M2', 'M3'];
                return null;
            });
            // 常に時間帯プールを使う
            vi.spyOn(Math, 'random').mockReturnValue(0.1);

            const manager = new BalloonMessageManager((key: string) => key);
            const first = manager.getRandomInfoMessage();
            // Math.random=0.1: pool=['M1','M2','M3'], index=0 → 'M1'
            // 2回目: lastInfoMessage='M1', filtered=['M2','M3'], index=0 → 'M2'
            const second = manager.getRandomInfoMessage();
            expect(first).not.toBe(second);
        });
    });
});
