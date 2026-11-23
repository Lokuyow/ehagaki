export const IMAGE_DECODE_WAIT_TIMEOUT_MS = 3_000;

/**
 * Waits for `image.decode()` so a following drawImage does not decode large
 * images synchronously on the main thread. Decoding is only an optimization:
 * rejection, a missing API, or a decode that does not settle in time all fall
 * through to the caller's ordinary drawImage path.
 */
export function waitForImageDecode(
    image: HTMLImageElement,
    timeoutMs: number = IMAGE_DECODE_WAIT_TIMEOUT_MS,
): Promise<void> {
    if (typeof image.decode !== "function") return Promise.resolve();
    return new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, timeoutMs);
        image.decode().catch(() => undefined).then(() => {
            clearTimeout(timer);
            resolve();
        });
    });
}
