import type { RelayManager } from '../lib/relayManager';
import { RelayConfigUtils } from '../lib/relayConfigUtils';
import type { RelayConfig } from '../lib/types';

// --- リレー設定管理 ---
let relayManagerInstance: RelayManager | null = null;

let writeRelays = $state<string[]>([]);
let relayConfig = $state<RelayConfig | null>(null);
let showRelays = $state(false);
let isSwUpdating = $state(false);
let relayListUpdated = $state<number>(0);

export const writeRelaysStore = {
    get value() { return writeRelays; },
    set: (value: string[]) => { writeRelays = value; }
};

export const relayConfigStore = {
    get value() { return relayConfig; },
    set: (value: RelayConfig | null) => { relayConfig = value; }
};

export const showRelaysStore = {
    get value() { return showRelays; },
    set: (value: boolean) => { showRelays = value; }
};

export const isSwUpdatingStore = {
    get value() { return isSwUpdating; },
    set: (value: boolean) => { isSwUpdating = value; }
};

export const relayListUpdatedStore = {
    get value() { return relayListUpdated; },
    set: (value: number) => { relayListUpdated = value; }
};

/**
 * RelayManagerインスタンスを設定（依存性注入）
 */
export function setRelayManager(relayManager: RelayManager): void {
    relayManagerInstance = relayManager;
}

/**
 * 保存済みリレー設定を読み込んでストアに設定
 */
export async function loadRelayConfigFromStorage(pubkeyHex: string): Promise<void> {
    if (!relayManagerInstance || !pubkeyHex) {
        relayConfigStore.set(null);
        writeRelaysStore.set([]);
        return;
    }

    const result = await relayManagerInstance.loadRelayConfigForUI(pubkeyHex);
    if (!result) {
        relayConfigStore.set(null);
        writeRelaysStore.set([]);
        return;
    }

    relayConfigStore.set(result.relayConfig);
    writeRelaysStore.set(result.writeRelays);
}

/**
 * リレー設定をストアに反映
 */
export async function saveRelayConfigToStorage(pubkeyHex: string, config: RelayConfig): Promise<void> {
    if (!pubkeyHex) return;

    try {
        relayConfigStore.set(config);

        const writeRelaysList = RelayConfigUtils.extractWriteRelays(config);
        writeRelaysStore.set(writeRelaysList);

        relayListUpdatedStore.set(relayListUpdated + 1);
    } catch (error) {
        console.error('リレー設定の保存エラー:', error);
    }
}
