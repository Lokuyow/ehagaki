import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DialogHistoryHarness from "../mocks/DialogHistoryHarness.svelte";

async function openHarness(onHistoryClose: () => void | boolean) {
    render(DialogHistoryHarness, {
        props: { onHistoryClose },
    });
    await fireEvent.click(screen.getByRole("button", { name: "open" }));
    await waitFor(() => expect(screen.getByTestId("open-state").textContent).toBe("open"));
    const modalId = history.state?.modalId;
    expect(typeof modalId).toBe("string");
    return modalId as string;
}

async function goBackAndWaitForPopState(): Promise<void> {
    const popped = new Promise<void>((resolve) => {
        window.addEventListener("popstate", () => resolve(), { once: true });
    });
    history.back();
    await popped;
}

describe("useDialogHistory", () => {
    beforeEach(() => {
        history.replaceState({ testBase: true }, "", window.location.href);
    });

    it("open時にmodal IDを追加し、close拒否時は同じIDを復元してopenを維持する", async () => {
        const onHistoryClose = vi.fn(() => false);
        const modalId = await openHarness(onHistoryClose);

        await goBackAndWaitForPopState();

        await waitFor(() => expect(onHistoryClose).toHaveBeenCalledOnce());
        expect(history.state?.modalId).toBe(modalId);
        expect(screen.getByTestId("open-state").textContent).toBe("open");
        expect(screen.getByTestId("close-attempts").textContent).toBe("1");

        await fireEvent.click(screen.getByRole("button", { name: "close" }));
        await waitFor(() => expect(screen.getByTestId("open-state").textContent).toBe("closed"));
    });

    it.each([
        ["true", true],
        ["void", undefined],
    ] as const)("onCloseが%sなら履歴stateを復元せずcloseする", async (_label, result) => {
        const onHistoryClose = vi.fn(() => result);
        const modalId = await openHarness(onHistoryClose);

        await goBackAndWaitForPopState();

        await waitFor(() => expect(screen.getByTestId("open-state").textContent).toBe("closed"));
        expect(onHistoryClose).toHaveBeenCalledOnce();
        expect(history.state?.modalId).not.toBe(modalId);
    });

    it("close拒否を繰り返しても履歴長を増やさず、通常closeで元のstateへ戻る", async () => {
        const onHistoryClose = vi.fn(() => false);
        const modalId = await openHarness(onHistoryClose);
        const historyLengthAfterOpen = history.length;

        await goBackAndWaitForPopState();
        await waitFor(() => expect(onHistoryClose).toHaveBeenCalledTimes(1));
        expect(history.state?.modalId).toBe(modalId);
        expect(history.length).toBe(historyLengthAfterOpen);

        await goBackAndWaitForPopState();
        await waitFor(() => expect(onHistoryClose).toHaveBeenCalledTimes(2));
        expect(history.state?.modalId).toBe(modalId);
        expect(history.length).toBe(historyLengthAfterOpen);

        const returned = new Promise<void>((resolve) => {
            window.addEventListener("popstate", () => resolve(), { once: true });
        });
        await fireEvent.click(screen.getByRole("button", { name: "close" }));
        await returned;

        expect(screen.getByTestId("open-state").textContent).toBe("closed");
        expect(history.state?.testBase).toBe(true);
    });
});
