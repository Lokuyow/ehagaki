/**
 * One request/reply round trip with a Service Worker over a MessageChannel.
 *
 * Settles exactly once: on the first reply, a message error, a postMessage
 * failure, or the timeout. The timer is always cleared and the port closed,
 * so callers never leak either. Side-effect free so any runtime can import it.
 */
export type ServiceWorkerReply =
    | { status: "reply"; data: unknown }
    | { status: "timeout" }
    | { status: "error"; error: unknown };

type ServiceWorkerMessageTarget = {
    postMessage(message: unknown, transfer: Transferable[]): void;
};

export function requestServiceWorker(
    target: ServiceWorkerMessageTarget,
    message: unknown,
    timeoutMs: number,
): Promise<ServiceWorkerReply> {
    const channel = new MessageChannel();
    const port = channel.port1;

    return new Promise((resolve) => {
        let settled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const finish = (reply: ServiceWorkerReply) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            port.onmessage = null;
            port.onmessageerror = null;
            port.close?.();
            resolve(reply);
        };

        timer = setTimeout(() => finish({ status: "timeout" }), timeoutMs);
        port.onmessage = (event: MessageEvent<unknown>) =>
            finish({ status: "reply", data: event.data });
        port.onmessageerror = (event: MessageEvent<unknown>) =>
            finish({ status: "error", error: event });

        try {
            target.postMessage(message, [channel.port2]);
        } catch (error) {
            finish({ status: "error", error });
        }
    });
}
