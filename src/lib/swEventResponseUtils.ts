export interface EventResponseTarget {
    ports?: Array<{ postMessage: (message: unknown) => void }> | null;
    source?: { postMessage: (message: unknown) => void } | null;
}

export function createVersionResponse(version: string): { version: string } {
    return { version };
}

export function createPingTestResponse(
    version: string,
    timestamp = Date.now(),
): { type: 'PONG'; timestamp: number; version: string } {
    return {
        type: 'PONG',
        timestamp,
        version,
    };
}

export function postMessageEventResponse(
    target: EventResponseTarget,
    message: unknown,
): 'port' | 'source' | 'none' {
    if (target.ports?.[0]) {
        target.ports[0].postMessage(message);
        return 'port';
    }

    if (target.source) {
        target.source.postMessage(message);
        return 'source';
    }

    return 'none';
}

export function postPortEventResponse(
    target: EventResponseTarget,
    message: unknown,
): boolean {
    if (!target.ports?.[0]) {
        return false;
    }

    target.ports[0].postMessage(message);
    return true;
}