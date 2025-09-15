import { vi } from 'vitest';

export const useRegisterSW = () => ({
    needRefresh: false,
    updateServiceWorker: vi.fn()
});
