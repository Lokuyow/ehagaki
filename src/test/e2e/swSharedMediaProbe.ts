import { getSharedMediaWithFallback } from "../../lib/utils/swCommunication";
import { sharedMediaRepository } from "../../lib/storage/sharedMediaRepository";

interface SharedMediaSnapshot {
    received: boolean;
    firstImageIsFile: boolean;
    fileName: string | null;
    fileType: string | null;
    fileSize: number | null;
    shareId: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function snapshotSharedMedia(value: unknown): SharedMediaSnapshot {
    if (!isRecord(value)) {
        return {
            received: false,
            firstImageIsFile: false,
            fileName: null,
            fileType: null,
            fileSize: null,
            shareId: null,
        };
    }

    const images = Array.isArray(value.images) ? value.images : [];
    const file = images[0];
    const firstImageIsFile = typeof File !== "undefined" && file instanceof File;

    return {
        received: images.length > 0,
        firstImageIsFile,
        fileName: firstImageIsFile ? file.name : null,
        fileType: firstImageIsFile ? file.type : null,
        fileSize: firstImageIsFile ? file.size : null,
        shareId: typeof value.shareId === "string" ? value.shareId : null,
    };
}

async function requestSharedMediaFromServiceWorker(): Promise<SharedMediaSnapshot> {
    const controller = navigator.serviceWorker.controller;
    if (!controller) throw new Error("The test page is not controlled by a Service Worker");

    const channel = new MessageChannel();
    return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            channel.port1.close();
            reject(new Error("Timed out waiting for getSharedMedia MessageChannel response"));
        }, 10000);

        channel.port1.onmessage = (event: MessageEvent<unknown>) => {
            clearTimeout(timeout);
            channel.port1.close();
            const response = isRecord(event.data) ? event.data.data : undefined;
            resolve(snapshotSharedMedia(response));
        };

        controller.postMessage(
            { action: "getSharedMedia", requestId: "sw-file-round-trip" },
            [channel.port2],
        );
    });
}

declare global {
    interface Window {
        __swSharedMediaProbe: {
            requestSharedMediaFromServiceWorker: typeof requestSharedMediaFromServiceWorker;
            getSharedMediaWithFallback: (shareId: string) => Promise<{
                databaseRecordDeleted: boolean;
            } & SharedMediaSnapshot>;
        };
    }
}

window.__swSharedMediaProbe = {
    requestSharedMediaFromServiceWorker,
    async getSharedMediaWithFallback(shareId) {
        const deleteResult = await sharedMediaRepository.deleteLatestForShare(shareId);
        const data = await getSharedMediaWithFallback();
        return {
            databaseRecordDeleted: deleteResult === "deleted",
            ...snapshotSharedMedia(data),
        };
    },
};
