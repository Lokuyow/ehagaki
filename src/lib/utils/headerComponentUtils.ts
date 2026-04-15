import type { BalloonMessage } from "../types";

export function resolveCompactMessageText(
    compactMessage: BalloonMessage | null | undefined,
    compactSuccessText: string,
): string {
    if (!compactMessage) {
        return "";
    }

    if (compactMessage.type === "success") {
        return compactSuccessText;
    }

    return compactMessage.message;
}