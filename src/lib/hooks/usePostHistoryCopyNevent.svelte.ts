import type { PostHistoryRecord } from "../storage/ehagakiDb";
import { calculateContextMenuPosition } from "../utils/appUtils";
import { tryCopyToClipboard } from "../utils/clipboardUtils";
import { toNevent } from "../utils/nostrUtils";
import { writeRelaysStore } from "../../stores/relayStore.svelte";

type CopyPointerPosition = {
    eventId: string;
    x: number;
    y: number;
};

export function usePostHistoryCopyNevent() {
    let copyState = $state<Record<string, "failed" | undefined>>({});
    let showCopyFloatingMessage = $state(false);
    let copyFloatingMessageX = $state(0);
    let copyFloatingMessageY = $state(0);
    let copyFloatingMessageTimeout: ReturnType<typeof setTimeout> | undefined;
    let lastCopyPointerPosition = $state<CopyPointerPosition | undefined>(
        undefined,
    );

    function buildNevent(post: PostHistoryRecord): string {
        return toNevent({
            eventId: post.eventId,
            authorPubkey: post.pubkeyHex,
            kind: post.kind,
            acceptedRelays: post.acceptedRelays,
            relayHints: post.relayHints,
            writeRelays: writeRelaysStore.value,
        });
    }

    function hideCopyFloatingMessage(): void {
        if (copyFloatingMessageTimeout) {
            clearTimeout(copyFloatingMessageTimeout);
            copyFloatingMessageTimeout = undefined;
        }

        showCopyFloatingMessage = false;
        lastCopyPointerPosition = undefined;
    }

    function captureCopyPointerPosition(
        post: PostHistoryRecord,
        event: PointerEvent,
    ): void {
        lastCopyPointerPosition = {
            eventId: post.eventId,
            ...calculateContextMenuPosition(event.clientX, event.clientY),
        };
    }

    function getFloatingMessagePosition(
        post: PostHistoryRecord,
        event: Event,
    ): { x: number; y: number } {
        if (lastCopyPointerPosition?.eventId === post.eventId) {
            return {
                x: lastCopyPointerPosition.x,
                y: lastCopyPointerPosition.y,
            };
        }

        const target = event.currentTarget;
        const rect =
            target instanceof HTMLElement
                ? target.getBoundingClientRect()
                : null;

        return calculateContextMenuPosition(
            rect ? rect.left + rect.width / 2 : 0,
            rect ? rect.bottom + 8 : 0,
        );
    }

    function showCopySuccessMessage(x: number, y: number): void {
        if (copyFloatingMessageTimeout) {
            clearTimeout(copyFloatingMessageTimeout);
        }

        copyFloatingMessageX = x;
        copyFloatingMessageY = y;
        showCopyFloatingMessage = true;
        copyFloatingMessageTimeout = setTimeout(() => {
            showCopyFloatingMessage = false;
            copyFloatingMessageTimeout = undefined;
        }, 1800);
    }

    async function handleCopyNevent(
        post: PostHistoryRecord,
        event: Event,
    ): Promise<void> {
        const messagePosition = getFloatingMessagePosition(post, event);
        const nevent = buildNevent(post);
        const copied = nevent
            ? await tryCopyToClipboard(nevent, "nevent", navigator, window)
            : false;

        if (copied) {
            copyState = {
                ...copyState,
                [post.eventId]: undefined,
            };
            showCopySuccessMessage(messagePosition.x, messagePosition.y);
            return;
        }

        copyState = {
            ...copyState,
            [post.eventId]: "failed",
        };

        setTimeout(() => {
            copyState = {
                ...copyState,
                [post.eventId]: undefined,
            };
        }, 1800);
    }

    function resetState(): void {
        copyState = {};
        hideCopyFloatingMessage();
    }

    return {
        get copyState() {
            return copyState;
        },
        get showCopyFloatingMessage() {
            return showCopyFloatingMessage;
        },
        get copyFloatingMessageX() {
            return copyFloatingMessageX;
        },
        get copyFloatingMessageY() {
            return copyFloatingMessageY;
        },
        captureCopyPointerPosition,
        hideCopyFloatingMessage,
        handleCopyNevent,
        resetState,
    };
}