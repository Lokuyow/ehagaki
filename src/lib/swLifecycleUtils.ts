interface ServiceWorkerLifecycleLogger {
    log: (...args: unknown[]) => void;
}

export async function processServiceWorkerInstall({
    logger,
    version,
}: {
    logger: ServiceWorkerLifecycleLogger;
    version: string;
}): Promise<void> {
    logger.log('SW installing...', version);
    logger.log('SW installed, waiting for user action');
}

export async function processServiceWorkerActivate({
    logger,
    version,
    cleanupOldCaches,
    claimClients,
}: {
    logger: ServiceWorkerLifecycleLogger;
    version: string;
    cleanupOldCaches: () => Promise<void>;
    claimClients: () => Promise<void>;
}): Promise<void> {
    logger.log('SW activating...', version);
    await cleanupOldCaches();
    await claimClients();
}