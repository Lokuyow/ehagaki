import { expect, test } from "@playwright/test";

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
