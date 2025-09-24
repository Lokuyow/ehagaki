import { vi } from 'vitest';
import { writable } from 'svelte/store';

export const useRegisterSW = vi.fn((options) => ({
    needRefresh: writable(false),
    updateServiceWorker: vi.fn(),
    offlineReady: writable(false)
}));

export default {
    useRegisterSW
};
