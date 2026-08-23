import { describe, expect, it, vi } from 'vitest';

import { resolveNip07AutoLoginSession } from '../../lib/bootstrap/nip07AutoLoginBootstrap';

function createDeps(authenticateWithNip07: ReturnType<typeof vi.fn>) {
    return { authenticateWithNip07, console: { error: vi.fn() } };
}

describe('resolveNip07AutoLoginSession', () => {
    it('既に認証済みならNIP-07認証を呼ばない', async () => {
        const deps = createDeps(vi.fn());

        const result = await resolveNip07AutoLoginSession(
            { hasAuth: true, pubkeyHex: 'restored-pubkey' },
            deps,
        );

        expect(result).toEqual({ hasAuth: true, pubkeyHex: 'restored-pubkey' });
        expect(deps.authenticateWithNip07).not.toHaveBeenCalled();
    });

    it('未認証ならNIP-07で認証し、その結果を返す', async () => {
        const deps = createDeps(
            vi.fn().mockResolvedValue({ success: true, pubkeyHex: 'host-pubkey' }),
        );

        const result = await resolveNip07AutoLoginSession({ hasAuth: false }, deps);

        expect(deps.authenticateWithNip07).toHaveBeenCalledOnce();
        expect(result).toEqual({ hasAuth: true, pubkeyHex: 'host-pubkey' });
    });

    it('拡張が無い場合は元の結果を維持し、エラーログを出さない', async () => {
        const deps = createDeps(
            vi.fn().mockResolvedValue({ success: false, error: 'nip07_not_available' }),
        );

        const result = await resolveNip07AutoLoginSession({ hasAuth: false }, deps);

        expect(result).toEqual({ hasAuth: false });
        expect(deps.console.error).not.toHaveBeenCalled();
    });

    it('例外が出ても投げ返さず元の結果を維持する', async () => {
        const deps = createDeps(vi.fn().mockRejectedValue(new Error('auto login failed')));

        const result = await resolveNip07AutoLoginSession({ hasAuth: false }, deps);

        expect(result).toEqual({ hasAuth: false });
        expect(deps.console.error).toHaveBeenCalledWith(
            'NIP-07自動ログイン中にエラー',
            { stage: 'auto-login', reason: 'unexpected' },
        );
    });
});
