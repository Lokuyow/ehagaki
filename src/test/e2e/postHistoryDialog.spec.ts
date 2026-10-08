import { expect, test, type Download, type Locator, type Page, type Route } from '@playwright/test';

type HarnessState = {
    ready: boolean;
    totalPosts: number;
    matchingPosts: number;
    jumpDate: string;
    initialMonthLabel: string;
    scrollTargetContent: string;
    scrollTargetMonthLabel: string;
    reactionPostEventId: string;
    plainPostEventId: string;
    scrolledReactionPostEventId: string;
    scrolledPlainPostEventId: string;
    quotePostEventId: string;
    quoteEventId: string;
    quoteContent: string;
    matchingSensitiveQuoteUri: string;
    unmatchedSensitiveQuoteUri: string;
    linkTargetUrl: string;
    linkPostEventId: string;
    replyParentEventId: string;
    replyContent: string;
    replyEventId: string;
    grandchildEventId: string;
    threadParentPostEventId: string;
    importPostContent: string;
    importEventJsonl: string;
    sparseVisiblePostContent: string;
    sparseStoredPostContent: string;
    sparseStoredPostEventId: string;
    absoluteOldestPostContent: string;
    infiniteScrollEventIds: string[];
    infiniteScrollOldestPostContent: string;
    layoutStabilityPostEventId: string;
    layoutImageUrl: string;
    layoutVideoUrl: string;
    layoutEmojiSuccessUrl: string;
    layoutEmojiFailureUrl: string;
};

type HarnessWindow = Window & typeof globalThis & {
    __POST_HISTORY_COVERAGE__?: { owner: string; eventIds: string[]; headRequests: number;
        olderRequests: { relayUrl: string; since: number; until: number }[]; release: () => void };
    __POST_HISTORY_HARNESS__?: HarnessState;
    __POST_HISTORY_ACTION_TARGETS__?: {
        replyEventId: string | null;
        quoteEventId: string | null;
        replyShouldReturnFalse: boolean;
    };
    __POST_HISTORY_SCROLL_LOAD_GATE__?: {
        direction: 'older' | 'newer' | null;
        entered: boolean;
        release: (() => void) | null;
    };
    __POST_HISTORY_INTERACTION_LOAD_GATE__?: {
        entered: boolean;
        release: (() => void) | null;
    };
    __POST_HISTORY_REACTION_TEST_CONTROL__?: {
        addReactionToQuote: () => Promise<void>;
    };
    __POST_HISTORY_SEARCH_SCAN_GATE__?: {
        entered: boolean;
        reads: number;
        finished: boolean;
        release: (() => void) | null;
    };
};

async function gotoHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function expectContentWarningLayout(container: Locator): Promise<void> {
    const prompt = container.locator('.content-warning-prompt');
    await expect(prompt).toBeVisible();
    const layout = await prompt.evaluate((element) => {
        const button = element.querySelector<HTMLElement>('.content-warning-reveal-button');
        const reason = element.querySelector<HTMLElement>('.content-warning-copy span');
        const card = element.closest<HTMLElement>(
            '.post-history-related-card, .post-history-item, .target-preview, .reply-quote-preview',
        ) ?? element.parentElement;
        if (!button || !card) throw new Error('Missing Content Warning layout elements');
        const rect = (node: Element) => {
            const { left, right, top, bottom, width, height } = node.getBoundingClientRect();
            return { left, right, top, bottom, width, height };
        };
        return {
            card: rect(card),
            prompt: rect(element),
            button: rect(button),
            reason: reason ? {
                textLength: reason.textContent?.length ?? 0,
                scrollWidth: reason.scrollWidth,
                clientWidth: reason.clientWidth,
                lineCount: (() => {
                    const range = document.createRange();
                    range.selectNodeContents(reason);
                    return range.getClientRects().length;
                })(),
            } : null,
            overflow: [element.closest('.post-content-preview'), element, button]
                .filter((node): node is HTMLElement => node instanceof HTMLElement)
                .map((node) => ({
                    scrollWidth: node.scrollWidth,
                    clientWidth: node.clientWidth,
                })),
        };
    });
    expect(layout.prompt.left).toBeGreaterThanOrEqual(layout.card.left - 1);
    expect(layout.prompt.right).toBeLessThanOrEqual(layout.card.right + 1);
    expect(layout.button.left).toBeGreaterThanOrEqual(layout.prompt.left - 1);
    expect(layout.button.right).toBeLessThanOrEqual(layout.prompt.right + 1);
    expect(layout.button.top).toBeGreaterThanOrEqual(layout.prompt.top - 1);
    expect(layout.button.bottom).toBeLessThanOrEqual(layout.prompt.bottom + 1);
    expect(layout.button.height).toBeLessThan(layout.prompt.height);
    expect(layout.button.height).toBeGreaterThanOrEqual(40);
    for (const width of layout.overflow) {
        expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth + 1);
    }
    if (layout.reason) {
        expect(layout.reason.scrollWidth).toBeLessThanOrEqual(layout.reason.clientWidth + 1);
        if (layout.reason.textLength > 40) {
            expect(layout.reason.lineCount).toBeGreaterThan(1);
        }
    }
}

async function gotoLayoutStabilityHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html?layout-stability=1');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function gateResponseRoute(
    page: Page,
    url: string,
    complete: (route: Route) => Promise<void>,
): Promise<{ requested: Promise<void>; completed: Promise<void>; release: () => void }> {
    let notifyRequested!: () => void;
    let notifyCompleted!: () => void;
    let releaseResponse!: () => void;
    const requested = new Promise<void>((resolve) => {
        notifyRequested = resolve;
    });
    const completed = new Promise<void>((resolve) => {
        notifyCompleted = resolve;
    });
    const responseGate = new Promise<void>((resolve) => {
        releaseResponse = resolve;
    });
    await page.route(url, async (route) => {
        notifyRequested();
        await responseGate;
        await complete(route);
        notifyCompleted();
    });
    return { requested, completed, release: () => releaseResponse() };
}

async function gotoSparseHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html?sparse=1');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function gotoSparseOldestHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html?sparse-oldest=1');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function gotoInfiniteScrollHarness(
    page: Page,
    options: { fixContainerHeight?: boolean; longPreviews?: boolean } = {},
) {
    await page.goto(
        `post-history-dialog-playwright.html?infinite-scroll=1${options.longPreviews ? '&long-preview=1' : ''}`,
    );
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    if (options.fixContainerHeight !== false) {
        await page.locator('.post-history-container').evaluate((element) => {
            const container = element as HTMLDivElement;
            container.style.height = `${container.clientHeight}px`;
        });
    }
    await waitForHistoryContainerHeightToSettle(page);
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function installInitialHistoryResizeScroll(page: Page): Promise<void> {
    await page.addInitScript(() => {
        const state = {
            recreated: false,
        };
        (window as Window & {
            __POST_HISTORY_RESIZE_SCROLL_STATE__?: typeof state;
        }).__POST_HISTORY_RESIZE_SCROLL_STATE__ = state;

        const NativeIntersectionObserver = window.IntersectionObserver;
        const observerCounts = new WeakMap<Element, number>();
        const observerRoots = new WeakMap<IntersectionObserver, Element | null>();
        window.IntersectionObserver = class extends NativeIntersectionObserver {
            constructor(
                callback: IntersectionObserverCallback,
                options?: IntersectionObserverInit,
            ) {
                const root = options?.root;
                const isOlderHistoryObserver =
                    root instanceof HTMLElement
                    && root.classList.contains("post-history-container")
                    && options?.rootMargin?.startsWith("0px 0px ");
                super(callback, options);
                if (!isOlderHistoryObserver || !(root instanceof HTMLElement)) {
                    return;
                }

                observerRoots.set(this, root);
                const count = (observerCounts.get(root) ?? 0) + 1;
                observerCounts.set(root, count);
                if (count === 2) {
                    state.recreated = true;
                    queueMicrotask(() => {
                        root.scrollTop = root.scrollHeight;
                        root.dispatchEvent(new Event("scroll", { bubbles: true }));
                    });
                }
            }

            observe(target: Element): void {
                const root = observerRoots.get(this) ?? null;
                const isOlderHistoryObserver =
                    root instanceof HTMLElement
                    && root.classList.contains("post-history-container");
                if (isOlderHistoryObserver) {
                    const count = observerCounts.get(root) ?? 0;
                    if (count === 1) {
                        const nextHeight = root.clientHeight + 20;
                        root.style.flex = "0 0 auto";
                        root.style.height = `${nextHeight}px`;
                    }
                }
                super.observe(target);
            }
        };
    });
}

async function armScrollLoadGate(page: Page, direction: 'older' | 'newer') {
    await page.evaluate((loadDirection) => {
        const gate = (window as HarnessWindow).__POST_HISTORY_SCROLL_LOAD_GATE__;
        if (!gate) {
            throw new Error('Post history scroll load gate is unavailable');
        }
        gate.direction = loadDirection;
        gate.entered = false;
        gate.release = null;
    }, direction);
}

async function waitForScrollLoadGate(page: Page) {
    await expect.poll(() => page.evaluate(() =>
        (window as HarnessWindow).__POST_HISTORY_SCROLL_LOAD_GATE__?.entered ?? false,
    )).toBe(true);
}

async function releaseScrollLoadGate(page: Page) {
    await page.evaluate(() => {
        const gate = (window as HarnessWindow).__POST_HISTORY_SCROLL_LOAD_GATE__;
        gate?.release?.();
    });
}

async function gotoExportHarness(page: Page) {
    await page.goto('post-history-dialog-playwright.html?export=1');
    await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
    return page.evaluate<HarnessState>(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState);
}

async function readDownload(download: Download): Promise<string> {
    const stream = await download.createReadStream();
    if (!stream) {
        return '';
    }
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf-8');
}

async function readExportVerificationStates(page: Page): Promise<Array<{
    status?: string;
    ruleVersion?: number;
}>> {
    return page.evaluate(async () => {
        const openRequest = indexedDB.open('eHagakiDB');
        const database = await new Promise<IDBDatabase>((resolve, reject) => {
            openRequest.onsuccess = () => resolve(openRequest.result);
            openRequest.onerror = () => reject(openRequest.error);
        });
        try {
            const transaction = database.transaction(
                ['postHistory', 'postHistoryDeletionRequests'],
                'readonly',
            );
            const getAll = (storeName: string) => new Promise<any[]>((resolve, reject) => {
                const request = transaction.objectStore(storeName).getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            const [posts, deletions] = await Promise.all([
                getAll('postHistory'),
                getAll('postHistoryDeletionRequests'),
            ]);
            return [...posts, ...deletions].map((record) => record.rawEventVerification);
        } finally {
            database.close();
        }
    });
}

async function expectSummary(page: Page, total: number) {
    const summary = page.locator('.post-history-summary-count');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText(`${total}件`);
}

async function expectCurrentMonthLabel(page: Page, label: string) {
    await expect(page.locator('.post-history-current-month')).toHaveText(label);
}

async function scrollPostIntoView(page: Page, content: string) {
    await page.getByText(content, { exact: true }).evaluate((element) => {
        element.closest('.post-history-item')?.scrollIntoView({ block: 'start' });
    });
}

async function scrollPostIntoViewByEventId(page: Page, eventId: string) {
    await page.locator(`.post-history-item[data-post-history-event-id="${eventId}"]`).evaluate((element) => {
        (element as HTMLElement).scrollIntoView({ block: 'start' });
    });
}

async function jumpToDate(page: Page, date: string) {
    const [year, month, day] = date.split('-');
    await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
    await page.getByRole('menuitem', { name: '日付へ移動' }).click();
    await expect(page.locator('.post-history-date-picker-input')).toBeVisible();
    const yearSegment = page.locator('.post-history-date-picker-segment[data-segment="year"]');
    const monthSegment = page.locator('.post-history-date-picker-segment[data-segment="month"]');
    const daySegment = page.locator('.post-history-date-picker-segment[data-segment="day"]');

    await yearSegment.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type(String(Number(year)));
    await monthSegment.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type(String(Number(month)));
    await daySegment.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type(String(Number(day)));
    await page.getByRole('button', { name: 'この日付付近を表示' }).click();
}

async function expectVisiblePostCount(page: Page, count: number) {
    await expect(page.locator('.post-history-list li')).toHaveCount(count);
}

async function scrollHistoryToBottom(page: Page) {
    await page.locator('.post-history-container').evaluate((element) => {
        const container = element as HTMLDivElement;
        container.scrollTop = container.scrollHeight;
        container.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
}

async function scrollHistoryToTop(page: Page) {
    await page.locator('.post-history-container').evaluate((element) => {
        const container = element as HTMLDivElement;
        container.scrollTop = 0;
        container.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
}

async function scrollHistoryNearBottom(page: Page) {
    return page.locator('.post-history-container').evaluate((element) => {
        const container = element as HTMLDivElement;
        const remaining = Math.max(
            1,
            Math.min(
                container.clientHeight * 2 - 24,
                container.scrollHeight - container.clientHeight,
            ),
        );
        container.scrollTop =
            container.scrollHeight - container.clientHeight - remaining;
        container.dispatchEvent(new Event('scroll', { bubbles: true }));
        return { remaining, clientHeight: container.clientHeight };
    });
}

async function scrollHistoryNearTopAndCaptureAnchor(page: Page) {
    return page.locator('.post-history-container').evaluate((element) => {
        const container = element as HTMLDivElement;
        container.scrollTop = Math.min(
            container.clientHeight * 2 - 24,
            container.scrollHeight - container.clientHeight,
        );
        container.dispatchEvent(new Event('scroll', { bubbles: true }));

        const containerRect = container.getBoundingClientRect();
        const item = Array.from(
            container.querySelectorAll<HTMLElement>('.post-history-item'),
        ).find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            return rect.bottom > containerRect.top + 1 && rect.top < containerRect.bottom - 1;
        });

        return {
            topOffset: container.scrollTop,
            clientHeight: container.clientHeight,
            anchor: item
                ? {
                      eventId: item.dataset.postHistoryEventId ?? '',
                      offsetTop: item.getBoundingClientRect().top - containerRect.top,
                  }
                : null,
        };
    });
}

async function scrollHistoryAwayFromTop(page: Page) {
    await page.locator('.post-history-container').evaluate((element) => {
        const container = element as HTMLDivElement;
        container.scrollTop = Math.min(
            container.clientHeight * 3 + 64,
            container.scrollHeight - container.clientHeight,
        );
        container.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
}

async function scrollHistoryAwayFromBottom(page: Page) {
    await page.locator('.post-history-container').evaluate((element) => {
        const container = element as HTMLDivElement;
        const remaining = Math.min(
            container.clientHeight * 3 + 64,
            container.scrollHeight - container.clientHeight,
        );
        container.scrollTop = container.scrollHeight - container.clientHeight - remaining;
        container.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
}

async function waitForHistoryContainerHeightToSettle(page: Page) {
    await page.locator('.post-history-container').evaluate(async (element) => {
        const container = element as HTMLDivElement;
        let lastHeight = container.clientHeight;
        let stableFrames = 0;

        for (let frame = 0; frame < 60 && stableFrames < 8; frame += 1) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            const nextHeight = container.clientHeight;
            stableFrames = nextHeight === lastHeight ? stableFrames + 1 : 0;
            lastHeight = nextHeight;
        }
    });
}

async function historyEventIds(page: Page): Promise<string[]> {
    return page.locator('.post-history-list').evaluate((list) =>
        Array.from(list.querySelectorAll<HTMLElement>('.post-history-item'))
            .map((item) => item.dataset.postHistoryEventId ?? ''),
    );
}

async function expectHistoryIsNotAtBottom(page: Page) {
    await expect.poll(() => page.locator('.post-history-container').evaluate((element) => {
        const container = element as HTMLDivElement;
        return container.scrollHeight - container.clientHeight - container.scrollTop;
    })).toBeGreaterThan(1);
}

async function waitForIntersectionObserverSettle(page: Page) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => resolve());
            });
        });
    });
}

async function getFirstVisiblePostSnapshot(page: Page) {
    return page.locator('.post-history-container').evaluate((containerElement) => {
        const container = containerElement as HTMLDivElement;
        const containerRect = container.getBoundingClientRect();
        const items = Array.from(
            container.querySelectorAll<HTMLElement>('.post-history-item'),
        );
        const visibleEdgeTolerancePx = 4;
        const item = items.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            return (
                rect.bottom > containerRect.top + visibleEdgeTolerancePx &&
                rect.top < containerRect.bottom - visibleEdgeTolerancePx
            );
        });

        if (!item) {
            return null;
        }

        const rect = item.getBoundingClientRect();
        return {
            eventId: item.dataset.postHistoryEventId ?? '',
            offsetTop: rect.top - containerRect.top,
        };
    });
}

async function getPostSnapshotByEventId(page: Page, eventId: string) {
    return page.locator('.post-history-container').evaluate((containerElement, targetEventId) => {
        const container = containerElement as HTMLDivElement;
        const item = container.querySelector<HTMLElement>(
            `.post-history-item[data-post-history-event-id="${targetEventId}"]`,
        );

        if (!item) {
            return null;
        }

        const containerRect = container.getBoundingClientRect();
        const rect = item.getBoundingClientRect();
        return {
            eventId: item.dataset.postHistoryEventId ?? '',
            offsetTop: rect.top - containerRect.top,
        };
    }, eventId);
}

function startPostPositionFrameSampling(
    page: Page,
    eventId: string,
    frameCount = 24,
    watchedEventIds: string[] = [eventId],
) {
    const samples = page.locator('.post-history-container').evaluate(
        async (containerElement, args) => {
            const container = containerElement as HTMLDivElement;
            const item = container.querySelector<HTMLElement>(
                `.post-history-item[data-post-history-event-id="${args.eventId}"]`,
            );
            if (!item) {
                throw new Error('Visible post anchor disappeared during frame sampling');
            }
            const samples: Array<{
                timestamp: number;
                itemTop: number;
                relativeTop: number;
                containerTop: number;
                clientHeight: number;
                scrollTop: number;
                scrollHeight: number;
                headingHeight: number;
                monthLabel: string | null;
                topSlotHeight: number;
                bottomSlotHeight: number;
                topSpinnerVisible: boolean;
                bottomSpinnerVisible: boolean;
                watchedPosts: Array<{
                    eventId: string;
                    left: number;
                    top: number;
                    relativeLeft: number;
                    relativeTop: number;
                    height: number;
                    isCollapsed: boolean;
                } | null>;
            }> = [];

            const measure = () => {
                const itemRect = item.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const headingRect = document.querySelector(
                    '.post-history-heading',
                )?.getBoundingClientRect();
                const slots = container.querySelectorAll<HTMLElement>(
                    '.post-history-auto-load-slot',
                );
                return {
                    timestamp: performance.now(),
                    itemTop: itemRect.top,
                    relativeTop: itemRect.top - containerRect.top,
                    containerTop: containerRect.top,
                    clientHeight: container.clientHeight,
                    scrollTop: container.scrollTop,
                    scrollHeight: container.scrollHeight,
                    headingHeight: headingRect?.height ?? 0,
                    monthLabel: document.querySelector(
                        '.post-history-current-month',
                    )?.textContent ?? null,
                    topSlotHeight: slots[0]?.getBoundingClientRect().height ?? 0,
                    bottomSlotHeight: slots[1]?.getBoundingClientRect().height ?? 0,
                    topSpinnerVisible: !!slots[0]?.querySelector('.inline-spinner'),
                    bottomSpinnerVisible: !!slots[1]?.querySelector('.inline-spinner'),
                    watchedPosts: args.watchedEventIds.map((watchedEventId) => {
                        const watchedItem = container.querySelector<HTMLElement>(
                            `.post-history-item[data-post-history-event-id="${watchedEventId}"]`,
                        );
                        if (!watchedItem) {
                            return null;
                        }

                        const watchedRect = watchedItem.getBoundingClientRect();
                        return {
                            eventId: watchedEventId,
                            left: watchedRect.left,
                            top: watchedRect.top,
                            relativeLeft: watchedRect.left - containerRect.left,
                            relativeTop: watchedRect.top - containerRect.top,
                            height: watchedRect.height,
                            isCollapsed: !!watchedItem.querySelector(
                                '.post-history-preview-text-collapsed',
                            ),
                        };
                    }),
                };
            };

            container.dataset.postHistoryFrameSampling = 'running';
            samples.push(measure());
            let frame = 0;
            while (
                frame < args.frameCount ||
                container.dataset.postHistoryFrameSampling !== 'stop'
            ) {
                await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
                samples.push(measure());
                frame += 1;
            }
            delete container.dataset.postHistoryFrameSampling;
            return samples;
        },
        { eventId, frameCount, watchedEventIds },
    );
    const started = page.waitForFunction(() =>
        document.querySelector('.post-history-container')?.getAttribute('data-post-history-frame-sampling') === 'running',
    );

    return {
        started,
        samples,
        stop: () => page.locator('.post-history-container').evaluate((element) => {
            (element as HTMLDivElement).dataset.postHistoryFrameSampling = 'stop';
        }),
    };
}

async function getVisiblePostEventIds(page: Page): Promise<string[]> {
    return page.locator('.post-history-container').evaluate((element) => {
        const container = element as HTMLDivElement;
        const containerRect = container.getBoundingClientRect();
        const visible = Array.from(
            container.querySelectorAll<HTMLElement>('.post-history-item'),
        ).filter((item) => {
            const rect = item.getBoundingClientRect();
            return rect.bottom > containerRect.top + 1
                && rect.top < containerRect.bottom - 1;
        });
        const selected = [visible[0], visible[Math.floor((visible.length - 1) / 2)], visible.at(-1)];
        return Array.from(new Set(selected.map((item) => item?.dataset.postHistoryEventId ?? '').filter(Boolean)));
    });
}

function expectWatchedPostGeometryStableAcrossFrames(
    frameSamples: Awaited<ReturnType<typeof startPostPositionFrameSampling>['samples']>,
    eventIds: string[],
    initiallyPresentEventIds: string[],
) {
    for (const eventId of eventIds) {
        const values = frameSamples
            .map((sample) => sample.watchedPosts.find((post) => post?.eventId === eventId) ?? null)
            .filter((post): post is NonNullable<typeof post> => post !== null);
        expect(values.length).toBeGreaterThan(0);
        const baseline = values[0];
        if (initiallyPresentEventIds.includes(eventId)) {
            expect(frameSamples[0].watchedPosts.some((post) => post?.eventId === eventId)).toBe(true);
        }
        for (const value of values) {
            expect(Math.abs(value.left - baseline.left)).toBeLessThanOrEqual(1);
            expect(Math.abs(value.top - baseline.top)).toBeLessThanOrEqual(1);
            expect(Math.abs(value.relativeLeft - baseline.relativeLeft)).toBeLessThanOrEqual(1);
            expect(Math.abs(value.relativeTop - baseline.relativeTop)).toBeLessThanOrEqual(1);
            expect(Math.abs(value.height - baseline.height)).toBeLessThanOrEqual(1);
        }
    }
}

function expectPreviewSettledOnFirstRenderedFrame(
    frameSamples: Awaited<ReturnType<typeof startPostPositionFrameSampling>['samples']>,
    eventId: string,
) {
    const values = frameSamples
        .flatMap((sample) => sample.watchedPosts)
        .filter((post): post is NonNullable<typeof post> => post?.eventId === eventId);
    expect(values.length).toBeGreaterThan(0);
    expect(values[0].isCollapsed).toBe(true);
    for (const value of values) {
        expect(value.isCollapsed).toBe(true);
        expect(Math.abs(value.height - values[0].height)).toBeLessThanOrEqual(1);
    }
}

function expectPostPositionStableAcrossFrames(
    frameSamples: Awaited<ReturnType<typeof startPostPositionFrameSampling>['samples']>,
    anchor: { offsetTop: number },
    options: { topSlotHeights?: number[] } = {},
) {
    const expectedTopSlotHeights = options.topSlotHeights ?? [24];
    expect(frameSamples.length).toBeGreaterThanOrEqual(25);
    expect(frameSamples[0].topSpinnerVisible || frameSamples[0].bottomSpinnerVisible).toBe(true);
    expect(frameSamples.at(-1)?.topSpinnerVisible || frameSamples.at(-1)?.bottomSpinnerVisible).toBe(false);

    for (const sample of frameSamples) {
        expect(Math.abs(sample.itemTop - frameSamples[0].itemTop)).toBeLessThanOrEqual(1);
        expect(Math.abs(sample.relativeTop - anchor.offsetTop)).toBeLessThanOrEqual(1);
        expect(expectedTopSlotHeights).toContain(sample.topSlotHeight);
        expect(sample.bottomSlotHeight).toBe(24);
        expect(Math.abs(sample.containerTop - frameSamples[0].containerTop)).toBeLessThanOrEqual(1);
        expect(sample.clientHeight).toBe(frameSamples[0].clientHeight);
        expect(sample.headingHeight).toBe(frameSamples[0].headingHeight);
        expect(sample.monthLabel).toBe(frameSamples[0].monthLabel);
    }
    for (const expectedHeight of expectedTopSlotHeights) {
        expect(frameSamples.some((sample) => sample.topSlotHeight === expectedHeight)).toBe(true);
    }
}

async function getFooterActionPositions(page: Page, eventId: string) {
    const item = page.locator(`.post-history-item[data-post-history-event-id="${eventId}"]`);
    const repliesActionSlot = item.locator('.post-preview-footer-replies-slot');
    const replyActionButton = item.getByRole('button', { name: 'リプライ' });
    const quoteActionButton = item.getByRole('button', { name: '引用' });
    const menuActionButton = item.getByRole('button', { name: 'アクションを表示' });
    const reactionActionButton = item.locator('.post-preview-reactions-button');

    const repliesActionBox = await repliesActionSlot.boundingBox();
    const replyActionBox = await replyActionButton.boundingBox();
    const quoteActionBox = await quoteActionButton.boundingBox();
    const menuActionBox = await menuActionButton.boundingBox();

    expect(repliesActionBox).not.toBeNull();
    expect(replyActionBox).not.toBeNull();
    expect(quoteActionBox).not.toBeNull();
    expect(menuActionBox).not.toBeNull();

    return {
        repliesX: repliesActionBox!.x,
        repliesRight: repliesActionBox!.x + repliesActionBox!.width,
        replyCenterX: replyActionBox!.x + replyActionBox!.width / 2,
        quoteX: quoteActionBox!.x,
        menuX: menuActionBox!.x,
        hasReactionButton: await reactionActionButton.count() > 0,
    };
}

async function getActionColumnCenters(container: ReturnType<Page['locator']>) {
    const group = container.locator('.post-preview-action-buttons-group').first();
    const cells = group.locator(':scope > .post-preview-action-cell');
    await expect(cells).toHaveCount(3);
    return cells.evaluateAll((elements) => elements.map((element) => {
        const bounds = element.getBoundingClientRect();
        return {
            centerX: bounds.left + bounds.width / 2,
            left: bounds.left,
            right: bounds.right,
            width: bounds.width,
            top: bounds.top,
            bottom: bounds.bottom,
        };
    }));
}

async function getReplyAndQuoteButtonCenters(container: ReturnType<Page['locator']>) {
    const group = container.locator('.post-preview-action-buttons-group').first();
    const replyButton = group.getByRole('button', { name: 'リプライ' });
    const quoteButton = group.getByRole('button', { name: '引用' });
    const [replyBox, quoteBox] = await Promise.all([
        replyButton.boundingBox(),
        quoteButton.boundingBox(),
    ]);
    expect(replyBox).not.toBeNull();
    expect(quoteBox).not.toBeNull();
    return {
        reply: replyBox!.x + replyBox!.width / 2,
        quote: quoteBox!.x + quoteBox!.width / 2,
    };
}

async function getFooterLayout(container: ReturnType<Page['locator']>) {
    return container.locator('.post-preview-footer').first().evaluate((footer) => {
        const rect = (element: Element | null) => {
            if (!element) return null;
            const bounds = element.getBoundingClientRect();
            return {
                x: bounds.x,
                y: bounds.y,
                right: bounds.right,
                bottom: bounds.bottom,
                width: bounds.width,
                height: bounds.height,
            };
        };
        const buttons = Array.from(footer.querySelectorAll('button')).map((button) => ({
            label: button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '',
            ...rect(button)!,
        })).filter((button) => button.width > 0 && button.height > 0);
        const cells = Array.from(footer.querySelectorAll(
            '.post-preview-action-buttons-group > .post-preview-action-cell',
        )).map((cell) => rect(cell));
        return {
            footer: rect(footer)!,
            date: rect(footer.querySelector('.post-preview-date')),
            cells,
            buttons,
            clientWidth: (footer as HTMLElement).clientWidth,
            scrollWidth: (footer as HTMLElement).scrollWidth,
        };
    });
}

async function expectReactionContentsVerticallyCentered(
    container: ReturnType<Page['locator']>,
    selected: boolean,
) {
    const button = container.locator('.post-preview-reactions-button').first();
    const geometry = await button.evaluate((element) => {
        const buttonRect = element.getBoundingClientRect();
        const heartRect = element
            .querySelector('.favorite-icon')!
            .getBoundingClientRect();
        const count = element.querySelector('span')!;
        const countRect = count.getBoundingClientRect();
        const lineHeight = Number.parseFloat(getComputedStyle(count).lineHeight);
        const footer = element.closest('.post-preview-footer')!;
        const replyRect = footer
            .querySelector('.post-preview-reply-action-cell button')!
            .getBoundingClientRect();
        const quoteRect = footer
            .querySelector('.post-preview-quote-action-cell button')!
            .getBoundingClientRect();
        return {
            buttonHeight: buttonRect.height,
            alignItems: getComputedStyle(element).alignItems,
            buttonCenterY: buttonRect.top + buttonRect.height / 2,
            heartCenterY: heartRect.top + heartRect.height / 2,
            countLineCenterY: countRect.top + lineHeight / 2,
            replyCenterY: replyRect.top + replyRect.height / 2,
            quoteCenterY: quoteRect.top + quoteRect.height / 2,
            selected: element.classList.contains('selected'),
        };
    });

    expect(geometry.buttonHeight).toBeGreaterThanOrEqual(35);
    expect(geometry.buttonHeight).toBeLessThanOrEqual(37);
    expect(geometry.alignItems).toBe('center');
    expect(
        Math.abs(geometry.heartCenterY - geometry.buttonCenterY),
    ).toBeLessThanOrEqual(1);
    expect(
        Math.abs(geometry.countLineCenterY - geometry.buttonCenterY),
    ).toBeLessThanOrEqual(1);
    expect(
        Math.abs(geometry.heartCenterY - geometry.replyCenterY),
    ).toBeLessThanOrEqual(1);
    expect(
        Math.abs(geometry.heartCenterY - geometry.quoteCenterY),
    ).toBeLessThanOrEqual(1);
    expect(geometry.selected).toBe(selected);
}

async function expectReferenceLinkAttributes(
    link: ReturnType<Page['locator']>,
    href: string,
) {
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
}

async function expectNoHorizontalOverflow(
    locator: ReturnType<Page['locator']>,
) {
    const metrics = await locator.evaluate((element) => ({
        clientWidth: (element as HTMLElement).clientWidth,
        scrollWidth: (element as HTMLElement).scrollWidth,
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

function visiblePostHistoryActionMenu(page: Page) {
    return page.locator('.post-history-menu-content:visible').last();
}

async function expectTooltip(
    page: Page,
    trigger: ReturnType<Page['locator']>,
    text: string,
) {
    await trigger.hover();
    const tooltip = page.locator('.tooltip-content:visible').filter({ hasText: text });
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText(text);
    return tooltip;
}

test.describe('PostHistoryDialog Playwright', () => {
    test('latest contiguous history has no top auto-load reservation', async ({ page }) => {
        await gotoInfiniteScrollHarness(page);
        const geometry = await page.locator('.post-history-container').evaluate((containerElement) => {
            const container = containerElement as HTMLDivElement;
            const slot = container.querySelector<HTMLElement>(
                '.post-history-auto-load-newer-slot',
            );
            const list = container.querySelector<HTMLElement>('.post-history-list');
            if (!slot || !list) {
                throw new Error('Latest history top slot or list is missing');
            }
            const slotRect = slot.getBoundingClientRect();
            const listRect = list.getBoundingClientRect();
            return {
                slotHeight: slotRect.height,
                gapBeforeList: listRect.top - slotRect.bottom,
                sentinelCount: slot.querySelectorAll(
                    '.post-history-auto-load-newer-sentinel',
                ).length,
            };
        });

        expect(geometry.slotHeight).toBe(0);
        expect(Math.abs(geometry.gapBeforeList)).toBeLessThanOrEqual(1);
        expect(geometry.sentinelCount).toBe(0);
    });

    test('opening normal history and immediately scrolling to the bottom loads older posts', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?infinite-scroll=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );
        const container = page.locator('.post-history-container');
        await expect(container.locator('.post-history-list li')).toHaveCount(50);

        await container.evaluate((element) => {
            const root = element as HTMLDivElement;
            root.scrollTop = root.scrollHeight;
            root.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await expect.poll(() => historyEventIds(page)).toEqual(
            harness.infiniteScrollEventIds.slice(0, 100),
        );
    });

    for (const emptyGap of [false, true]) {
        test(`relay coverage bridges ${emptyGap ? 'an empty gap' : 'a gap'}, reuses saved history and preserves its scroll anchor after reopen and reload`, async ({ page }, testInfo) => {
            // This story includes signed fixture setup, backfill, paging, reopen and reload.
            test.setTimeout(60_000);
            await page.goto(`post-history-dialog-playwright.html?relay-coverage=${emptyGap ? 'empty-gap' : 'gap'}`);
            await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
            const ids = await page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.eventIds);
            const expectedIds = emptyGap ? ids.filter((_, i) => i < 100 || i >= 110) : ids;
            const fetchButton = page.getByRole('button', { name: 'リレーから続きを取得' });
            const rows = () => historyEventIds(page);
            await expect.poll(rows).toEqual(expectedIds.slice(0, 50));
            await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.headRequests)).toBe(4);
            await expect(page.locator('.status-loading-placeholder .loader-container')).toHaveCount(0);
            await scrollHistoryToBottom(page);
            await expect.poll(rows).toEqual(expectedIds.slice(0, 100));
            await scrollHistoryToBottom(page);
            await expect(fetchButton).toBeVisible();
            await expect(page.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeVisible();
            await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.olderRequests.length)).toBe(0);
            await fetchButton.scrollIntoViewIfNeeded();
            const anchor = await getFirstVisiblePostSnapshot(page);
            expect(anchor).not.toBeNull();
            await fetchButton.click();
            await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.olderRequests.length)).toBe(5);
            await page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.release());
            await expect.poll(rows).toEqual(expectedIds.slice(0, 150));
            await expect(fetchButton).toHaveCount(0);
            await expect.poll(async () => {
                const after = await getPostSnapshotByEventId(page, anchor!.eventId);
                return after ? Math.abs(after.offsetTop - anchor!.offsetTop) : Infinity;
            }).toBeLessThanOrEqual(1);
            await page.screenshot({ path: testInfo.outputPath('connected-history.png') });

            for (let i = 0; i < 4; i++) {
                const lastBefore = (await rows()).at(-1);
                await scrollHistoryToBottom(page);
                await expect.poll(async () => (await rows()).at(-1)).not.toBe(lastBefore);
                if ((await rows()).at(-1) === ids[309]) break;
                await expect(fetchButton).toHaveCount(0);
            }
            await expect.poll(async () => (await rows()).at(-1)).toBe(ids[309]);
            await scrollHistoryToBottom(page);
            await expect(fetchButton).toBeVisible();
            await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.olderRequests.length)).toBe(5);
            await page.getByRole('button', { name: '閉じる', exact: true }).click();
            await page.getByTestId('post-history-reopen').click();
            await expect.poll(async () => (await rows()).at(-1)).toBe(ids[309]);
            await expect(fetchButton).toBeVisible();

            await page.reload();
            await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
            await expect.poll(rows).toEqual(expectedIds.slice(0, 50));
            await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.headRequests)).toBe(4);
            await expect(page.locator('.status-loading-placeholder .loader-container')).toHaveCount(0);
            for (const last of [99, 149]) {
                await scrollHistoryToBottom(page);
                await expect.poll(async () => (await rows()).at(-1)).toBe(expectedIds[last]);
                await expect(fetchButton).toHaveCount(0);
            }
            await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.olderRequests.length)).toBe(0);
        });
    }

    test('a refreshed head stops at its uncovered gap before reconnecting older saved history', async ({ page }, testInfo) => {
        await page.goto('post-history-dialog-playwright.html?relay-coverage=new-head');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const ids = await page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.eventIds);
        const rows = () => historyEventIds(page);
        const fetchButton = page.getByRole('button', { name: 'リレーから続きを取得' });
        await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.headRequests)).toBe(4);
        await expect(page.locator('.status-loading-placeholder .loader-container')).toHaveCount(0);
        await expect.poll(rows).toEqual(ids.slice(0, 50));
        await scrollHistoryToBottom(page);
        await expect.poll(rows).toEqual(ids.slice(0, 60));
        await scrollHistoryToBottom(page);
        await expect(fetchButton).toBeVisible();
        await expect(page.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeVisible();
        await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.olderRequests.length)).toBe(0);
        await fetchButton.scrollIntoViewIfNeeded();
        const anchor = await getFirstVisiblePostSnapshot(page);
        expect(anchor).not.toBeNull();
        await fetchButton.click();
        await expect.poll(() => page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.olderRequests.length)).toBe(5);
        await page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_COVERAGE__!.release());
        await expect.poll(rows).toEqual(ids.slice(0, 110));
        await expect(fetchButton).toHaveCount(0);
        await expect.poll(async () => {
            const after = await getPostSnapshotByEventId(page, anchor!.eventId);
            return after ? Math.abs(after.offsetTop - anchor!.offsetTop) : Infinity;
        }).toBeLessThanOrEqual(1);
        await page.screenshot({ path: testInfo.outputPath('connected-head-history.png') });
    });

    test('scrolling during resize observer recreation is not suppressed', async ({ page }) => {
        await installInitialHistoryResizeScroll(page);
        await page.goto('post-history-dialog-playwright.html?infinite-scroll=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );

        await expect.poll(() => page.evaluate(() => {
            return (window as Window & {
                __POST_HISTORY_RESIZE_SCROLL_STATE__?: { recreated: boolean };
            }).__POST_HISTORY_RESIZE_SCROLL_STATE__?.recreated ?? false;
        })).toBe(true);
        await expect.poll(() => historyEventIds(page)).toEqual(
            harness.infiniteScrollEventIds.slice(0, 100),
        );
    });

    test('JSONL export downloads signed post and deletion events from the current account', async ({ page }) => {
        await gotoExportHarness(page);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('menuitem', { name: 'JSONLをエクスポート' }).click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/^ehagaki-post-history-\d{4}-\d{2}-\d{2}\.jsonl$/);

        const content = await readDownload(download);
        const events = content.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
        expect(events).toHaveLength(3);
        expect(events.map((event) => event.kind)).toEqual([1, 42, 5]);
        expect(content).not.toContain('schemaVersion');
        expect(content).not.toContain('relayHints');
        expect(content.endsWith('\n')).toBe(true);
        await expect(page.getByText(/投稿履歴を3件エクスポートしました/)).toBeVisible();
        await expect.poll(() => readExportVerificationStates(page)).toEqual([
            { status: 'valid', ruleVersion: 1 },
            { status: 'valid', ruleVersion: 1 },
            { status: 'valid', ruleVersion: 1 },
        ]);
    });

    test('desktop JSONL import saves a post and refreshes the local history', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);
        await expectSummary(page, harness.totalPosts);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: 'JSONLをインポート' }).click();

        const importDialog = page.locator('.post-history-import-dialog');
        await expect(importDialog).toBeVisible();
        await importDialog.locator('input[type="file"]').setInputFiles({
            name: 'post-history.jsonl',
            mimeType: 'application/x-ndjson',
            buffer: Buffer.from(harness.importEventJsonl),
        });

        await expect(importDialog.getByText('読み込みが完了しました')).toBeVisible();
        await expect(importDialog.getByText('新規追加').locator('..')).toContainText('1');
        await importDialog.getByRole('button', { name: '閉じる' }).click();

        await expectSummary(page, harness.totalPosts + 1);
        await expect(page.getByText(harness.importPostContent, { exact: true })).toBeVisible();
    });

    test('desktop JSONL import also starts from a file drop without child-element flicker', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);
        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: 'JSONLをインポート' }).click();

        const importDialog = page.locator('.post-history-import-dialog');
        const dropZone = importDialog.locator('.import-drop-zone');
        const chooseFileButton = importDialog.locator('button[aria-label="JSONLファイルを選択"]');
        await expect(dropZone).toContainText('JSONLファイルをここにドラッグ＆ドロップ');

        const initialUrl = page.url();
        const nonFileDefaultsPrevented = await dropZone.evaluate((element) => {
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/uri-list', 'https://example.com/ignored');
            const dragOverEvent = new DragEvent('dragover', {
                bubbles: true,
                cancelable: true,
                dataTransfer,
            });
            const dropEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                dataTransfer,
            });
            element.dispatchEvent(dragOverEvent);
            element.dispatchEvent(dropEvent);
            return {
                dragOver: dragOverEvent.defaultPrevented,
                drop: dropEvent.defaultPrevented,
            };
        });
        expect(nonFileDefaultsPrevented).toEqual({ dragOver: true, drop: true });
        expect(page.url()).toBe(initialUrl);
        await expect(dropZone).toContainText('JSONLファイルをここにドラッグ＆ドロップ');

        await dropZone.evaluate((element, jsonl) => {
            const file = new File([jsonl], 'post-history.jsonl', {
                type: 'application/x-ndjson',
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            element.dispatchEvent(new DragEvent('dragenter', {
                bubbles: true,
                dataTransfer,
            }));
        }, harness.importEventJsonl);
        await expect(dropZone).toContainText('ここにドロップ');

        await chooseFileButton.evaluate((element) => {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File(['unused'], 'unused.jsonl'));
            element.dispatchEvent(new DragEvent('dragenter', {
                bubbles: true,
                dataTransfer,
            }));
            element.dispatchEvent(new DragEvent('dragleave', {
                bubbles: true,
                dataTransfer,
            }));
        });
        await expect(dropZone).toContainText('ここにドロップ');

        await dropZone.evaluate((element, jsonl) => {
            const file = new File([jsonl], 'post-history.jsonl', {
                type: 'application/x-ndjson',
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            element.dispatchEvent(new DragEvent('drop', {
                bubbles: true,
                dataTransfer,
            }));
        }, harness.importEventJsonl);

        await expect(importDialog.getByText('読み込みが完了しました')).toBeVisible();
        await expect(importDialog.getByText('新規追加').locator('..')).toContainText('1');
        await expect(dropZone).toContainText('JSONLファイルをここにドラッグ＆ドロップ');
    });

    test('saved posts outside the visible range can be viewed without changing the range', async ({ page, isMobile }) => {
        const harness = await gotoSparseHarness(page);

        await expectSummary(page, harness.totalPosts);
        await expect(page.getByText(harness.sparseVisiblePostContent, { exact: true })).toBeVisible();
        await expect(page.getByText('保存済みの古い投稿を表示', { exact: true })).toBeVisible();
        await expect(page.getByText('この先には未取得の期間がある可能性があります。保存済みの古い投稿を表示できます。', { exact: true })).toHaveCount(0);

        const boundaryLayout = await page.locator('.post-history-saved-boundary-actions').evaluate((element) => {
            const actionElement = element as HTMLElement;
            const buttons = Array.from(actionElement.querySelectorAll<HTMLElement>('button'));
            return {
                justifyContent: getComputedStyle(actionElement).justifyContent,
                alignItems: getComputedStyle(actionElement).alignItems,
                buttonRects: buttons.map((button) => {
                    const rect = button.getBoundingClientRect();
                    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
                }),
            };
        });
        expect(boundaryLayout.justifyContent).toBe('center');
        expect(boundaryLayout.alignItems).toBe(isMobile ? 'center' : 'flex-start');
        expect(boundaryLayout.buttonRects.length).toBeGreaterThan(0);
        expect(new Set(boundaryLayout.buttonRects.map((rect) => rect.height)).size).toBe(1);

        await page.getByRole('button', { name: '保存済みの古い投稿を表示' }).click();

        await expect(page.getByText('保存済みの古い投稿を表示中です。', { exact: true })).toBeVisible();
        await expect(page.getByText(harness.sparseStoredPostContent, { exact: true })).toBeVisible();
        await page.getByRole('button', { name: '最新へ戻る' }).click();
        await expect(page.getByText(harness.sparseVisiblePostContent, { exact: true })).toBeVisible();
    });

    test('search result jumps to the exact saved post and aligns it to the viewport top', async ({ page }) => {
        const harness = await gotoSparseHarness(page);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '検索' }).click();
        await page.getByRole('searchbox', { name: '検索' }).fill('alpha');

        const targetItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.sparseStoredPostEventId}"]`,
        );
        await expect(targetItem).toBeVisible();
        await targetItem.getByRole('button', { name: 'アクションを表示' }).click();
        await page.getByRole('menuitem', { name: '前後の投稿を表示' }).click();

        await expect(page.getByRole('searchbox', { name: '検索' })).toHaveCount(0);
        await expect(targetItem).toBeVisible();
        await expect.poll(async () => {
            const snapshot = await getPostSnapshotByEventId(
                page,
                harness.sparseStoredPostEventId,
            );
            return snapshot?.offsetTop ?? Number.POSITIVE_INFINITY;
        }).toBeLessThanOrEqual(1);
        await expect(page.getByRole('button', { name: '最新へ戻る' })).toBeVisible();
    });

    test('saved sparse pages can jump to the absolute local oldest and scroll to the bottom', async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoSparseOldestHarness(page);
        await expect(page.getByRole('button', { name: '保存済みの古い投稿を表示' })).toBeVisible();

        await page.getByRole('button', { name: '保存済みの古い投稿を表示' }).click();
        await expect(page.getByText('保存済みの古い投稿を表示中です。', { exact: true })).toBeVisible();
        await expect(page.getByText(harness.sparseStoredPostContent, { exact: true })).toBeVisible();

        const container = page.locator('.post-history-container');
        await container.evaluate((element) => {
            const historyContainer = element as HTMLDivElement;
            historyContainer.scrollTop = 0;
            historyContainer.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '最古へ移動' }).click();

        await expect(page.getByText(harness.absoluteOldestPostContent, { exact: true })).toBeVisible();
        await expect.poll(() => container.evaluate((element) => {
            const historyContainer = element as HTMLDivElement;
            return historyContainer.scrollHeight - historyContainer.clientHeight - historyContainer.scrollTop;
        })).toBeLessThanOrEqual(1);
    });

    test('normal history loads exactly one local chunk for each new bottom arrival', async ({ page }) => {
        const harness = await gotoInfiniteScrollHarness(page);
        const expectedEventIds = harness.infiniteScrollEventIds;

        await expectVisiblePostCount(page, 50);
        await expect(page.getByRole('button', { name: 'さらに古い投稿を表示' })).toHaveCount(0);
        await expect(page.locator('.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel)')).toBeVisible();
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(0, 50));

        const observedEventIds = new Set(await historyEventIds(page));

        await scrollHistoryToBottom(page);
        await expectVisiblePostCount(page, 100);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(0, 100));
        for (const eventId of await historyEventIds(page)) {
            observedEventIds.add(eventId);
        }
        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(0, 100));

        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryToBottom(page);
        await expectVisiblePostCount(page, 150);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(0, 150));
        for (const eventId of await historyEventIds(page)) {
            observedEventIds.add(eventId);
        }
        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(0, 150));

        const olderSentinel = page.locator(
            '.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel)',
        );
        await olderSentinel.evaluate((element) => {
            (element as HTMLElement).style.display = 'none';
        });
        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryToBottom(page);
        await waitForHistoryContainerHeightToSettle(page);
        const anchorBeforeLoad = await getFirstVisiblePostSnapshot(page);
        await olderSentinel.evaluate((element) => {
            (element as HTMLElement).style.removeProperty('display');
        });
        expect(anchorBeforeLoad).not.toBeNull();
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(50, 200));
        await expect(page.locator('.post-history-auto-load-newer-slot'))
            .toHaveCSS('height', '24px');
        await expect(page.locator('.post-history-auto-load-newer-sentinel')).toBeVisible();
        await expectVisiblePostCount(page, 150);
        const shiftedWindowEventIds = await historyEventIds(page);
        expect(new Set(shiftedWindowEventIds).size).toBe(150);
        expect(shiftedWindowEventIds).toContain(expectedEventIds[199]);
        for (const eventId of shiftedWindowEventIds) {
            observedEventIds.add(eventId);
        }

        const anchorAfterLoad = await getPostSnapshotByEventId(page, anchorBeforeLoad!.eventId);
        expect(anchorAfterLoad).not.toBeNull();
        expect(anchorAfterLoad!.eventId).toBe(anchorBeforeLoad!.eventId);
        expect(Math.abs(anchorAfterLoad!.offsetTop - anchorBeforeLoad!.offsetTop)).toBeLessThanOrEqual(1);
        await expectHistoryIsNotAtBottom(page);

        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(50, 200));

        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryToBottom(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(100, 250));
        await expectVisiblePostCount(page, 150);
        for (const eventId of await historyEventIds(page)) {
            observedEventIds.add(eventId);
        }
        await expect(page.locator('.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel)')).toBeVisible();
        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(100, 250));

        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryToBottom(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(101));
        await expectVisiblePostCount(page, 150);
        for (const eventId of await historyEventIds(page)) {
            observedEventIds.add(eventId);
        }
        await expect(page.locator('.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel)')).toHaveCount(0);

        expect(observedEventIds).toEqual(new Set(expectedEventIds));
        await scrollHistoryToBottom(page);
        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(101));
        await expect(page.getByText(harness.infiniteScrollOldestPostContent, { exact: true })).toBeVisible();

        await expect(page.getByRole('button', { name: '新しい投稿を表示' })).toHaveCount(0);
        const upwardWindows = [
            expectedEventIds.slice(51, 201),
            expectedEventIds.slice(1, 151),
            expectedEventIds.slice(0, 150),
        ];
        for (const [index, expectedWindow] of upwardWindows.entries()) {
            await scrollHistoryToTop(page);
            await expect.poll(() => historyEventIds(page)).toEqual(expectedWindow);
            await expectVisiblePostCount(page, 150);
            await waitForIntersectionObserverSettle(page);
            expect(await historyEventIds(page)).toEqual(expectedWindow);
            await expect(page.getByRole('button', { name: '新しい投稿を表示' })).toHaveCount(0);

            if (index < upwardWindows.length - 1) {
                await scrollHistoryAwayFromTop(page);
                await waitForIntersectionObserverSettle(page);
            }
        }

        await expect(
            page.locator(`.post-history-item[data-post-history-event-id="${expectedEventIds[0]}"]`),
        ).toBeVisible();
        await scrollHistoryToTop(page);
        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(0, 150));
    });

    test('normal history preloads one local chunk before either edge and rearms after exit', async ({ page }) => {
        const harness = await gotoInfiniteScrollHarness(page);
        const expectedEventIds = harness.infiniteScrollEventIds;

        await expectVisiblePostCount(page, 50);
        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);
        await waitForHistoryContainerHeightToSettle(page);
        const olderApproach = await scrollHistoryNearBottom(page);
        expect(olderApproach.remaining).toBeGreaterThan(1);
        expect(olderApproach.remaining).toBeLessThan(olderApproach.clientHeight * 2);
        expect(olderApproach.remaining).toBeGreaterThan(olderApproach.clientHeight);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(0, 100));
        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(0, 100));

        for (const expectedWindow of [
            expectedEventIds.slice(0, 150),
            expectedEventIds.slice(50, 200),
            expectedEventIds.slice(100, 250),
            expectedEventIds.slice(101),
        ]) {
            await waitForHistoryContainerHeightToSettle(page);
            await scrollHistoryAwayFromBottom(page);
            await waitForIntersectionObserverSettle(page);
            await waitForHistoryContainerHeightToSettle(page);
            await scrollHistoryToBottom(page);
            await expect.poll(() => historyEventIds(page)).toEqual(expectedWindow);
        }

        await scrollHistoryAwayFromTop(page);
        await waitForIntersectionObserverSettle(page);
        const newerApproach = await scrollHistoryNearTopAndCaptureAnchor(page);
        expect(newerApproach.topOffset).toBeGreaterThan(1);
        expect(newerApproach.topOffset).toBeLessThan(newerApproach.clientHeight * 2);
        expect(newerApproach.topOffset).toBeGreaterThan(newerApproach.clientHeight);
        expect(newerApproach.anchor).not.toBeNull();
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(51, 201));
        const restoredAnchor = await getPostSnapshotByEventId(
            page,
            newerApproach.anchor!.eventId,
        );
        expect(restoredAnchor).not.toBeNull();
        expect(Math.abs(
            restoredAnchor!.offsetTop - newerApproach.anchor!.offsetTop,
        )).toBeLessThanOrEqual(1);
        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(51, 201));

        await scrollHistoryAwayFromTop(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryNearTopAndCaptureAnchor(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(1, 151));
        await waitForIntersectionObserverSettle(page);
        expect(await historyEventIds(page)).toEqual(expectedEventIds.slice(1, 151));
    });

    test('older autoload defers when the user scrolls to an anchor that the window would trim', async ({ page }) => {
        const harness = await gotoInfiniteScrollHarness(page, {
            fixContainerHeight: false,
        });
        await expect(page.locator('.post-history-heading .status-loading-placeholder')).toHaveCount(0);
        const expectedEventIds = harness.infiniteScrollEventIds;

        await scrollHistoryToBottom(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(0, 100));
        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryToBottom(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(0, 150));
        const windowBeforeDeferredLoad = await historyEventIds(page);
        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);

        await armScrollLoadGate(page, 'older');
        await scrollHistoryToBottom(page);
        await waitForScrollLoadGate(page);
        await expect(page.locator('.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel) .inline-spinner')).toBeVisible();

        await scrollHistoryToTop(page);
        await waitForIntersectionObserverSettle(page);
        const userSelectedAnchor = await getFirstVisiblePostSnapshot(page);
        expect(userSelectedAnchor).not.toBeNull();
        expect(userSelectedAnchor!.eventId).toBe(windowBeforeDeferredLoad[0]);
        const frameSampling = startPostPositionFrameSampling(
            page,
            userSelectedAnchor!.eventId,
        );
        await frameSampling.started;
        await releaseScrollLoadGate(page);
        await expect(page.locator('.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel) .inline-spinner')).toBeHidden();
        await frameSampling.stop();
        const frameSamples = await frameSampling.samples;
        expectPostPositionStableAcrossFrames(frameSamples, userSelectedAnchor!, {
            topSlotHeights: [0],
        });
        expect(frameSamples.every((sample) => Number.isFinite(sample.scrollTop))).toBe(true);
        expect(frameSamples.every((sample) => Number.isFinite(sample.scrollHeight))).toBe(true);

        await expect.poll(() => historyEventIds(page)).toEqual(windowBeforeDeferredLoad);
        const retainedUserAnchor = await getPostSnapshotByEventId(
            page,
            userSelectedAnchor!.eventId,
        );
        expect(retainedUserAnchor).not.toBeNull();
        expect(Math.abs(retainedUserAnchor!.offsetTop - userSelectedAnchor!.offsetTop)).toBeLessThanOrEqual(1);

        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryToBottom(page);
        await expect.poll(() => historyEventIds(page)).not.toEqual(windowBeforeDeferredLoad);
        await expectVisiblePostCount(page, 150);
    });

    test('newer autoload defers when the user scrolls to an anchor that the window would trim', async ({ page }) => {
        const harness = await gotoInfiniteScrollHarness(page, {
            fixContainerHeight: false,
        });
        await expect(page.locator('.post-history-heading .status-loading-placeholder')).toHaveCount(0);
        const expectedEventIds = harness.infiniteScrollEventIds;

        await scrollHistoryToBottom(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(0, 100));
        for (const expectedWindow of [
            expectedEventIds.slice(0, 150),
            expectedEventIds.slice(50, 200),
            expectedEventIds.slice(100, 250),
            expectedEventIds.slice(101),
        ]) {
            await scrollHistoryAwayFromBottom(page);
            await waitForIntersectionObserverSettle(page);
            await scrollHistoryToBottom(page);
            await expect.poll(() => historyEventIds(page)).toEqual(expectedWindow);
        }

        await scrollHistoryAwayFromTop(page);
        await waitForIntersectionObserverSettle(page);
        await armScrollLoadGate(page, 'newer');
        await scrollHistoryNearTopAndCaptureAnchor(page);
        await waitForScrollLoadGate(page);
        await expect(page.locator('.post-history-auto-load-newer-sentinel .inline-spinner')).toBeVisible();

        await scrollHistoryToBottom(page);
        await waitForIntersectionObserverSettle(page);
        const userSelectedAnchor = await getFirstVisiblePostSnapshot(page);
        expect(userSelectedAnchor).not.toBeNull();
        expect(expectedEventIds.slice(200)).toContain(userSelectedAnchor!.eventId);
        const frameSampling = startPostPositionFrameSampling(
            page,
            userSelectedAnchor!.eventId,
        );
        await frameSampling.started;
        await releaseScrollLoadGate(page);
        await expect(page.locator('.post-history-auto-load-newer-sentinel .inline-spinner')).toBeHidden();
        await frameSampling.stop();
        const frameSamples = await frameSampling.samples;
        expectPostPositionStableAcrossFrames(frameSamples, userSelectedAnchor!);
        expect(frameSamples.every((sample) => Number.isFinite(sample.scrollTop))).toBe(true);
        expect(frameSamples.every((sample) => Number.isFinite(sample.scrollHeight))).toBe(true);

        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(101));
        const retainedUserAnchor = await getPostSnapshotByEventId(
            page,
            userSelectedAnchor!.eventId,
        );
        expect(retainedUserAnchor).not.toBeNull();
        expect(Math.abs(retainedUserAnchor!.offsetTop - userSelectedAnchor!.offsetTop)).toBeLessThanOrEqual(1);

        await scrollHistoryAwayFromTop(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryNearTopAndCaptureAnchor(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(51, 201));
    });

    test('successful newer autoload returns to latest without moving the visible anchor', async ({ page }) => {
        const harness = await gotoInfiniteScrollHarness(page, {
            fixContainerHeight: false,
            longPreviews: true,
        });
        await expect(page.locator('.post-history-heading .status-loading-placeholder')).toHaveCount(0);
        const expectedEventIds = harness.infiniteScrollEventIds;

        await scrollHistoryToBottom(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(0, 100));
        for (const expectedWindow of [
            expectedEventIds.slice(0, 150),
            expectedEventIds.slice(50, 200),
            expectedEventIds.slice(100, 250),
            expectedEventIds.slice(101),
        ]) {
            await scrollHistoryAwayFromBottom(page);
            await waitForIntersectionObserverSettle(page);
            await scrollHistoryToBottom(page);
            await expect.poll(() => historyEventIds(page)).toEqual(expectedWindow);
        }

        await scrollHistoryAwayFromTop(page);
        await waitForIntersectionObserverSettle(page);
        await expect(page.locator('.post-history-auto-load-newer-slot'))
            .toHaveCSS('height', '24px');
        await expect(page.locator('.post-history-auto-load-newer-sentinel'))
            .toHaveCount(1);
        await armScrollLoadGate(page, 'newer');
        await scrollHistoryNearTopAndCaptureAnchor(page);
        await waitForScrollLoadGate(page);
        await expect(page.locator('.post-history-auto-load-newer-sentinel .inline-spinner')).toBeVisible();

        const userSelectedAnchor = await getFirstVisiblePostSnapshot(page);
        expect(userSelectedAnchor).not.toBeNull();
        expect(expectedEventIds.slice(101)).toContain(userSelectedAnchor!.eventId);
        const initiallyVisibleEventIds = await getVisiblePostEventIds(page);
        const watchedEventIds = [
            ...new Set([
                ...initiallyVisibleEventIds,
                expectedEventIds[70],
            ]),
        ];
        const expectedWindow = expectedEventIds.slice(51, 201);
        const frameSampling = startPostPositionFrameSampling(
            page,
            userSelectedAnchor!.eventId,
            24,
            watchedEventIds,
        );
        await frameSampling.started;
        await releaseScrollLoadGate(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedWindow);
        await expect(page.locator('.post-history-auto-load-newer-sentinel .inline-spinner')).toBeHidden();
        await frameSampling.stop();

        const frameSamples = await frameSampling.samples;
        expectPostPositionStableAcrossFrames(frameSamples, userSelectedAnchor!);
        expectWatchedPostGeometryStableAcrossFrames(
            frameSamples,
            watchedEventIds,
            initiallyVisibleEventIds,
        );
        expectPreviewSettledOnFirstRenderedFrame(frameSamples, expectedEventIds[70]);
        await expectVisiblePostCount(page, 150);
        expect(await historyEventIds(page)).toEqual(expectedWindow);
        expect(expectedWindow).toContain(userSelectedAnchor!.eventId);
        const retainedUserAnchor = await getPostSnapshotByEventId(
            page,
            userSelectedAnchor!.eventId,
        );
        expect(retainedUserAnchor).not.toBeNull();
        expect(Math.abs(retainedUserAnchor!.offsetTop - userSelectedAnchor!.offsetTop)).toBeLessThanOrEqual(1);

        const penultimateWindow = expectedEventIds.slice(1, 151);
        await scrollHistoryAwayFromTop(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryNearTopAndCaptureAnchor(page);
        await expect.poll(() => historyEventIds(page)).toEqual(penultimateWindow);
        await expect(page.locator('.post-history-auto-load-newer-sentinel .inline-spinner'))
            .toBeHidden();

        await scrollHistoryAwayFromTop(page);
        await waitForIntersectionObserverSettle(page);
        await armScrollLoadGate(page, 'newer');
        await scrollHistoryNearTopAndCaptureAnchor(page);
        await waitForScrollLoadGate(page);
        await expect(page.locator('.post-history-auto-load-newer-slot'))
            .toHaveCSS('height', '24px');
        await expect(page.locator('.post-history-auto-load-newer-sentinel .inline-spinner'))
            .toBeVisible();
        const latestTransitionAnchor = await getFirstVisiblePostSnapshot(page);
        expect(latestTransitionAnchor).not.toBeNull();
        const latestTransitionSampling = startPostPositionFrameSampling(
            page,
            latestTransitionAnchor!.eventId,
        );
        await latestTransitionSampling.started;
        await releaseScrollLoadGate(page);
        const latestWindow = expectedEventIds.slice(0, 150);
        await expect.poll(() => historyEventIds(page)).toEqual(latestWindow);
        await expect(page.locator('.post-history-auto-load-newer-slot'))
            .toHaveCSS('height', '0px');
        await expect(page.locator('.post-history-auto-load-newer-sentinel .inline-spinner'))
            .toBeHidden();
        await latestTransitionSampling.stop();

        const latestTransitionFrames = await latestTransitionSampling.samples;
        expectPostPositionStableAcrossFrames(
            latestTransitionFrames,
            latestTransitionAnchor!,
            { topSlotHeights: [24, 0] },
        );
        expect(await historyEventIds(page)).toEqual(latestWindow);
        await expect(page.locator('.post-history-auto-load-newer-sentinel')).toHaveCount(0);
    });

    test('successful older autoload swaps the bounded window without moving the visible anchor', async ({ page }) => {
        const harness = await gotoInfiniteScrollHarness(page, {
            fixContainerHeight: false,
            longPreviews: true,
        });
        await expect(page.locator('.post-history-heading .status-loading-placeholder')).toHaveCount(0);
        const expectedEventIds = harness.infiniteScrollEventIds;

        await scrollHistoryToBottom(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedEventIds.slice(0, 100));
        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);
        await scrollHistoryToBottom(page);
        const initialWindow = expectedEventIds.slice(0, 150);
        await expect.poll(() => historyEventIds(page)).toEqual(initialWindow);
        await scrollHistoryAwayFromBottom(page);
        await waitForIntersectionObserverSettle(page);

        await armScrollLoadGate(page, 'older');
        await scrollHistoryToBottom(page);
        await waitForScrollLoadGate(page);
        await expect(page.locator('.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel) .inline-spinner')).toBeVisible();
        await scrollPostIntoViewByEventId(page, expectedEventIds[100]);
        await waitForIntersectionObserverSettle(page);
        await expect(page.locator('.post-history-auto-load-newer-slot'))
            .toHaveCSS('height', '0px');

        const userSelectedAnchor = await getFirstVisiblePostSnapshot(page);
        expect(userSelectedAnchor).not.toBeNull();
        expect(userSelectedAnchor!.eventId).toBe(expectedEventIds[100]);
        const initiallyVisibleEventIds = await getVisiblePostEventIds(page);
        const watchedEventIds = [
            ...new Set([
                ...initiallyVisibleEventIds,
                expectedEventIds[150],
            ]),
        ];
        const expectedWindow = expectedEventIds.slice(50, 200);
        const frameSampling = startPostPositionFrameSampling(
            page,
            userSelectedAnchor!.eventId,
            24,
            watchedEventIds,
        );
        await frameSampling.started;
        await releaseScrollLoadGate(page);
        await expect.poll(() => historyEventIds(page)).toEqual(expectedWindow);
        await expect(page.locator('.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel) .inline-spinner')).toBeHidden();
        await frameSampling.stop();

        const frameSamples = await frameSampling.samples;
        expectWatchedPostGeometryStableAcrossFrames(
            frameSamples,
            watchedEventIds,
            initiallyVisibleEventIds,
        );
        expectPostPositionStableAcrossFrames(frameSamples, userSelectedAnchor!, {
            topSlotHeights: [0, 24],
        });
        expectPreviewSettledOnFirstRenderedFrame(frameSamples, expectedEventIds[150]);
        await expectVisiblePostCount(page, 150);
        expect(await historyEventIds(page)).toEqual(expectedWindow);
        expect(expectedWindow).toContain(userSelectedAnchor!.eventId);
        const retainedUserAnchor = await getPostSnapshotByEventId(
            page,
            userSelectedAnchor!.eventId,
        );
        expect(retainedUserAnchor).not.toBeNull();
        expect(Math.abs(retainedUserAnchor!.offsetTop - userSelectedAnchor!.offsetTop)).toBeLessThanOrEqual(1);
    });

    test('非同期media・emoji・関連stateの解決前後で投稿寸法と可視位置を維持する', async ({ page }) => {
        const imageBody = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';
        const imageGate = await gateResponseRoute(page, '**/layout-stable-image.svg', async (route) =>
            route.fulfill({ status: 200, contentType: 'image/svg+xml', body: imageBody }),
        );
        const videoGate = await gateResponseRoute(page, '**/layout-stable-video.mp4', async (route) =>
            route.fulfill({ status: 200, contentType: 'video/mp4', body: Buffer.from([0, 0, 0, 24, 102, 116, 121, 112]) }),
        );
        const emojiSuccessGate = await gateResponseRoute(page, '**/layout-stable-emoji.svg', async (route) =>
            route.fulfill({ status: 200, contentType: 'image/svg+xml', body: imageBody }),
        );
        const emojiFailureGate = await gateResponseRoute(page, '**/layout-failed-emoji.svg', async (route) =>
            route.abort('failed'),
        );
        const harness = await gotoLayoutStabilityHarness(page);
        const item = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.layoutStabilityPostEventId}"]`,
        );
        await expect(item).toBeVisible();
        await Promise.all([
            imageGate.requested,
            videoGate.requested,
            emojiSuccessGate.requested,
            emojiFailureGate.requested,
            expect.poll(() => page.evaluate(() =>
                (window as HarnessWindow).__POST_HISTORY_INTERACTION_LOAD_GATE__?.entered ?? false,
            )).toBe(true),
        ]);
        await scrollHistoryAwayFromTop(page);
        await waitForHistoryContainerHeightToSettle(page);
        await waitForIntersectionObserverSettle(page);

        const captureLayout = () => page.locator('.post-history-container').evaluate(
            (containerElement, eventId) => {
                const container = containerElement as HTMLDivElement;
                const item = container.querySelector<HTMLElement>(
                    `.post-history-item[data-post-history-event-id="${eventId}"]`,
                );
                if (!item) {
                    throw new Error('Layout stability fixture post is missing');
                }
                const rect = (selector: string) => {
                    const element = item.querySelector<HTMLElement>(selector);
                    if (!element) {
                        throw new Error(`Missing measured post-history element: ${selector}`);
                    }
                    const box = element.getBoundingClientRect();
                    return { x: box.x, y: box.y, width: box.width, height: box.height };
                };
                const containerRect = container.getBoundingClientRect();
                const visiblePosts = Array.from(
                    container.querySelectorAll<HTMLElement>('.post-history-item'),
                ).filter((post) => {
                    const box = post.getBoundingClientRect();
                    return box.bottom > containerRect.top + 1 && box.top < containerRect.bottom - 1;
                });
                const watchedPosts = [
                    visiblePosts[0],
                    visiblePosts[Math.floor((visiblePosts.length - 1) / 2)],
                    visiblePosts.at(-1),
                ].filter((post, index, all): post is HTMLElement => !!post && all.indexOf(post) === index)
                    .map((post) => {
                        const box = post.getBoundingClientRect();
                        return {
                            eventId: post.dataset.postHistoryEventId,
                            x: box.x,
                            y: box.y,
                            relativeY: box.top - containerRect.top,
                            height: box.height,
                        };
                    });
                const allPostHeights = Array.from(
                    container.querySelectorAll<HTMLElement>('.post-history-item'),
                ).map((post) => ({
                    eventId: post.dataset.postHistoryEventId,
                    height: post.getBoundingClientRect().height,
                }));
                const heading = document.querySelector('.post-history-heading')?.getBoundingClientRect();
                return {
                    scrollTop: container.scrollTop,
                    scrollHeight: container.scrollHeight,
                    clientHeight: container.clientHeight,
                    containerTop: containerRect.top,
                    headingTop: heading?.top ?? 0,
                    headingHeight: heading?.height ?? 0,
                    directChildren: Array.from(container.children).map((child) => {
                        const box = child.getBoundingClientRect();
                        return { className: child.className, top: box.top, height: box.height };
                    }),
                    item: rect('.post-history-main'),
                    text: rect('.post-history-preview-text'),
                    image: rect('.post-history-image-surface-frame'),
                    video: rect('.post-history-video-media-frame'),
                    footer: rect('.post-preview-footer'),
                    watchedPosts,
                    allPostHeights,
                };
            },
            harness.layoutStabilityPostEventId,
        );
        const before = await captureLayout();
        const postIdsBefore = await historyEventIds(page);
        const watchedEventIds = await getVisiblePostEventIds(page);
        expect(watchedEventIds.length).toBeGreaterThanOrEqual(2);
        const replyFooterBefore = await page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"] .post-preview-footer`,
        ).boundingBox();
        expect(replyFooterBefore).not.toBeNull();
        expect(Math.abs(replyFooterBefore!.height - 36)).toBeLessThanOrEqual(1);
        expect(Math.abs(before.footer.height - 36)).toBeLessThanOrEqual(1);
        expect(await item.locator('.deleted-badge').count()).toBe(1);
        await expect(item.locator('.post-meta')).toHaveCount(0);

        const frameSampling = startPostPositionFrameSampling(
            page,
            watchedEventIds[0],
            24,
            watchedEventIds,
        );
        await frameSampling.started;
        imageGate.release();
        videoGate.release();
        emojiSuccessGate.release();
        emojiFailureGate.release();
        await page.evaluate(() => {
            (window as HarnessWindow).__POST_HISTORY_INTERACTION_LOAD_GATE__?.release?.();
        });
        await Promise.all([
            imageGate.completed,
            videoGate.completed,
            emojiSuccessGate.completed,
            emojiFailureGate.completed,
        ]);

        await expect(item.locator('.post-history-media-surface img')).toHaveCount(1);
        await expect(item.locator('.post-history-video-media-frame video')).toHaveCount(1);
        await expect(item.locator('.post-history-preview-text img.post-history-custom-emoji')).toHaveCount(1);
        await expect(item.locator('.post-history-custom-emoji-failed[role="img"]')).toHaveCount(1);
        await expect(item.locator('.post-preview-reactions-button')).toHaveCount(1);
        expect(await item.locator('.deleted-badge').count()).toBe(1);
        await expect(item.locator('.post-meta')).toHaveCount(0);
        const replyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        await expect(replyItem.locator('.post-preview-replies-badge-button')).toHaveCount(1);

        await frameSampling.stop();
        const frameSamples = await frameSampling.samples;
        expect(frameSamples.length).toBeGreaterThanOrEqual(25);
        expect(frameSamples.every((sample) => watchedEventIds.every((eventId) =>
            sample.watchedPosts.some((post) => post?.eventId === eventId),
        ))).toBe(true);
        expectWatchedPostGeometryStableAcrossFrames(
            frameSamples,
            watchedEventIds,
            watchedEventIds,
        );
        for (const sample of frameSamples) {
            expect(Math.abs(sample.scrollTop - frameSamples[0].scrollTop)).toBeLessThanOrEqual(1);
            expect(Math.abs(sample.scrollHeight - frameSamples[0].scrollHeight)).toBeLessThanOrEqual(1);
            expect(Math.abs(sample.containerTop - frameSamples[0].containerTop)).toBeLessThanOrEqual(1);
            expect(sample.clientHeight).toBe(frameSamples[0].clientHeight);
            expect(Math.abs(sample.headingHeight - frameSamples[0].headingHeight)).toBeLessThanOrEqual(1);
        }

        const after = await captureLayout();
        expect(await historyEventIds(page)).toEqual(postIdsBefore);
        for (const key of ['item', 'text', 'image', 'video', 'footer'] as const) {
            for (const dimension of ['x', 'y', 'width', 'height'] as const) {
                expect(Math.abs(after[key][dimension] - before[key][dimension])).toBeLessThanOrEqual(1);
            }
        }
        expect(Math.abs(after.scrollTop - before.scrollTop)).toBeLessThanOrEqual(1);
        const postHeightChanges = after.allPostHeights.flatMap((post) => {
            const previous = before.allPostHeights.find((item) => item.eventId === post.eventId);
            return previous && Math.abs(previous.height - post.height) > 1
                ? [{ eventId: post.eventId, before: previous.height, after: post.height }]
                : [];
        });
        expect(
            Math.abs(after.scrollHeight - before.scrollHeight),
            JSON.stringify({
                before: { scrollHeight: before.scrollHeight, clientHeight: before.clientHeight },
                after: { scrollHeight: after.scrollHeight, clientHeight: after.clientHeight },
                beforeChildren: before.directChildren,
                afterChildren: after.directChildren,
                postHeightChanges,
            }),
        ).toBeLessThanOrEqual(1);
        expect(Math.abs(after.containerTop - before.containerTop)).toBeLessThanOrEqual(1);
        expect(Math.abs(after.headingTop - before.headingTop)).toBeLessThanOrEqual(1);
        expect(Math.abs(after.headingHeight - before.headingHeight)).toBeLessThanOrEqual(1);
        expect(after.watchedPosts).toHaveLength(before.watchedPosts.length);
        for (const previous of before.watchedPosts) {
            const next = after.watchedPosts.find((post) => post.eventId === previous.eventId);
            expect(next).toBeTruthy();
            expect(Math.abs(next!.x - previous.x)).toBeLessThanOrEqual(1);
            expect(Math.abs(next!.y - previous.y)).toBeLessThanOrEqual(1);
            expect(Math.abs(next!.relativeY - previous.relativeY)).toBeLessThanOrEqual(1);
            expect(Math.abs(next!.height - previous.height)).toBeLessThanOrEqual(1);
        }
        const replyFooterAfter = await replyItem.locator('.post-preview-footer').boundingBox();
        expect(replyFooterAfter).not.toBeNull();
        expect(Math.abs(replyFooterAfter!.height - replyFooterBefore!.height)).toBeLessThanOrEqual(1);
        expect(Math.abs(replyFooterAfter!.height - 36)).toBeLessThanOrEqual(1);
    });

    test('desktop timeline browsing flow works in a real browser', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);
        const dialog = page.locator('.post-history-dialog');
        await expect(dialog).toBeVisible();
        await expectSummary(page, harness.totalPosts);
        await expectCurrentMonthLabel(page, harness.initialMonthLabel);
        await expect(page.locator('.post-history-summary-range')).toHaveCount(0);
        await expectVisiblePostCount(page, 50);

        const viewport = page.viewportSize();
        const dialogBox = await dialog.boundingBox();
        expect(dialogBox).not.toBeNull();
        expect(dialogBox!.width).toBeLessThanOrEqual((viewport?.width ?? 0) - 16);

        await expect(page.getByRole('button', { name: 'さらに古い投稿を表示' })).toHaveCount(0);
        await scrollHistoryToBottom(page);
        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, harness.totalPosts);
        await scrollPostIntoView(page, harness.scrollTargetContent);
        await expectCurrentMonthLabel(page, harness.scrollTargetMonthLabel);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '検索' }).click();
        await page.getByRole('searchbox', { name: '検索' }).fill('alpha');
        await expectSummary(page, harness.matchingPosts);
        await expectVisiblePostCount(page, 50);

        await page.getByRole('button', { name: 'さらに古い検索結果を表示' }).click();
        await expectSummary(page, harness.matchingPosts);
        await expectVisiblePostCount(page, harness.matchingPosts);
        await expect(page.getByRole('button', { name: '新しい検索結果を表示' })).toHaveCount(0);
    });

    test('partial search results remain operable and anchored before the final count is available', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?search-progress=1');
        await page.waitForFunction(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready);
        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '検索' }).click();
        const input = page.getByRole('searchbox', { name: '検索' });
        await input.fill('alpha');
        await page.waitForFunction(() => (window as HarnessWindow).__POST_HISTORY_SEARCH_SCAN_GATE__?.entered);
        await expectVisiblePostCount(page, 25);
        await expect(page.locator('.post-history-summary-count')).toHaveText('件数を確認中...');
        await expect(input).toHaveAttribute('aria-busy', 'true');
        await expect(page.getByRole('button', { name: 'さらに古い検索結果を表示' })).toHaveCount(0);
        const first = page.locator('.post-history-item').first();
        const action = first.getByRole('button', { name: 'アクションを表示' });
        await expect(action).toBeEnabled();
        await action.click();
        await expect(page.getByRole('menuitem', { name: '前後の投稿を表示' })).toBeVisible();
        await page.keyboard.press('Escape');
        await page.locator('.post-history-container').evaluate((element) => { element.scrollTop = 80; });
        const offset = () => first.evaluate((element) => element.getBoundingClientRect().top - element.closest('.post-history-container')!.getBoundingClientRect().top);
        const before = await offset();
        await page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_SEARCH_SCAN_GATE__?.release?.());
        await expectSummary(page, 55);
        await expectVisiblePostCount(page, 50);
        await expect(input).toHaveAttribute('aria-busy', 'false');
        expect(Math.abs(await offset() - before)).toBeLessThanOrEqual(1);
        await page.getByRole('button', { name: 'さらに古い検索結果を表示' }).click();
        await expectVisiblePostCount(page, 55);
    });

    test('Sensitive partial search keeps a revealed body when the final count completes', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?search-progress=1&sensitive-preview=1');
        await page.waitForFunction(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready);
        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '検索' }).click();
        await page.getByRole('searchbox', { name: '検索' }).fill('sensitive preview body');
        await page.waitForFunction(() => (window as HarnessWindow).__POST_HISTORY_SEARCH_SCAN_GATE__?.entered);
        const result = page.locator('.post-history-item').first();
        await result.getByRole('button', { name: '本文を表示' }).click();
        await expect(result.getByText('playwright sensitive preview body')).toBeVisible();
        await expect(page.locator('.post-history-summary-count')).toHaveText('件数を確認中...');
        await page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_SEARCH_SCAN_GATE__?.release?.());
        await expectSummary(page, 1);
        await expect(result.getByText('playwright sensitive preview body')).toBeVisible();
        await expect(result.getByRole('button', { name: '本文を表示' })).toHaveCount(0);
    });

    test('closing during partial search stops further batch reads and resets the reopened dialog', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?search-progress=1');
        await page.waitForFunction(() => (window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready);
        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '検索' }).click();
        await page.getByRole('searchbox', { name: '検索' }).fill('alpha');
        await page.waitForFunction(() => (window as HarnessWindow).__POST_HISTORY_SEARCH_SCAN_GATE__?.entered);
        await expectVisiblePostCount(page, 25);
        await page.getByRole('button', { name: '閉じる', exact: true }).click();
        await expect(page.getByTestId('post-history-mounted')).toHaveCount(0);
        await page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_SEARCH_SCAN_GATE__?.release?.());
        await page.waitForFunction(() => (window as HarnessWindow).__POST_HISTORY_SEARCH_SCAN_GATE__?.finished);
        await page.getByTestId('post-history-reopen').click();
        await expect(page.getByRole('searchbox', { name: '検索' })).toHaveCount(0);
        await expectVisiblePostCount(page, 50);
        expect(await page.evaluate(() => (window as HarnessWindow).__POST_HISTORY_SEARCH_SCAN_GATE__?.reads)).toBe(2);
    });

    test('closing and reopening the dialog resets post history search state', async ({ page }) => {
        const harness = await gotoHarness(page);

        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, 50);

        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '検索' }).click();
        await page.getByRole('searchbox', { name: '検索' }).fill('alpha');
        await expectSummary(page, harness.matchingPosts);
        await expectVisiblePostCount(page, 50);

        await page.getByRole('button', { name: 'さらに古い検索結果を表示' }).click();
        await expectSummary(page, harness.matchingPosts);
        await expectVisiblePostCount(page, harness.matchingPosts);

        await expect(page.getByTestId('post-history-mounted')).toHaveCount(1);
        await page.getByRole('button', { name: '閉じる', exact: true }).click();
        await expect(page.locator('.post-history-dialog')).toHaveCount(0);
        await expect(page.getByTestId('post-history-mounted')).toHaveCount(0);

        await page.getByTestId('post-history-reopen').click();
        await expect(page.getByTestId('post-history-mounted')).toHaveCount(1);
        await expect(page.locator('.post-history-dialog')).toBeVisible();
        await expect(page.getByRole('searchbox', { name: '検索' })).toHaveCount(0);
        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, 50);
        await expect(page.getByRole('button', { name: 'さらに古い投稿を表示' })).toHaveCount(0);
        await expect(page.locator('.post-history-auto-load-sentinel:not(.post-history-auto-load-newer-sentinel)')).toBeVisible();
        await expect(page.getByRole('button', { name: 'さらに古い検索結果を表示' })).toHaveCount(0);
    });

    test('desktop newer prepend keeps the current post anchored', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);

        await jumpToDate(page, harness.jumpDate);

        const newerButton = page.getByRole('button', { name: '新しい投稿を表示' });
        await expect(newerButton).toBeVisible();
        const before = await getFirstVisiblePostSnapshot(page);
        expect(before).not.toBeNull();

        await newerButton.click();

        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, 64);
        const after = await getPostSnapshotByEventId(page, before!.eventId);
        expect(after).not.toBeNull();
        expect(after!.eventId).toBe(before!.eventId);
        expect(Math.abs(after!.offsetTop - before!.offsetTop)).toBeLessThanOrEqual(1);
    });

    test('reaction button presence does not shift other footer actions', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        const harness = await gotoHarness(page);

        const reactionPost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.reactionPostEventId}"]`,
        );
        const plainPost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.plainPostEventId}"]`,
        );

        await expect(reactionPost.locator('.post-preview-reactions-button')).toHaveCount(1);
        await expect(plainPost.locator('.post-preview-reactions-button')).toHaveCount(0);

        const topReactionPositions = await getFooterActionPositions(page, harness.reactionPostEventId);
        const topPlainPositions = await getFooterActionPositions(page, harness.plainPostEventId);

        expect(topReactionPositions.hasReactionButton).toBe(true);
        expect(topPlainPositions.hasReactionButton).toBe(false);
        expect(Math.abs(topReactionPositions.replyCenterX - topPlainPositions.replyCenterX)).toBeLessThanOrEqual(1);
        expect(topReactionPositions.repliesRight).toBeLessThanOrEqual(topReactionPositions.quoteX + 1);
        expect(topPlainPositions.repliesRight).toBeLessThanOrEqual(topPlainPositions.quoteX + 1);
        expect(Math.abs(topReactionPositions.repliesX - topPlainPositions.repliesX)).toBeLessThanOrEqual(1);
        expect(Math.abs(topReactionPositions.quoteX - topPlainPositions.quoteX)).toBeLessThanOrEqual(1);
        expect(Math.abs(topReactionPositions.menuX - topPlainPositions.menuX)).toBeLessThanOrEqual(1);

        await scrollPostIntoViewByEventId(page, harness.scrolledReactionPostEventId);

        const scrolledReactionPositions = await getFooterActionPositions(page, harness.scrolledReactionPostEventId);
        const scrolledPlainPositions = await getFooterActionPositions(page, harness.scrolledPlainPostEventId);

        expect(scrolledReactionPositions.hasReactionButton).toBe(true);
        expect(scrolledPlainPositions.hasReactionButton).toBe(false);
        expect(Math.abs(scrolledReactionPositions.replyCenterX - scrolledPlainPositions.replyCenterX)).toBeLessThanOrEqual(1);
        expect(scrolledReactionPositions.repliesRight).toBeLessThanOrEqual(scrolledReactionPositions.quoteX + 1);
        expect(scrolledPlainPositions.repliesRight).toBeLessThanOrEqual(scrolledPlainPositions.quoteX + 1);
        expect(Math.abs(scrolledReactionPositions.repliesX - scrolledPlainPositions.repliesX)).toBeLessThanOrEqual(1);
        expect(Math.abs(scrolledReactionPositions.quoteX - scrolledPlainPositions.quoteX)).toBeLessThanOrEqual(1);
        expect(Math.abs(scrolledReactionPositions.menuX - scrolledPlainPositions.menuX)).toBeLessThanOrEqual(1);
    });

    test('post history action columns align across posts and related cards without clipping', async ({ page }, testInfo) => {
        test.setTimeout(120_000);
        const harness = await gotoHarness(page);
        const initialViewport = page.viewportSize();
        expect(initialViewport).not.toBeNull();
        const viewportWidths = [...new Set([initialViewport!.width, 360])];

        for (const width of viewportWidths) {
            await page.setViewportSize({ width, height: 1000 });

            const plainPost = page.locator(
                `.post-history-item[data-post-history-event-id="${harness.plainPostEventId}"]`,
            );
            const reactionPost = page.locator(
                `.post-history-item[data-post-history-event-id="${harness.reactionPostEventId}"]`,
            );
            const plainCenters = await getActionColumnCenters(plainPost);
            const plainButtonCenters = await getReplyAndQuoteButtonCenters(plainPost);
            const firstColumnGap = plainCenters[1].centerX - plainCenters[0].centerX;
            const secondColumnGap = plainCenters[2].centerX - plainCenters[1].centerX;
            const actionGridWidth = plainCenters[2].right - plainCenters[0].left;
            if (actionGridWidth >= 216) {
                expect(Math.abs(firstColumnGap - secondColumnGap)).toBeLessThanOrEqual(1);
            }
            const reactionCenters = await getActionColumnCenters(reactionPost);
            for (let index = 0; index < plainCenters.length; index += 1) {
                expect(Math.abs(plainCenters[index].centerX - reactionCenters[index].centerX))
                    .toBeLessThanOrEqual(1);
            }
            const replyCountPost = page.locator(
                `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
            );
            await expect(replyCountPost.locator('.post-preview-action-buttons-group')
                .first().locator('.post-preview-replies-badge-button')).toHaveCount(1);
            const replyCountCenters = await getActionColumnCenters(replyCountPost);
            const replyCountButtonCenters = await getReplyAndQuoteButtonCenters(replyCountPost);
            expect(Math.abs(plainButtonCenters.reply - replyCountButtonCenters.reply))
                .toBeLessThanOrEqual(1);
            expect(Math.abs(plainButtonCenters.quote - replyCountButtonCenters.quote))
                .toBeLessThanOrEqual(1);
            for (let index = 0; index < plainCenters.length; index += 1) {
                expect(Math.abs(plainCenters[index].centerX - replyCountCenters[index].centerX))
                    .toBeLessThanOrEqual(1);
            }

            const quoteHost = page.locator(
                `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
            );
            const quoteCard = quoteHost.locator('.post-history-related-card')
                .filter({ hasText: harness.quoteContent });
            await expect(quoteCard).toBeVisible();
            const quoteCenters = await getActionColumnCenters(quoteCard);
            const quoteButtonCenters = await getReplyAndQuoteButtonCenters(quoteCard);
            expect(Math.abs(plainButtonCenters.reply - quoteButtonCenters.reply))
                .toBeLessThanOrEqual(5);
            expect(Math.abs(plainButtonCenters.quote - quoteButtonCenters.quote))
                .toBeLessThanOrEqual(5);
            for (let index = 0; index < 3; index += 1) {
                expect(Math.abs(plainCenters[index].centerX - quoteCenters[index].centerX))
                    .toBeLessThanOrEqual(5);
            }

            const threadHost = page.locator(
                `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
            );
            await scrollPostIntoViewByEventId(page, harness.replyParentEventId);
            const replyCard = threadHost.locator('.post-history-related-card')
                .filter({ hasText: harness.replyContent });
            if (!(await replyCard.isVisible())) {
                await threadHost.getByRole('button', { name: /返信 1件を表示/ }).click();
            }
            await expect(replyCard).toBeVisible();
            const childCenters = await getActionColumnCenters(replyCard);
            const childButtonCenters = await getReplyAndQuoteButtonCenters(replyCard);
            expect(Math.abs(plainButtonCenters.reply - childButtonCenters.reply))
                .toBeLessThanOrEqual(5);
            expect(Math.abs(plainButtonCenters.quote - childButtonCenters.quote))
                .toBeLessThanOrEqual(5);
            for (let index = 0; index < 3; index += 1) {
                expect(Math.abs(plainCenters[index].centerX - childCenters[index].centerX))
                    .toBeLessThanOrEqual(5);
            }

            const nestedToggle = replyCard.getByRole('button', { name: /返信 1件を表示/ });
            const grandchildCard = threadHost.locator('.post-history-related-card')
                .filter({ hasText: 'playwright nested reply' });
            if (!(await grandchildCard.isVisible())) {
                await nestedToggle.click();
            }
            await expect(grandchildCard).toBeVisible();
            const grandchildCenters = await getActionColumnCenters(grandchildCard);
            const grandchildButtonCenters = await getReplyAndQuoteButtonCenters(grandchildCard);
            expect(Math.abs(plainButtonCenters.reply - grandchildButtonCenters.reply))
                .toBeLessThanOrEqual(5);
            expect(Math.abs(plainButtonCenters.quote - grandchildButtonCenters.quote))
                .toBeLessThanOrEqual(5);
            for (let index = 0; index < 3; index += 1) {
                expect(Math.abs(plainCenters[index].centerX - grandchildCenters[index].centerX))
                    .toBeLessThanOrEqual(5);
            }

            const layoutCards = [plainPost, quoteCard, replyCard, grandchildCard];
            const footerLayouts = await Promise.all(layoutCards.map(getFooterLayout));
            for (const layout of footerLayouts) {
                expect(layout.footer.height).toBeGreaterThanOrEqual(35);
                expect(layout.footer.height).toBeLessThanOrEqual(37);
                expect(layout.cells).toHaveLength(3);
                expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
                for (const button of layout.buttons) {
                    expect(button.x).toBeGreaterThanOrEqual(layout.footer.x - 1);
                    expect(button.right).toBeLessThanOrEqual(layout.footer.right + 1);
                    expect(button.y).toBeGreaterThanOrEqual(layout.footer.y - 1);
                    expect(button.bottom).toBeLessThanOrEqual(layout.footer.bottom + 1);
                    expect(button.height).toBeGreaterThanOrEqual(35);
                    expect(button.height).toBeLessThanOrEqual(37);
                }
                for (let left = 0; left < layout.buttons.length; left += 1) {
                    for (let right = left + 1; right < layout.buttons.length; right += 1) {
                        const first = layout.buttons[left];
                        const second = layout.buttons[right];
                        const overlaps = first.x < second.right - 1 &&
                            second.x < first.right - 1 &&
                            first.y < second.bottom - 1 &&
                            second.y < first.bottom - 1;
                        expect(overlaps, `${first.label} overlaps ${second.label}`).toBe(false);
                    }
                }
                if (layout.date) {
                    for (const button of layout.buttons) {
                        const dateOverlaps = layout.date.x < button.right - 1 &&
                            button.x < layout.date.right - 1 &&
                            layout.date.y < button.bottom - 1 &&
                            button.y < layout.date.bottom - 1;
                        expect(dateOverlaps, `date overlaps ${button.label}`).toBe(false);
                    }
                }
            }
            for (const index of [1, 2, 3]) {
                expect(Math.abs(footerLayouts[0].footer.width - footerLayouts[index].footer.width))
                    .toBeLessThanOrEqual(2);
                for (let cell = 0; cell < 3; cell += 1) {
                    expect(Math.abs(footerLayouts[0].cells[cell]!.x - footerLayouts[index].cells[cell]!.x))
                        .toBeLessThanOrEqual(3);
                    expect(Math.abs(footerLayouts[0].cells[cell]!.width - footerLayouts[index].cells[cell]!.width))
                        .toBeLessThanOrEqual(3);
                }
            }

            for (const card of [reactionPost, quoteCard, replyCard, grandchildCard]) {
                await expectReactionContentsVerticallyCentered(card, false);
            }

            const relatedWidths = await Promise.all([quoteCard, replyCard, grandchildCard].map((card) =>
                card.evaluate((element) => (element as HTMLElement).getBoundingClientRect().width),
            ));
            expect(Math.max(...relatedWidths) - Math.min(...relatedWidths)).toBeLessThanOrEqual(2);

            const layoutState = await page.evaluate(() => {
                const dialog = document.querySelector('.post-history-dialog');
                const cards = Array.from(document.querySelectorAll('.post-history-related-card'));
                return {
                    viewportWidth: document.documentElement.clientWidth,
                    documentWidth: document.documentElement.scrollWidth,
                    cards: cards.map((card) => {
                        const bounds = card.getBoundingClientRect();
                        return {
                            left: bounds.left,
                            right: bounds.right,
                            scrollWidth: (card as HTMLElement).scrollWidth,
                            clientWidth: (card as HTMLElement).clientWidth,
                        };
                    }),
                    dialogWidth: dialog?.getBoundingClientRect().width ?? 0,
                };
            });
            expect(layoutState.documentWidth).toBeLessThanOrEqual(layoutState.viewportWidth + 1);
            expect(layoutState.dialogWidth).toBeGreaterThan(0);
            for (const card of layoutState.cards) {
                expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
                expect(card.left).toBeGreaterThanOrEqual(-1);
                expect(card.right).toBeLessThanOrEqual(layoutState.viewportWidth + 1);
            }

            await page.screenshot({
                path: testInfo.outputPath(`post-history-actions-${testInfo.project.name}-${width}.png`),
                fullPage: false,
            });
        }
    });

    test('related quote, reply, and nested reply cards show their own reaction details', async ({ page }, testInfo) => {
        const harness = await gotoHarness(page);
        const quoteHost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteHost.locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        await expect(quoteCard).toBeVisible();
        await expect(quoteCard.locator('.post-preview-reactions-button')).toHaveText(/1/);
        await quoteCard.locator('.post-preview-reactions-button').click();
        await expect(quoteCard.locator('.post-preview-reaction-chip')).toHaveCount(1);

        const threadHost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        await scrollPostIntoViewByEventId(page, harness.replyParentEventId);
        const replyCard = threadHost.locator('.post-history-related-card')
            .filter({ hasText: harness.replyContent });
        if (!(await replyCard.isVisible())) {
            await threadHost.getByRole('button', { name: /返信 1件を表示/ }).click();
        }
        await expect(replyCard).toBeVisible();
        await expect(replyCard.locator('.post-preview-reactions-button')).toHaveText(/2/);
        await replyCard.locator('.post-preview-reactions-button').click();
        await expect(replyCard.locator('.post-preview-reaction-chip')).toHaveCount(1);
        await expect(replyCard.locator('.post-preview-reaction-count')).toHaveText('2');

        const nestedToggle = replyCard.getByRole('button', { name: /返信 1件を表示/ });
        const grandchildCard = threadHost.locator('.post-history-related-card')
            .filter({ hasText: 'playwright nested reply' });
        if (!(await grandchildCard.isVisible())) {
            await nestedToggle.click();
        }
        await expect(grandchildCard).toBeVisible();
        await expect(grandchildCard.locator('.post-preview-reactions-button')).toHaveText(/3/);
        const grandchildWidthBeforeDetails = await grandchildCard.evaluate((element) =>
            (element as HTMLElement).getBoundingClientRect().width,
        );
        const grandchildFooterBeforeDetails = await getFooterLayout(grandchildCard);
        await grandchildCard.locator('.post-preview-reactions-button').click();
        await expect(grandchildCard.locator('.post-preview-reaction-chip')).toHaveCount(1);
        await expect(grandchildCard.locator('.post-preview-reaction-count')).toHaveText('3');
        const grandchildWidthAfterDetails = await grandchildCard.evaluate((element) =>
            (element as HTMLElement).getBoundingClientRect().width,
        );
        const grandchildFooterAfterDetails = await getFooterLayout(grandchildCard);
        expect(Math.abs(grandchildWidthAfterDetails - grandchildWidthBeforeDetails)).toBeLessThanOrEqual(1);
        expect(Math.abs(grandchildFooterAfterDetails.footer.width - grandchildFooterBeforeDetails.footer.width))
            .toBeLessThanOrEqual(1);
        expect(grandchildFooterAfterDetails.footer.height).toBeGreaterThanOrEqual(35);
        expect(grandchildFooterAfterDetails.scrollWidth)
            .toBeLessThanOrEqual(grandchildFooterAfterDetails.clientWidth + 1);
        await page.screenshot({
            path: testInfo.outputPath(`post-history-related-reactions-${testInfo.project.name}.png`),
            fullPage: false,
        });
    });

    test('reaction heart and count remain vertically centered in normal and related cards', async ({ page }) => {
        const harness = await gotoHarness(page);
        const normalCard = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.reactionPostEventId}"]`,
        );
        const quoteHost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteHost.locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        const threadHost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        await scrollPostIntoViewByEventId(page, harness.replyParentEventId);
        const replyCard = threadHost.locator('.post-history-related-card')
            .filter({ hasText: harness.replyContent });
        if (!(await replyCard.isVisible())) {
            await threadHost.getByRole('button', { name: /返信 1件を表示/ }).click();
        }
        const nestedToggle = replyCard.getByRole('button', { name: /返信 1件を表示/ });
        const grandchildCard = threadHost.locator('.post-history-related-card')
            .filter({ hasText: 'playwright nested reply' });
        if (!(await grandchildCard.isVisible())) {
            await nestedToggle.click();
        }

        for (const card of [normalCard, quoteCard, replyCard, grandchildCard]) {
            const button = card.locator('.post-preview-reactions-button');
            await expect(button).toBeVisible();
            await expectReactionContentsVerticallyCentered(card, false);
            await button.click();
            await expect(card.locator('.post-preview-reaction-chip').first()).toBeVisible();
            await expectReactionContentsVerticallyCentered(card, true);
            await button.click();
            await expectReactionContentsVerticallyCentered(card, false);
        }
    });

    test('an own post moving from quote-only to the timeline uses the normal reaction state in both cards', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?self-quote-transition=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );
        const quoteHost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteHost.locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        const ownerPost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quoteEventId}"]`,
        );

        await expect(quoteCard).toBeVisible();
        await expect(ownerPost).toHaveCount(0);
        await expect(quoteCard.locator('.post-preview-reactions-button')).toHaveText(/1/);

        await page.evaluate(async () => {
            await (window as HarnessWindow).__POST_HISTORY_REACTION_TEST_CONTROL__!
                .addReactionToQuote();
        });
        await scrollHistoryToBottom(page);
        await expect(ownerPost).toBeVisible();
        await expect.poll(async () =>
            ownerPost.locator('.post-preview-reactions-button').textContent(),
        ).toMatch(/2/);
        await expect(quoteCard.locator('.post-preview-reactions-button')).toHaveText(/2/);

        await ownerPost.locator('.post-preview-reactions-button').click();
        await expect(ownerPost.locator('.post-preview-reaction-count')).toHaveText('2');
        await expect(quoteCard.locator('.post-preview-reaction-count')).toHaveText('2');
    });

    test('kind 42 quote cards show reaction details while reply and quote actions remain unavailable', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?kind42-quote=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );
        const quoteHost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteHost.locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });

        await expect(quoteCard).toBeVisible();
        const reactionButton = quoteCard.locator('.post-preview-reactions-button');
        await expect(reactionButton).toHaveText(/1/);
        await expect(quoteCard.locator('.post-preview-reply-action-cell button')).toHaveCount(0);
        await expect(quoteCard.locator('.post-preview-quote-action-cell button')).toHaveCount(0);
        await expect(quoteCard.locator('.post-preview-footer-right button', { hasText: '' })).toHaveCount(1);
        await reactionButton.click();
        await expect(quoteCard.locator('.post-preview-reaction-chip')).toHaveCount(1);
        await expect(quoteCard.locator('.post-preview-reaction-count')).toHaveText('1');
    });

    test('Content Warning fits post, quote, reply, and narrow nested previews independently of viewport width', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 820 });
        await page.goto('post-history-dialog-playwright.html?sensitive-preview=1&cw-layout=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );

        const sensitivePost = page.locator('.post-history-item').first();
        await expectContentWarningLayout(sensitivePost);

        const quoteHost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteHost.locator('.post-history-related-card').first();
        await expectContentWarningLayout(quoteCard);

        const threadHost = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        await scrollPostIntoViewByEventId(page, harness.replyParentEventId);
        const warningCards = threadHost.locator(
            '.post-history-related-card:has(.content-warning-prompt)',
        );
        if (!(await warningCards.first().isVisible())) {
            await threadHost.getByRole('button', { name: /返信 1件を表示/ }).click();
        }
        await expect(warningCards).toHaveCount(1);
        const replyCard = warningCards.nth(0);
        await expectContentWarningLayout(replyCard);

        const nestedReplyCard = warningCards.nth(1);
        if (!(await nestedReplyCard.isVisible())) {
            await replyCard.getByRole('button', { name: /返信 1件を表示/ }).click();
        }
        await expect(warningCards).toHaveCount(2);
        await expectContentWarningLayout(nestedReplyCard);

        await page.setViewportSize({ width: 1024, height: 900 });
        await nestedReplyCard.evaluate((element) => {
            const card = element as HTMLElement;
            card.style.width = '140px';
            card.style.maxWidth = '140px';
            card.style.boxSizing = 'border-box';
        });
        await expectContentWarningLayout(nestedReplyCard);
    });

    test('Sensitive payload history previews hide body and media until explicit reveal', async ({ page }) => {
        const emojiRequests: string[] = [];
        await page.route('https://example.com/sensitive-emoji.svg', async (route) => {
            emojiRequests.push(route.request().url());
            await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" fill="blue"/></svg>' });
        });
        await page.goto('post-history-dialog-playwright.html?sensitive-preview=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const post = page.locator('.post-history-item').first();

        await expect(post.locator('.content-warning-prompt')).toBeVisible();
        await expect(post.locator('.content-warning-copy')).toContainText('Sensitive demo');
        await expect(post.getByText('playwright sensitive preview body')).toHaveCount(0);
        await expect(post.locator('.post-preview-media')).toHaveCount(0);
        await expect(post.locator('img.post-history-custom-emoji')).toHaveCount(0);
        expect(emojiRequests).toHaveLength(0);

        await post.getByRole('button', { name: '本文を表示' }).click();
        await expect(post.getByText('playwright sensitive preview body')).toBeVisible();
        await expect(post.locator('.post-preview-media')).toBeVisible();
        await expect(post.locator('img.post-history-custom-emoji')).toBeVisible();
        expect(emojiRequests.length).toBeGreaterThan(0);

        await page.evaluate(async () => {
            const harness = (window as any).__POST_HISTORY_HARNESS__;
            await harness.deleteSensitivePayload();
        });
        await expect(post.getByText('playwright sensitive preview body')).toHaveCount(0);
        await expect(post.locator('.post-preview-media')).toHaveCount(0);
        await expect(post.locator('img.post-history-custom-emoji')).toHaveCount(0);
        await expect(post.locator('.content-warning-prompt')).toBeVisible();
    });

    test('a parent Content Warning gates its quote card until the parent is revealed', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?cw-parent-quote=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );
        const parent = page.locator(`.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`);
        await scrollPostIntoViewByEventId(page, harness.quotePostEventId);

        await expect(parent.locator('.content-warning-prompt')).toBeVisible();
        await expect(parent.locator('.post-history-related-card')).toHaveCount(0);
        await expect(parent.locator('.post-preview-quotes')).toHaveCount(0);
        await parent.locator('.content-warning-reveal-button').click();
        await expect(parent.locator('.post-history-related-card').filter({ hasText: harness.quoteContent })).toBeVisible();
    });

    test('parent and quoted Content Warnings reveal independently', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?cw-parent-quote=1&cw-layout=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );
        const parent = page.locator(`.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`);
        await scrollPostIntoViewByEventId(page, harness.quotePostEventId);

        await expect(parent.locator('.post-history-related-card')).toHaveCount(0);
        await parent.getByRole('button', { name: '本文を表示' }).click();
        const quote = parent.locator('.post-history-related-card').first();
        await expect(quote).toBeVisible();
        await expect(quote.locator('.content-warning-prompt')).toBeVisible();
        await expect(quote.getByText(harness.quoteContent)).toHaveCount(0);
        await quote.getByRole('button', { name: '本文を表示' }).click();
        await expect(quote.getByText(harness.quoteContent)).toBeVisible();
    });

    test('a non-CW parent continues to render its quote immediately', async ({ page }) => {
        const harness = await gotoHarness(page);
        const parent = page.locator(`.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`);
        await scrollPostIntoViewByEventId(page, harness.quotePostEventId);

        await expect(parent.locator('.content-warning-prompt')).toHaveCount(0);
        await expect(parent.locator('.post-history-related-card').filter({ hasText: harness.quoteContent })).toBeVisible();
    });

    test('ordinary post history continues to strip only q-matching inline quote URIs', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?inline-quote-uri=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );
        const parent = page.locator(`.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`);
        await scrollPostIntoViewByEventId(page, harness.quotePostEventId);
        const content = parent.locator('.post-content-preview-standard > .post-preview-content');

        await expect(content).not.toContainText(harness.matchingSensitiveQuoteUri);
        await expect(content).toContainText(harness.unmatchedSensitiveQuoteUri);
        await expect(parent.locator('.post-history-related-card')).toBeVisible();
    });

    test('Sensitive payload quote remains gated until verified reveal succeeds', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?sensitive-preview=1&sensitive-quote=1&cw-layout=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const harness = await page.evaluate<HarnessState>(() =>
            (window as HarnessWindow).__POST_HISTORY_HARNESS__ as HarnessState,
        );
        const parent = page.locator('.post-history-item').first();
        await expect(parent.locator('.content-warning-prompt')).toBeVisible();
        await expect(parent.locator('.post-history-related-card')).toHaveCount(0);
        await expect(parent.locator('.post-preview-content')).toHaveCount(0);
        await parent.locator('.content-warning-reveal-button').click();
        const parentContent = parent.locator('.post-preview-content');
        await expect(parentContent).toContainText(harness.unmatchedSensitiveQuoteUri);
        await expect(parentContent).not.toContainText(harness.matchingSensitiveQuoteUri);
        const quote = parent.locator('.post-history-related-card').first();
        await expect(quote).toBeVisible();
        await expect(quote.locator('.content-warning-prompt')).toBeVisible();
        await expect(quote.getByText(harness.quoteContent)).toHaveCount(0);
        await quote.getByRole('button', { name: '本文を表示' }).click();
        await expect(quote.getByText(harness.quoteContent)).toBeVisible();
    });

    test('Sensitive payload quote stays hidden when payload reveal fails', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?sensitive-preview=1&sensitive-quote=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const parent = page.locator('.post-history-item').first();
        await page.evaluate(async () => {
            await (window as any).__POST_HISTORY_HARNESS__.deleteSensitivePayload();
        });

        await parent.locator('.content-warning-reveal-button').click();
        await expect(parent.getByRole('status')).toContainText('取得できません');
        await expect(parent.locator('.post-history-related-card')).toHaveCount(0);
        await expect(parent.locator('.post-preview-quotes')).toHaveCount(0);
    });

    test('Sensitive payload event JSON shows the Structure and only its verified Payload', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?sensitive-preview=1&long-raw-json=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const post = page.locator('.post-history-item').first();
        await post.getByRole('button', { name: 'アクションを表示' }).click();
        await visiblePostHistoryActionMenu(page)
            .getByRole('menuitem', { name: 'イベントJSONを表示' })
            .click();

        const dialog = page.getByRole('dialog', { name: 'イベントJSON' });
        await expect(dialog).toBeVisible();
        const tabs = dialog.getByRole('tab');
        await expect(tabs).toHaveText(['Structure', 'Payload']);
        await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
        await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'false');
        const geometry = async () => page.evaluate(() => {
            const dialogElement = document.querySelector<HTMLElement>(
                '[role="dialog"].post-history-raw-json-dialog',
            );
            const heading = dialogElement?.querySelector<HTMLElement>(".raw-json-heading");
            const tabList = dialogElement?.querySelector<HTMLElement>(".raw-json-tabs");
            const footer = dialogElement?.querySelector<HTMLElement>(".dialog-footer");
            const rect = (element: HTMLElement | null | undefined) => {
                if (!element) return null;
                const { top, height } = element.getBoundingClientRect();
                return { top, height };
            };
            return {
                dialog: rect(dialogElement),
                heading: rect(heading),
                tabs: rect(tabList),
                footer: rect(footer),
            };
        });
        const structureGeometry = await geometry();

        const rawJson = dialog.locator('.raw-json-panel[data-state="active"] .raw-json-content');
        const structure = JSON.parse((await rawJson.textContent()) ?? 'null');
        expect(structure.kind).toBe(1);
        expect(structure.content).toBe('');
        expect((await rawJson.textContent())?.trimStart().startsWith('{\n')).toBe(true);
        const expectWrappedAndScrollable = async () => {
            const metrics = await rawJson.evaluate((element) => {
                const style = getComputedStyle(element);
                return {
                    whiteSpace: style.whiteSpace,
                    overflowWrap: style.overflowWrap,
                    scrollWidth: element.scrollWidth,
                    clientWidth: element.clientWidth,
                    scrollHeight: element.scrollHeight,
                    clientHeight: element.clientHeight,
                };
            });
            expect(metrics.whiteSpace).toBe('pre-wrap');
            expect(metrics.overflowWrap).toBe('anywhere');
            expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
            expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
        };
        await expectWrappedAndScrollable();
        const payloadId = structure.tags.find(([name]: string[]) => name === 'c')?.[1];
        expect(payloadId).toBeTruthy();

        await tabs.nth(1).click();
        await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
        expect(await geometry()).toEqual(structureGeometry);
        await expect.poll(async () => {
            const text = await rawJson.textContent();
            return text ? JSON.parse(text).id : null;
        }).toBe(payloadId);
        expect(await geometry()).toEqual(structureGeometry);
        const payload = JSON.parse((await rawJson.textContent()) ?? 'null');
        expect((await rawJson.textContent())?.startsWith('{\n  "id":')).toBe(true);
        await expectWrappedAndScrollable();
        expect(payload.kind).toBe(36);
        expect(payload.tags).toEqual([['k', '1']]);
        expect(payload.content).toContain('playwright sensitive preview body :party: https://example.com/post-history-0.jpg');
        expect(payload.content.length).toBeGreaterThan(10_000);
        expect(payload.content).not.toContain('unrelated payload must not appear');

        await tabs.nth(0).click();
        await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
        expect(await geometry()).toEqual(structureGeometry);
        await expect(dialog.getByRole('alert')).toHaveCount(0);
        await expect(dialog.getByRole('button', { name: /再取得|retry/i })).toHaveCount(0);
    });

    test('ordinary event JSON wraps long strings and preserves formatted JSON', async ({ page }) => {
        await page.goto('post-history-dialog-playwright.html?long-raw-json=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        const post = page.locator('.post-history-item').first();
        await post.getByRole('button', { name: 'アクションを表示' }).click();
        await visiblePostHistoryActionMenu(page)
            .getByRole('menuitem', { name: 'イベントJSONを表示' })
            .click();

        const dialog = page.getByRole('dialog', { name: 'イベントJSON' });
        const rawJson = dialog.locator('.raw-json-content');
        await expect(rawJson).toBeVisible();
        const renderedJson = await rawJson.textContent() ?? '';
        const event = JSON.parse(renderedJson);
        expect(renderedJson.trimStart().startsWith('{\n')).toBe(true);
        expect(renderedJson).toContain('\n  "content":');
        expect(event.kind).toBe(1);
        expect(event.content).toContain(`ordinary long content ${'x'.repeat(100)}`);
        expect(event.content.length).toBeGreaterThan(10_000);
        expect(await rawJson.evaluate((element) => {
            const style = getComputedStyle(element);
            return {
                whiteSpace: style.whiteSpace,
                overflowWrap: style.overflowWrap,
                scrollWidth: element.scrollWidth,
                clientWidth: element.clientWidth,
            };
        })).toEqual(expect.objectContaining({
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
        }));
        const width = await rawJson.evaluate((element) => ({
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
        }));
        expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth + 1);
    });

    test('Sensitive payloads found by local search remain behind the normal CW gate', async ({ page }) => {
        await page.route('https://example.com/sensitive-emoji.svg', (route) => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"/>' }));
        await page.goto('post-history-dialog-playwright.html?sensitive-preview=1');
        await page.waitForFunction(() => Boolean((window as HarnessWindow).__POST_HISTORY_HARNESS__?.ready));
        await page.getByRole('button', { name: '投稿履歴メニューを開く' }).click();
        await page.getByRole('menuitem', { name: '検索' }).click();
        await page.getByRole('searchbox', { name: '検索' }).fill('sensitive preview body');
        // Search initially keeps normal-history rows until its first page is ready.
        await expect(page.locator('.post-history-item')).toHaveCount(1);
        await expect(page.locator('.post-history-container')).toHaveAttribute('aria-busy', 'false');

        const result = page.locator('.post-history-item').first();
        await expect(result.locator('.content-warning-prompt')).toBeVisible();
        await expect(result.getByText('playwright sensitive preview body')).toHaveCount(0);
        await expect(result.locator('.post-preview-media')).toHaveCount(0);

        await result.getByRole('button', { name: '本文を表示' }).click();
        await expect(result.getByText('playwright sensitive preview body')).toBeVisible();
        await expect(result.locator('.post-preview-media')).toBeVisible();
    });

    test('quote preview uses the shared 36px three-region footer without horizontal overflow', async ({ page }) => {
        const harness = await gotoHarness(page);
        const historyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const relatedCard = historyItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        const footer = relatedCard.locator('.post-preview-footer');

        await expect(relatedCard).toBeVisible();
        await expect(footer).toHaveCount(1);
        await expect(footer.locator(':scope > .post-preview-footer-left')).toHaveCount(1);
        await expect(footer.locator(':scope > .post-preview-footer-actions')).toHaveCount(1);
        await expect(footer.locator(':scope > .post-preview-footer-right')).toHaveCount(1);

        const [cardBox, footerBox, menuBox, width] = await Promise.all([
            relatedCard.boundingBox(),
            footer.boundingBox(),
            footer.getByRole('button', { name: 'アクションを表示' }).boundingBox(),
            relatedCard.evaluate((element) => ({
                clientWidth: (element as HTMLElement).clientWidth,
                scrollWidth: (element as HTMLElement).scrollWidth,
            })),
        ]);

        expect(cardBox).not.toBeNull();
        expect(footerBox).not.toBeNull();
        expect(menuBox).not.toBeNull();
        expect(footerBox!.height).toBeGreaterThanOrEqual(35);
        expect(footerBox!.height).toBeLessThanOrEqual(37);
        expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width + 1);
        expect(width.scrollWidth).toBeLessThanOrEqual(width.clientWidth + 1);

        const replyButton = footer.getByRole('button', { name: 'リプライ' });
        const quoteButton = footer.getByRole('button', { name: '引用' });
        const [replyBox, quoteBox] = await Promise.all([
            replyButton.boundingBox(),
            quoteButton.boundingBox(),
        ]);
        expect(replyBox).not.toBeNull();
        expect(quoteBox).not.toBeNull();
        expect(replyBox!.x + replyBox!.width).toBeLessThanOrEqual(quoteBox!.x + 1);
        expect(quoteBox!.x + quoteBox!.width).toBeLessThanOrEqual(menuBox!.x + 1);
        await page.evaluate(() => {
            (window as HarnessWindow).__POST_HISTORY_ACTION_TARGETS__!
                .replyShouldReturnFalse = true;
        });
        await replyButton.click();
        await quoteButton.click();
    });

    test('post preview footer tooltips show the user-facing labels and close on menu open', async ({ page }) => {
        const harness = await gotoHarness(page);
        const replyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        const reactionItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.reactionPostEventId}"]`,
        );
        const replyButton = page.locator('.post-preview-replies-badge-button[aria-label*="返信"]').first();
        const quoteButton = replyItem.getByRole('button', { name: '引用' });
        const reactionButton = reactionItem.getByRole('button', { name: 'リアクション 1件を表示' });
        const menuButton = replyItem.locator('.post-preview-footer-right').getByRole('button', { name: 'アクションを表示' }).first();

        const expectedReplyLabel = await replyButton.getAttribute('aria-label');
        await expect(replyButton).toBeVisible();
        await expectTooltip(page, replyButton, expectedReplyLabel ?? '');
        await expectTooltip(page, quoteButton, '引用');
        await expectTooltip(page, reactionButton, 'リアクション 1件を表示');

        await replyButton.hover();
        const repliesTooltip = page.locator('.post-preview-tooltip-content:visible').filter({ hasText: expectedReplyLabel ?? '' });
        await expect(repliesTooltip).toHaveText(expectedReplyLabel ?? '');
        const repliesTooltipClasses = await repliesTooltip.evaluate((element) => Array.from(element.classList));
        expect(repliesTooltipClasses).toContain('post-preview-tooltip-content');
        const repliesTooltipZIndex = await repliesTooltip.evaluate((element) => getComputedStyle(element).zIndex);
        const dialogZIndex = await page.locator('.post-history-dialog').evaluate((element) => getComputedStyle(element).zIndex);
        expect(Number(repliesTooltipZIndex)).toBeGreaterThan(Number(dialogZIndex));
        await expect(replyButton).toHaveAttribute('aria-label', expectedReplyLabel ?? '');
        await expect(replyButton).not.toHaveAttribute('title');

        await replyButton.click();
        const replyCard = replyItem.locator('.post-history-related-card').filter({ hasText: harness.replyContent });
        await expect(replyCard).toBeVisible();

        await menuButton.focus();
        const tooltip = page.locator('.post-preview-tooltip-content:visible').filter({ hasText: 'アクションを表示' });
        await expect(tooltip).toHaveText('アクションを表示');
        const zIndexes = await Promise.all([
            tooltip.evaluate((element) => getComputedStyle(element).zIndex),
            page.locator('.post-history-dialog').evaluate((element) => getComputedStyle(element).zIndex),
        ]);
        expect(Number(zIndexes[0])).toBeGreaterThan(Number(zIndexes[1]));
        await expect(menuButton).toHaveAttribute('aria-label', 'アクションを表示');
        await expect(menuButton).not.toHaveAttribute('title');

        await menuButton.click();
        await expect(page.getByRole('menuitem', { name: 'イベントJSONを表示' })).toBeVisible();
        await expect(page.locator('.tooltip-content:visible')).toHaveCount(0);
    });

    test('related card menus have tooltips', async ({ page }) => {
        const harness = await gotoHarness(page);
        const quoteItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        await expectTooltip(
            page,
            quoteCard.getByRole('button', { name: 'アクションを表示' }),
            'アクションを表示',
        );

        const replyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        await page.locator('.post-preview-replies-badge-button[aria-label*="返信"]').first().click();
        const replyCard = replyItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.replyContent });
        await expectTooltip(
            page,
            replyCard.getByRole('button', { name: 'アクションを表示' }),
            'アクションを表示',
        );

        const relatedRepliesButton = page.locator('.post-preview-replies-badge-button[aria-label*="返信"]').last();
        const expectedRelatedReplyLabel = await relatedRepliesButton.getAttribute('aria-label');
        await expect(relatedRepliesButton).toBeVisible();
        await expectTooltip(page, relatedRepliesButton, expectedRelatedReplyLabel ?? '');
        await relatedRepliesButton.hover();
        const relatedRepliesTooltip = page.locator('.post-preview-tooltip-content:visible').filter({ hasText: expectedRelatedReplyLabel ?? '' });
        await expect(relatedRepliesTooltip).toHaveText(expectedRelatedReplyLabel ?? '');
        const relatedRepliesTooltipClasses = await relatedRepliesTooltip.evaluate((element) => Array.from(element.classList));
        expect(relatedRepliesTooltipClasses).toContain('post-preview-tooltip-content');
        const relatedRepliesTooltipZIndex = await relatedRepliesTooltip.evaluate((element) => getComputedStyle(element).zIndex);
        const dialogZIndexForRelated = await page.locator('.post-history-dialog').evaluate((element) => getComputedStyle(element).zIndex);
        expect(Number(relatedRepliesTooltipZIndex)).toBeGreaterThan(Number(dialogZIndexForRelated));
        await expect(relatedRepliesButton).toHaveAttribute('aria-label', expectedRelatedReplyLabel ?? '');
        await expect(relatedRepliesButton).not.toHaveAttribute('title');
    });

    test('desktop reference links open natively without toggling their parent previews', async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, 'desktop only');
        await page.route('**/reference-link-target', (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: '<title>Reference target</title>',
            }),
        );
        const harness = await gotoHarness(page);
        const historyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.linkPostEventId}"]`,
        );
        const link = historyItem
            .locator('.post-history-preview-text a')
            .filter({ hasText: harness.linkTargetUrl });
        const expandButton = historyItem.getByRole('button', {
            name: 'もっと見る',
        });

        await expect(link).toBeVisible();
        await expectReferenceLinkAttributes(link, harness.linkTargetUrl);
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        await expectNoHorizontalOverflow(historyItem);

        const clickPopupPromise = page.waitForEvent('popup');
        await link.click();
        const clickPopup = await clickPopupPromise;
        await expect(clickPopup).toHaveURL(harness.linkTargetUrl);
        await clickPopup.close();
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.post-history-dialog')).toBeVisible();

        await link.focus();
        await expect(link).toBeFocused();
        const keyboardPopupPromise = page.waitForEvent('popup');
        await page.keyboard.press('Enter');
        const keyboardPopup = await keyboardPopupPromise;
        await expect(keyboardPopup).toHaveURL(harness.linkTargetUrl);
        await keyboardPopup.close();
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');

        await expandButton.click();
        const collapseButton = historyItem.getByRole('button', { name: '折りたたむ' });
        await expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
        const expandedToggle = await historyItem.locator('.post-preview-toggle-row').evaluate((element) => {
            const text = element.parentElement?.querySelector('.post-history-preview-text');
            const row = element.getBoundingClientRect();
            const textRect = text?.getBoundingClientRect();
            return {
                position: getComputedStyle(element).position,
                top: row.top,
                textBottom: textRect?.bottom ?? 0,
                buttonHeight: element.getBoundingClientRect().height,
                links: Array.from(text?.querySelectorAll('a') ?? []).map((link) => {
                    const rect = link.getBoundingClientRect();
                    return { top: rect.top, bottom: rect.bottom };
                }),
            };
        });
        expect(expandedToggle.position).toBe('static');
        expect(expandedToggle.top).toBeGreaterThanOrEqual(expandedToggle.textBottom - 1);
        expect(expandedToggle.links.every((rect) =>
            rect.bottom <= expandedToggle.top + 1
                || rect.top >= expandedToggle.top + expandedToggle.buttonHeight - 1,
        )).toBe(true);
    });

    test('quote and thread graph related cards preserve reference links', async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        const quoteItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        const quoteLink = quoteCard.getByRole('link', {
            name: harness.linkTargetUrl,
        });
        await expectReferenceLinkAttributes(quoteLink, harness.linkTargetUrl);
        await expectNoHorizontalOverflow(quoteCard);

        const replyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
        );
        await replyItem
            .getByRole('button', { name: '返信 1件を表示' })
            .click();
        const replyCard = replyItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.replyContent });
        await expectReferenceLinkAttributes(
            replyCard.getByRole('link', { name: harness.linkTargetUrl }),
            harness.linkTargetUrl,
        );

        const threadParentItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.threadParentPostEventId}"]`,
        );
        await threadParentItem
            .getByRole('button', { name: '返信先を見る' })
            .click();
        const parentCard = threadParentItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        await expectReferenceLinkAttributes(
            parentCard.getByRole('link', { name: harness.linkTargetUrl }),
            harness.linkTargetUrl,
        );
    });

    test('normal post action menu keeps extracted actions and opens raw JSON on both browser sizes', async ({
        page,
        isMobile,
    }) => {
        const harness = await gotoHarness(page);
        const postItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.plainPostEventId}"]`,
        );
        const actionTrigger = postItem
            .locator('.post-preview-footer-right')
            .getByRole('button', { name: 'アクションを表示' });

        await actionTrigger.scrollIntoViewIfNeeded();
        const triggerBeforeOpen = await actionTrigger.boundingBox();
        expect(triggerBeforeOpen).not.toBeNull();
        if (isMobile) {
            const triggerBox = await actionTrigger.boundingBox();
            expect(triggerBox).not.toBeNull();
            await page.touchscreen.tap(
                triggerBox!.x + triggerBox!.width / 2,
                triggerBox!.y + triggerBox!.height / 2,
            );
        } else {
            await actionTrigger.click();
        }
        const triggerAfterOpen = await actionTrigger.boundingBox();
        expect(triggerAfterOpen).not.toBeNull();
        expect(Math.abs(triggerAfterOpen!.x - triggerBeforeOpen!.x)).toBeLessThanOrEqual(1);
        expect(Math.abs(triggerAfterOpen!.y - triggerBeforeOpen!.y)).toBeLessThanOrEqual(1);
        expect(Math.abs(triggerAfterOpen!.width - triggerBeforeOpen!.width)).toBeLessThanOrEqual(1);
        expect(Math.abs(triggerAfterOpen!.height - triggerBeforeOpen!.height)).toBeLessThanOrEqual(1);
        const actionMenu = visiblePostHistoryActionMenu(page);
        await expect(actionMenu.getByRole('menuitem')).toHaveText([
            'nostterで開く',
            '返信 1件を表示',
            'イベントIDをコピー',
            'イベントJSONを表示',
            '削除',
        ]);

        await actionMenu
            .getByRole('menuitem', { name: 'イベントJSONを表示' })
            .click();
        const rawJsonDialog = page.getByRole('dialog', { name: 'イベントJSON' });
        await expect(rawJsonDialog).toBeVisible();
        await expect(rawJsonDialog.getByRole('tab')).toHaveCount(0);
        await expect(rawJsonDialog.locator('.raw-json-content')).toHaveText('null');
        await expect(page.locator('.post-history-dialog')).toBeVisible();

        await page.locator('.dialog-overlay').last().click({ position: { x: 8, y: 8 } });
        await expect(rawJsonDialog).toHaveCount(0);
        await expect(page.locator('.post-history-dialog')).toBeVisible();
    });

    test('resolved quote preview action menu keeps the extracted actions usable', async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        const quoteItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
        );
        const quoteCard = quoteItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });

        await expect(quoteCard).toBeVisible();
        await quoteCard
            .getByRole('button', { name: 'アクションを表示' })
            .click();
        const actionMenu = visiblePostHistoryActionMenu(page);
        await expect(actionMenu.getByRole('menuitem')).toHaveText([
            'nostterで開く',
            'イベントIDをコピー',
            'イベントJSONを表示',
            'ブロードキャスト',
        ]);
    });

    test('thread graph node action menu keeps raw JSON before copy', async ({
        page,
    }) => {
        const harness = await gotoHarness(page);
        const threadParentItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.threadParentPostEventId}"]`,
        );

        await threadParentItem
            .getByRole('button', { name: '返信先を見る' })
            .click();
        const parentCard = threadParentItem
            .locator('.post-history-related-card')
            .filter({ hasText: harness.quoteContent });
        await expect(parentCard).toBeVisible();
        await parentCard
            .getByRole('button', { name: 'アクションを表示' })
            .click();
        const actionMenu = visiblePostHistoryActionMenu(page);
        await expect(actionMenu.getByRole('menuitem')).toHaveText([
            'nostterで開く',
            '返信を確認',
            'イベントJSONを表示',
            'イベントIDをコピー',
            'ブロードキャスト',
        ]);
    });

    test('mobile reference link stays tappable without changing parent state or overflowing', async ({
        page,
        isMobile,
    }) => {
        test.skip(!isMobile, 'mobile only');
        await page.route('**/reference-link-target', (route) =>
            route.fulfill({
                contentType: 'text/html',
                body: '<title>Reference target</title>',
            }),
        );
        const harness = await gotoHarness(page);
        const historyItem = page.locator(
            `.post-history-item[data-post-history-event-id="${harness.linkPostEventId}"]`,
        );
        const link = historyItem.getByRole('link', {
            name: harness.linkTargetUrl,
        });
        const expandButton = historyItem.getByRole('button', {
            name: 'もっと見る',
        });

        await expectReferenceLinkAttributes(link, harness.linkTargetUrl);
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        await expectNoHorizontalOverflow(historyItem);
        const popupPromise = page.waitForEvent('popup');
        await link.tap();
        const popup = await popupPromise;
        await popup.close();
        await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.post-history-dialog')).toBeVisible();
    });

    test('mobile timeline controls stay usable and fit the viewport', async ({ page, isMobile }) => {
        test.skip(!isMobile, 'mobile only');

        const harness = await gotoHarness(page);
        const dialog = page.locator('.post-history-dialog');
        await expect(dialog).toBeVisible();
        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, 50);

        const viewport = page.viewportSize();
        const dialogBox = await dialog.boundingBox();
        expect(dialogBox).not.toBeNull();
        expect(dialogBox!.x).toBeGreaterThanOrEqual(0);
        expect(dialogBox!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);

        const containerMetrics = await page.locator('.post-history-container').evaluate((element) => ({
            clientWidth: (element as HTMLDivElement).clientWidth,
            scrollWidth: (element as HTMLDivElement).scrollWidth,
        }));
        expect(containerMetrics.scrollWidth).toBeLessThanOrEqual(containerMetrics.clientWidth + 1);

        const quoteStatusCard = page
            .locator(`.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`)
            .locator('.post-history-quote-status-card');
        await expect(quoteStatusCard).toBeVisible();
        const quoteStatusCardMetrics = await quoteStatusCard.evaluate((element) => ({
            clientWidth: (element as HTMLElement).clientWidth,
            scrollWidth: (element as HTMLElement).scrollWidth,
        }));
        expect(quoteStatusCardMetrics.scrollWidth).toBeLessThanOrEqual(
            quoteStatusCardMetrics.clientWidth + 1,
        );

        await jumpToDate(page, harness.jumpDate);

        await expect(page.getByRole('button', { name: '最新へ戻る' })).toBeVisible();
        await expect(page.getByRole('button', { name: '新しい投稿を表示' })).toBeVisible();
        await expect(page.locator('.post-history-auto-load-newer-slot')).toHaveCount(0);

        await page.getByRole('button', { name: '最新へ戻る' }).click();
        await expectSummary(page, harness.totalPosts);
        await expectVisiblePostCount(page, 50);
    });

    test('per-post delete action opens the confirm dialog and closes the menu', async ({ page, isMobile }) => {
        test.skip(isMobile, 'desktop only');

        await gotoHarness(page);

        const postActionTrigger = page.getByRole('button', { name: 'アクションを表示' }).first();
        await postActionTrigger.click();
        await page.getByRole('menuitem', { name: '削除' }).click();

        await expect(
            page.locator('.delete-confirm-description').filter({
                hasText: 'この投稿の削除リクエストをリレーへ送信します。',
            }),
        ).toBeVisible();
        await expect(page.getByRole('menuitem', { name: '削除' })).toHaveCount(0);
    });

});

test('shared reply and quote actions use the event on each card', async ({ page }) => {
    test.setTimeout(120_000);
    const harness = await gotoHarness(page);
    const readActionTargets = () => page.evaluate(() =>
        (window as HarnessWindow).__POST_HISTORY_ACTION_TARGETS__,
    );
    const setReplyShouldReturnFalse = async (value: boolean) => {
        await page.evaluate((replyShouldReturnFalse) => {
            (window as HarnessWindow).__POST_HISTORY_ACTION_TARGETS__!
                .replyShouldReturnFalse = replyShouldReturnFalse;
        }, value);
    };
    const runAndReopen = async (
        button: ReturnType<Page['getByRole']>,
        action: 'replyEventId' | 'quoteEventId',
        expectedEventId: string,
    ) => {
        await button.click();
        await expect.poll(async () => (await readActionTargets())?.[action])
            .toBe(expectedEventId);
        await expect(page.getByTestId('post-history-reopen')).toBeVisible();
        await page.getByTestId('post-history-reopen').click();
        await expect(page.getByRole('dialog', { name: '投稿履歴' })).toBeVisible();
    };

    const plainItem = page.locator(
        `.post-history-item[data-post-history-event-id="${harness.plainPostEventId}"]`,
    );
    await setReplyShouldReturnFalse(true);
    await plainItem.getByRole('button', { name: 'リプライ' }).click();
    await expect.poll(async () => (await readActionTargets())?.replyEventId)
        .toBe(harness.plainPostEventId);
    await expect(page.getByRole('dialog', { name: '投稿履歴' })).toBeVisible();
    await setReplyShouldReturnFalse(false);
    await plainItem.getByRole('button', { name: '引用' }).click();
    await expect.poll(async () => (await readActionTargets())?.quoteEventId)
        .toBe(harness.plainPostEventId);
    await expect(page.getByTestId('post-history-reopen')).toBeVisible();
    await page.getByTestId('post-history-reopen').click();

    const quoteHost = page.locator(
        `.post-history-item[data-post-history-event-id="${harness.quotePostEventId}"]`,
    );
    const quoteCard = () => quoteHost.locator('.post-history-related-card')
        .filter({ hasText: harness.quoteContent });
    await runAndReopen(
        quoteCard().getByRole('button', { name: 'リプライ' }),
        'replyEventId',
        harness.quoteEventId,
    );
    await runAndReopen(
        quoteCard().getByRole('button', { name: '引用' }),
        'quoteEventId',
        harness.quoteEventId,
    );

    const threadHost = page.locator(
        `.post-history-item[data-post-history-event-id="${harness.threadParentPostEventId}"]`,
    );
    const parentCard = () => threadHost.locator('.post-history-related-card')
        .filter({ hasText: harness.quoteContent });
    const showParent = async () => {
        await threadHost.getByRole('button', { name: '返信先を見る' }).click();
        await expect(parentCard()).toBeVisible();
    };
    await showParent();
    await runAndReopen(
        parentCard().getByRole('button', { name: 'リプライ' }),
        'replyEventId',
        harness.quoteEventId,
    );
    await showParent();
    await runAndReopen(
        parentCard().getByRole('button', { name: '引用' }),
        'quoteEventId',
        harness.quoteEventId,
    );

    const replyHost = page.locator(
        `.post-history-item[data-post-history-event-id="${harness.replyParentEventId}"]`,
    );
    const replyCard = () => replyHost.locator('.post-history-related-card')
        .filter({ hasText: harness.replyContent });
    const showChildren = async () => {
        await replyHost.getByRole('button', { name: /返信 1件を表示/ }).click();
        await expect(replyCard()).toBeVisible();
    };
    await showChildren();
    await runAndReopen(
        replyCard().getByRole('button', { name: 'リプライ' }),
        'replyEventId',
        '7'.repeat(64),
    );
    await showChildren();
    await runAndReopen(
        replyCard().getByRole('button', { name: '引用' }),
        'quoteEventId',
        '7'.repeat(64),
    );

    const grandchildCard = () => replyHost.locator('.post-history-related-card')
        .filter({ hasText: 'playwright nested reply' });
    const showGrandchild = async () => {
        await showChildren();
        await replyCard().getByRole('button', { name: /返信 1件を表示/ }).click();
        await expect(grandchildCard()).toBeVisible();
    };
    await showGrandchild();
    await runAndReopen(
        grandchildCard().getByRole('button', { name: 'リプライ' }),
        'replyEventId',
        '8'.repeat(64),
    );
    await showGrandchild();
    await runAndReopen(
        grandchildCard().getByRole('button', { name: '引用' }),
        'quoteEventId',
        '8'.repeat(64),
    );
});
