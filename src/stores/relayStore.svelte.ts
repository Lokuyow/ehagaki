import type { RelayManager } from '../lib/relayManager';
import { RelayConfigUtils } from '../lib/relayConfigUtils';
import type { RelayConfig } from '../lib/types';
import { authState } from './authStore.svelte';
import {
    activateHostRelayConfig,
    deactivateHostRelayConfig,
} from '../lib/hostRelayRuntime';

// --- リレー設定管理 ---
let relayManagerInstance: RelayManager | null = null;

let writeRelays = $state<string[]>([]);
let relayConfig = $state<RelayConfig | null>(null);
let relayConfigSource = $state<'user' | 'host' | null>(null);
let showRelays = $state(false);
let isSwUpdating = $state(false);
let relayListUpdated = $state<number>(0);

interface RelayConfigScope {
    pubkeyHex: string | null;
    generation: number;
}

let activeRelayConfigScope: RelayConfigScope = { pubkeyHex: null, generation: 0 };

function beginRelayConfigOperation(pubkeyHex: string | null): RelayConfigScope {
    activeRelayConfigScope = {
        pubkeyHex,
        generation: activeRelayConfigScope.generation + 1,
    };
    return activeRelayConfigScope;
}

function isCurrentRelayConfigOperation(scope: RelayConfigScope): boolean {
    return activeRelayConfigScope.pubkeyHex === scope.pubkeyHex
        && activeRelayConfigScope.generation === scope.generation
        && authState.value.isAuthenticated
        && authState.value.pubkey === scope.pubkeyHex;
}

export const writeRelaysStore = {
    get value() { return writeRelays; },
    set: (value: string[]) => { writeRelays = value; }
};

export const relayConfigStore = {
    get value() { return relayConfig; },
    set: (value: RelayConfig | null) => { relayConfig = value; }
};

export const relayConfigSourceStore = {
    get value() { return relayConfigSource; },
    set: (value: 'user' | 'host' | null) => { relayConfigSource = value; },
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

export function invalidatePendingRelayConfigOperations(): void {
    activeRelayConfigScope = {
        ...activeRelayConfigScope,
        generation: activeRelayConfigScope.generation + 1,
    };
}

export function resetRelayConfigStore(): void {
    invalidatePendingRelayConfigOperations();
    activeRelayConfigScope = {
        pubkeyHex: null,
        generation: activeRelayConfigScope.generation,
    };
    if (relayConfigSource !== 'host') {
        relayConfigStore.set(null);
        writeRelaysStore.set([]);
        relayConfigSourceStore.set(null);
    }
}

/** Applies a mount-scoped effective configuration without persistence. */
export function applyHostRelayConfig(config: RelayConfig): void {
    invalidatePendingRelayConfigOperations();
    activateHostRelayConfig(config);
    relayConfigStore.set(config);
    writeRelaysStore.set(RelayConfigUtils.extractWriteRelays(config));
    relayConfigSourceStore.set('host');
}

/** Releases Host-owned runtime state when its App instance is destroyed. */
export function clearHostRelayConfig(): void {
    deactivateHostRelayConfig();
    if (relayConfigSource !== 'host') return;
    invalidatePendingRelayConfigOperations();
    relayConfigStore.set(null);
    writeRelaysStore.set([]);
    relayConfigSourceStore.set(null);
}

/**
 * 保存済みリレー設定を読み込んでストアに設定
 */
export async function loadRelayConfigFromStorage(pubkeyHex: string): Promise<void> {
    if (relayConfigSource === 'host') {
        return;
    }
    if (!relayManagerInstance || !pubkeyHex) {
        resetRelayConfigStore();
        return;
    }

    const scope = beginRelayConfigOperation(pubkeyHex);
    try {
        const result = await relayManagerInstance.loadRelayConfigForUI(pubkeyHex);
        if (!isCurrentRelayConfigOperation(scope)) return;

        if (!result) {
            relayConfigStore.set(null);
            writeRelaysStore.set([]);
            return;
        }

        relayConfigStore.set(result.relayConfig);
        writeRelaysStore.set(result.writeRelays);
        relayConfigSourceStore.set('user');
    } catch (error) {
        if (!isCurrentRelayConfigOperation(scope)) return;
        throw error;
    }
}

/**
 * リレー設定をストアに反映
 */
export async function saveRelayConfigToStorage(pubkeyHex: string, config: RelayConfig): Promise<void> {
    if (relayConfigSource === 'host') {
        return;
    }
    if (!pubkeyHex) return;

    if (!authState.value.isAuthenticated || authState.value.pubkey !== pubkeyHex) {
        return;
    }

    const scope = beginRelayConfigOperation(pubkeyHex);

    try {
        if (!isCurrentRelayConfigOperation(scope)) return;

        relayConfigStore.set(config);
        relayConfigSourceStore.set('user');

        const writeRelaysList = RelayConfigUtils.extractWriteRelays(config);
        writeRelaysStore.set(writeRelaysList);

        if (isCurrentRelayConfigOperation(scope)) {
            relayListUpdatedStore.set(relayListUpdated + 1);
        }
    } catch (error) {
        console.error('リレー設定の保存エラー:', error);
    }
}
