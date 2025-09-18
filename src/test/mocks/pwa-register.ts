import { vi } from 'vitest';

export const useRegisterSW = vi.fn(() => ({
    needRefresh: false,
    updateServiceWorker: vi.fn(),
    offlineReady: false
}));

export default {
    useRegisterSW
};
