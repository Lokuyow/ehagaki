import { EHAGAKI_DB_NAME, EHAGAKI_DB_NATIVE_VERSION } from "./ehagakiDbConstants";
import { migrateEhagakiIndexedDb, upgradeEhagakiDatabase } from "./ehagakiDbMigration";

export const EHAGAKI_DB_CAPABILITY_PROBE = "EHAGAKI_DB_CAPABILITY_PROBE";
export const EHAGAKI_DB_CAPABILITY_REPORT = "EHAGAKI_DB_CAPABILITY_REPORT";
export const EHAGAKI_DB_UPGRADE_REQUEST = "EHAGAKI_DB_UPGRADE_REQUEST";
export const EHAGAKI_DB_UPGRADE_COMPLETE = "EHAGAKI_DB_UPGRADE_COMPLETE";
export const EHAGAKI_DB_CAPABILITY_TIMEOUT_MS = 1500;

interface UpgradeClient {
    id: string;
    postMessage?: (message: unknown) => void;
}

interface UpgradeClients {
    matchAll: (options: { type: "window"; includeUncontrolled: true }) => Promise<UpgradeClient[]>;
}

export function createEhagakiDbUpgradeController(deps: {
    indexedDb: IDBFactory;
    clients: UpgradeClients;
    onBlocked?: () => void;
    onBlockedResolved?: () => void;
    timeoutMs?: number;
}) {
    const pendingReports = new Map<string, (version: number) => void>();
    let inFlight: Promise<boolean> | null = null;

    async function currentNativeVersion(): Promise<number> {
        const names = typeof deps.indexedDb.databases === "function"
            ? await deps.indexedDb.databases()
            : null;
        if (names && !names.some((entry) => entry.name === EHAGAKI_DB_NAME)) {
            return 0;
        }
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = deps.indexedDb.open(EHAGAKI_DB_NAME);
            request.onupgradeneeded = (event) => {
                migrateEhagakiIndexedDb(
                    request.result as never,
                    request.transaction as never,
                    event.oldVersion,
                );
            };
            request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
            request.onsuccess = () => resolve(request.result);
        });
        const version = db.version;
        db.close();
        return version;
    }

    async function clientsAcceptCurrentSchema(clients: UpgradeClient[]): Promise<boolean> {
        if (clients.length === 0) return false;
        const timeoutMs = deps.timeoutMs ?? EHAGAKI_DB_CAPABILITY_TIMEOUT_MS;
        const reports = new Map<string, number>();
        await Promise.all(clients.map((client) => new Promise<void>((resolve) => {
            const timer = setTimeout(() => {
                pendingReports.delete(client.id);
                resolve();
            }, timeoutMs);
            pendingReports.set(client.id, (version) => {
                clearTimeout(timer);
                pendingReports.delete(client.id);
                reports.set(client.id, version);
                resolve();
            });
            client.postMessage?.({ type: EHAGAKI_DB_CAPABILITY_PROBE });
        })));
        return clients.every((client) => (reports.get(client.id) ?? 0) >= EHAGAKI_DB_NATIVE_VERSION);
    }

    async function notify(type: string): Promise<void> {
        const clients = await deps.clients.matchAll({ type: "window", includeUncontrolled: true });
        clients.forEach((client) => client.postMessage?.({ type }));
    }

    async function run(): Promise<boolean> {
        const version = await currentNativeVersion();
        if (version >= EHAGAKI_DB_NATIVE_VERSION) {
            await notify(EHAGAKI_DB_UPGRADE_COMPLETE);
            return true;
        }
        const clients = await deps.clients.matchAll({ type: "window", includeUncontrolled: true });
        if (!await clientsAcceptCurrentSchema(clients)) {
            await notify("EHAGAKI_DB_UPGRADE_BLOCKED");
            return false;
        }
        await upgradeEhagakiDatabase(deps.indexedDb, {
            onBlocked: deps.onBlocked,
            onBlockedResolved: deps.onBlockedResolved,
        });
        await notify(EHAGAKI_DB_UPGRADE_COMPLETE);
        return true;
    }

    function requestUpgrade(): Promise<boolean> {
        if (!inFlight) {
            inFlight = run().finally(() => {
                inFlight = null;
            });
        }
        return inFlight;
    }

    return {
        requestUpgrade,
        handleClientMessage(event: { source?: { id?: string } | null; data?: { type?: string; supportedNativeVersion?: number } }): void {
            if (event.data?.type === EHAGAKI_DB_CAPABILITY_REPORT) {
                const id = event.source?.id;
                const version = event.data.supportedNativeVersion;
                if (id && typeof version === "number") pendingReports.get(id)?.(version);
                return;
            }
            if (event.data?.type === EHAGAKI_DB_UPGRADE_REQUEST) {
                void requestUpgrade();
            }
        },
    };
}
