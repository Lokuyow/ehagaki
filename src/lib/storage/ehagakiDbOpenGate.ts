let ready: Promise<void> | null = null;

export function installEhagakiDbOpenGate(wait: () => Promise<void>): void {
    if (ready) return;
    ready = wait().catch((error) => {
        ready = null;
        throw error;
    });
}

export function waitForEhagakiDbOpenGate(): Promise<void> {
    return ready ?? Promise.resolve();
}

export function resetEhagakiDbOpenGateForTests(): void {
    ready = null;
}
