import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BalloonMessageManager } from '../../lib/balloonMessageManager';

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
});
