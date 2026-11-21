import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isListEdgeInPrefetchRegion } from '../../lib/listEdgeObserver';

import {
    observePostHistoryAutoLoadSentinel,
    type ObservePostHistoryAutoLoadSentinelOptions,
    type PostHistoryAutoLoadDirection,
} from '../../lib/postHistoryAutoLoadSentinelObserver';

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    readonly disconnect = vi.fn();
    readonly observe = vi.fn();
    readonly rootMargin: string;

    constructor(
        private readonly callback: IntersectionObserverCallback,
        options: IntersectionObserverInit = {},
    ) {
        this.rootMargin = options.rootMargin ?? '0px';
        MockIntersectionObserver.instances.push(this);
    }

    trigger(target: Element, intersections: boolean[]): void {
        this.callback(
            intersections.map((isIntersecting) => ({ target, isIntersecting } as IntersectionObserverEntry)),
            this as unknown as IntersectionObserver,
        );
    }
}

const ROOT_HEIGHT = 100;
const ROOT_RECT = { left: 0, right: 100, top: 0, bottom: 100, width: 100, height: 100 };

function rect(top: number, bottom: number) {
    return { left: 0, right: 100, top, bottom, width: 100, height: bottom - top };
}

function createElements(sentinelTop: number) {
    const root = document.createElement('div');
    const sentinel = document.createElement('div');
    let sentinelRect = rect(sentinelTop, sentinelTop + 1);
    root.getBoundingClientRect = () => ROOT_RECT as DOMRect;
    sentinel.getBoundingClientRect = () => sentinelRect as DOMRect;
    return {
        root,
        sentinel,
        moveSentinel(top: number) {
            sentinelRect = rect(top, top + 1);
        },
        scrollTo(scrollTop: number) {
            root.scrollTop = scrollTop;
            root.dispatchEvent(new Event('scroll'));
        },
    };
}

function createFlags() {
    return {
        loading: false,
        awaitingExit: false,
        intersecting: false,
        canLoad: true,
    };
}

function observe(
    direction: PostHistoryAutoLoadDirection,
    elements: ReturnType<typeof createElements>,
    flags: ReturnType<typeof createFlags>,
    overrides: Partial<ObservePostHistoryAutoLoadSentinelOptions> = {},
) {
    const load = vi.fn();
    const observation = observePostHistoryAutoLoadSentinel({
        direction,
        root: elements.root,
        sentinel: elements.sentinel,
        rootHeight: ROOT_HEIGHT,
        resizeGeneration: 0,
        previousContext: null,
        isAutoLoading: () => flags.loading,
        isAwaitingExit: () => flags.awaitingExit,
        clearAwaitingExit: () => {
            flags.awaitingExit = false;
        },
        setSentinelIntersecting: (value) => {
            flags.intersecting = value;
        },
        canAutoLoad: () => flags.canLoad,
        load,
        ...overrides,
    });
    const observer = MockIntersectionObserver.instances.at(-1)!;
    return { observation, observer, load };
}

describe('postHistoryAutoLoadSentinelObserver', () => {
    beforeEach(() => {
        MockIntersectionObserver.instances = [];
        vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('先読み範囲は方向ごとに、表示領域の高さ 2 つ分だけ外側へ広がる', () => {
        expect(isListEdgeInPrefetchRegion('bottom', ROOT_RECT, rect(300, 301), 200)).toBe(true);
        expect(isListEdgeInPrefetchRegion('bottom', ROOT_RECT, rect(301, 302), 200)).toBe(false);
        expect(isListEdgeInPrefetchRegion('bottom', ROOT_RECT, rect(-10, -1), 200)).toBe(false);
        expect(isListEdgeInPrefetchRegion('top', ROOT_RECT, rect(-201, -200), 200)).toBe(true);
        expect(isListEdgeInPrefetchRegion('top', ROOT_RECT, rect(-202, -201), 200)).toBe(false);
        expect(isListEdgeInPrefetchRegion('top', ROOT_RECT, rect(101, 102), 200)).toBe(false);
        const older = observe('older', createElements(300), createFlags());
        const newer = observe('newer', createElements(-201), createFlags());
        expect(older.observer.rootMargin).toBe('0px 0px 200px 0px');
        expect(newer.observer.rootMargin).toBe('200px 0px 0px 0px');
        older.observation.dispose();
        newer.observation.dispose();
    });

    it('交差したら読み込み、離れたら交差状態と exit 待ちを解く', () => {
        const elements = createElements(150);
        const flags = createFlags();
        const { observer, load } = observe('older', elements, flags);

        observer.trigger(elements.sentinel, [true]);
        expect(load).toHaveBeenCalledTimes(1);
        expect(flags.intersecting).toBe(true);

        flags.awaitingExit = true;
        elements.moveSentinel(500);
        observer.trigger(elements.sentinel, [false]);
        expect(flags.intersecting).toBe(false);
        expect(flags.awaitingExit).toBe(false);
    });

    it('すでに範囲へ戻った sentinel の古い exit 通知は無視する', () => {
        const elements = createElements(150);
        const flags = createFlags();
        flags.intersecting = true;
        flags.awaitingExit = true;
        const { observer } = observe('older', elements, flags);

        observer.trigger(elements.sentinel, [false]);

        expect(flags.intersecting).toBe(true);
        expect(flags.awaitingExit).toBe(true);
    });

    it('読み込み中の接近は覚えておき、読み込み後にまだ範囲内なら再要求する', () => {
        const elements = createElements(150);
        const flags = createFlags();
        flags.loading = true;
        const { observation, observer, load } = observe('older', elements, flags);

        observer.trigger(elements.sentinel, [true]);
        expect(load).not.toHaveBeenCalled();

        flags.loading = false;
        observation.context.resumeAfterLoad();
        expect(load).toHaveBeenCalledTimes(1);
    });

    it('exit 待ちのとき、older は読み込み中の接近を覚え、newer は覚えない', () => {
        for (const [direction, sentinelTop, expectedLoads] of [
            ['older', 150, 1],
            ['newer', -150, 0],
        ] as const) {
            const elements = createElements(sentinelTop);
            const flags = createFlags();
            flags.loading = true;
            flags.awaitingExit = true;
            const { observation, observer, load } = observe(direction, elements, flags);

            observer.trigger(elements.sentinel, [true]);
            flags.loading = false;
            flags.awaitingExit = false;
            observation.context.resumeAfterLoad();

            expect(load).toHaveBeenCalledTimes(expectedLoads);
        }
    });

    it('スクロールは対象の方向へ動いたときだけ読み込みを要求する', () => {
        const elements = createElements(-150);
        const flags = createFlags();
        elements.root.scrollTop = 500;
        const { load } = observe('newer', elements, flags);

        elements.scrollTo(600);
        expect(load).not.toHaveBeenCalled();

        elements.scrollTo(400);
        expect(load).toHaveBeenCalledTimes(1);
        expect(flags.intersecting).toBe(true);
    });

    it('下向きのスクロールは早めに一度だけ読み込み、通常の範囲外に追加できたら再開する', () => {
        const elements = createElements(601);
        const flags = createFlags();
        const { observation, observer, load } = observe('older', elements, flags);
        observer.trigger(elements.sentinel, [false]);
        elements.scrollTo(100);
        expect(load).not.toHaveBeenCalled();

        elements.moveSentinel(400);
        elements.scrollTo(100);
        elements.scrollTo(50);
        expect(load).not.toHaveBeenCalled();
        elements.scrollTo(100);
        expect(load).toHaveBeenCalledTimes(1);

        flags.loading = true;
        flags.awaitingExit = true;
        elements.scrollTo(110);
        expect(load).toHaveBeenCalledTimes(1);
        elements.moveSentinel(480);
        observation.context.reconcileAfterCommit();
        flags.loading = false;
        observation.context.resumeAfterLoad();
        expect(flags.awaitingExit).toBe(false);
        expect(load).toHaveBeenCalledTimes(1);

        elements.scrollTo(120);
        expect(load).toHaveBeenCalledTimes(2);
    });

    it('リサイズで作り直したとき、戻る方向へスクロールしていなければ最初の交差を保留する', () => {
        const elements = createElements(150);
        const flags = createFlags();
        elements.root.scrollTop = 300;
        const first = observe('older', elements, flags);
        first.observation.dispose();

        const { observer, load } = observe('older', elements, flags, {
            resizeGeneration: 1,
            previousContext: first.observation.context,
        });
        observer.trigger(elements.sentinel, [true]);
        expect(load).not.toHaveBeenCalled();

        elements.scrollTo(320);
        expect(load).toHaveBeenCalledTimes(1);
    });

    it('窓の入れ替え後も範囲内なら、交差の変化を待たずに次を要求する', () => {
        const elements = createElements(150);
        const flags = createFlags();
        const { observation, observer, load } = observe('older', elements, flags);

        observation.context.reconcileAfterWindowChange();
        expect(load).not.toHaveBeenCalled();

        observer.trigger(elements.sentinel, [true]);
        expect(load).toHaveBeenCalledTimes(1);
        observation.context.reconcileAfterWindowChange();
        expect(load).toHaveBeenCalledTimes(2);
    });

    it('dispose 後は通知とスクロールに反応せず、observer を切断する', () => {
        const elements = createElements(150);
        const flags = createFlags();
        const { observation, observer, load } = observe('older', elements, flags);

        observation.dispose();
        observer.trigger(elements.sentinel, [true]);
        elements.scrollTo(100);

        expect(load).not.toHaveBeenCalled();
        expect(observer.disconnect).toHaveBeenCalledTimes(1);
    });
});
