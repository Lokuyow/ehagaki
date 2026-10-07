import { expect, test, type Locator } from "@playwright/test";

type HarnessEvent = {
    event: {
        id: string;
        pubkey: string;
        kind: number;
        content: string;
        tags: string[][];
    };
    targetRelays: string[];
};

async function expectReplyPreviewWarningFits(preview: Locator): Promise<void> {
    const prompt = preview.locator('.content-warning-prompt');
    await expect(prompt).toBeVisible();
    const layout = await prompt.evaluate((element) => {
        const button = element.querySelector<HTMLElement>('.content-warning-reveal-button');
        const reason = element.querySelector<HTMLElement>('.content-warning-copy span');
        const card = element.closest<HTMLElement>('.reply-quote-preview');
        if (!button || !card) throw new Error('Missing reply preview Content Warning elements');
        const rect = (node: Element) => {
            const { left, right, top, bottom, height } = node.getBoundingClientRect();
            return { left, right, top, bottom, height };
        };
        return {
            card: rect(card),
            prompt: rect(element),
            button: rect(button),
            reason: reason ? {
                scrollWidth: reason.scrollWidth,
                clientWidth: reason.clientWidth,
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
    }
}

test("publishes payload before its Structure and replies to the canonical Structure", async ({ page }) => {
    await page.goto("sensitive-content-payload-playwright.html");
    await page.getByTestId("submit-sensitive").click();
    await expect(page.getByTestId("submit-result")).toHaveText("success", { timeout: 15_000 });

    const firstPost = await page.evaluate(() => {
        const harness = (window as any).__SENSITIVE_PAYLOAD_HARNESS__;
        return {
            sentEvents: harness.sentEvents as HarnessEvent[],
            historyEvents: harness.historyEvents as HarnessEvent["event"][],
            payloadCandidates: harness.payloadCandidates as HarnessEvent["event"][],
            notifications: harness.notifications as string[],
        };
    });
    expect(firstPost.sentEvents).toHaveLength(2);
    expect(firstPost.sentEvents.map(({ event }) => event.kind)).toEqual([36, 1]);
    const [payload, structure] = firstPost.sentEvents;
    expect(payload?.event).toMatchObject({
        kind: 36,
        content: "Sensitive browser body",
        tags: [["k", "1"]],
    });
    expect(structure?.event).toMatchObject({ kind: 1, content: "" });
    expect(structure?.event.tags).toContainEqual(["content-warning", "Sensitive preview"]);
    expect(structure?.event.tags).toContainEqual(["c", payload?.event.id, "wss://sensitive-harness.example.com/"]);
    expect(payload?.targetRelays).toEqual(["wss://sensitive-harness.example.com/"]);
    expect(structure?.targetRelays).toEqual(payload?.targetRelays);
    expect(firstPost.historyEvents).toHaveLength(1);
    expect(firstPost.historyEvents[0]).toEqual(structure?.event);
    expect(firstPost.payloadCandidates).toHaveLength(1);
    expect(firstPost.payloadCandidates[0]).toEqual(payload?.event);
    expect(firstPost.notifications).toEqual(["success"]);

    for (const mode of ["reply", "quote"]) {
        const preview = page.getByTestId(`sensitive-${mode}-preview`);
        await expect(preview.getByRole("button", { name: "展開する" })).toBeEnabled();
        await expect(preview.getByText("Sensitive browser body")).toHaveCount(0);
        await preview.getByRole("button", { name: "展開する" }).click();
        await preview.getByRole("button", { name: "本文を表示" }).click();
        await expect(preview.getByText("Sensitive browser body")).toBeVisible();
    }

    await page.getByTestId("reply-canonical").click();
    await expect(page.getByTestId("submit-result")).toHaveText("reply-success", { timeout: 10_000 });
    const reply = await page.evaluate(() => {
        const harness = (window as any).__SENSITIVE_PAYLOAD_HARNESS__;
        return harness.sentEvents[2] as HarnessEvent;
    });
    expect(reply.event.kind).toBe(1);
    expect(reply.event.content).toBe("Reply to canonical Structure");
    expect(reply.event.tags).toEqual(expect.arrayContaining([
        expect.arrayContaining([
            "e",
            structure?.event.id,
            "wss://sensitive-harness.example.com/",
        ]),
        ["p", structure?.event.pubkey],
    ]));
    expect(reply.event.tags.find((tag) => tag[0] === "e")?.at(-1)).toBe(structure?.event.pubkey);
});

test("ReplyQuotePreview Content Warning wraps to its container width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 820 });
    await page.goto("sensitive-content-payload-playwright.html");
    await page.getByTestId("submit-sensitive").click();
    await expect(page.getByTestId("submit-result")).toHaveText("success", { timeout: 15_000 });

    const previews = [
        page.getByTestId("sensitive-reply-preview").locator(".reply-quote-preview"),
        page.getByTestId("sensitive-quote-preview").locator(".reply-quote-preview"),
    ];
    for (const preview of previews) {
        await preview.getByRole("button", { name: "展開する" }).click();
        await expectReplyPreviewWarningFits(preview);
    }

    await page.setViewportSize({ width: 1024, height: 900 });
    for (const preview of previews) {
        await preview.evaluate((element) => {
            const card = element as HTMLElement;
            card.style.width = "140px";
            card.style.maxWidth = "140px";
            card.style.boxSizing = "border-box";
        });
        await expectReplyPreviewWarningFits(preview);
    }
});
