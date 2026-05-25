import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Button from '../../components/Button.svelte';

describe('Button floatingMessage', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('onClick 成功後に FloatingMessage を表示して自動で閉じる', async () => {
        vi.useFakeTimers();

        render(Button, {
            props: {
                ariaLabel: 'copy',
                floatingMessage: 'コピーしました',
                floatingMessageDuration: 1000,
                onClick: () => true,
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: 'copy' }));

        expect(screen.getByRole('status').textContent).toContain('コピーしました');

        vi.advanceTimersByTime(1000);
        await tick();

        expect(screen.queryByRole('status')).toBeNull();
    });

    it('onClick が false を返した場合は FloatingMessage を表示しない', async () => {
        render(Button, {
            props: {
                ariaLabel: 'copy',
                floatingMessage: 'コピーしました',
                onClick: () => false,
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: 'copy' }));

        expect(screen.queryByText('コピーしました')).toBeNull();
    });

    it('async onClick 成功後も FloatingMessage を表示する', async () => {
        vi.useFakeTimers();

        render(Button, {
            props: {
                ariaLabel: 'copy',
                floatingMessage: 'コピーしました',
                onClick: async () => {
                    await Promise.resolve();
                    return true;
                },
                floatingMessageDuration: 1000,
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: 'copy' }));
        await tick();

        expect(screen.getByRole('status').textContent).toContain('コピーしました');

        vi.advanceTimersByTime(1000);
        await tick();

        expect(screen.queryByRole('status')).toBeNull();
    });
});
