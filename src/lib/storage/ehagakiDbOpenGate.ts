let ready: Promise<void> | null = null;

export function installEhagakiDbOpenGate(wait: () => Promise<void>): void {
    if (ready) return;
    // A failed or unfinished wait must keep later opens waiting. Clearing it
    // would let Dexie open before the shared migration finishes.
    ready = wait();
}

export function waitForEhagakiDbOpenGate(): Promise<void> {
    return ready ?? Promise.resolve();
}

export function resetEhagakiDbOpenGateForTests(): void {
    ready = null;
}
