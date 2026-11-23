import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync, tick } from 'svelte';
import { locale, waitLocale } from 'svelte-i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../../i18n';
import ReasonInput from '../../components/ReasonInput.svelte';
import {
    contentWarningReasonStore,
    contentWarningStore,
} from '../../stores/tagsStore.svelte';
import {
    bottomPositionStore,
    keyboardHeightStore,
    reasonInputVisibleStore,
} from '../../stores/uiStore.svelte';

describe('ReasonInput', () => {
    beforeEach(async () => {
        locale.set('ja');
        await waitLocale('ja');
        contentWarningStore.reset();
        contentWarningReasonStore.reset();
        reasonInputVisibleStore.set(false);
        vi.restoreAllMocks();
    });

    it('Content Warningが有効なときに入力欄を表示する', async () => {
        contentWarningStore.set(true);

        render(ReasonInput);
        await tick();

        expect(screen.getByRole('textbox')).toBeTruthy();
    });

    it('inputイベントで入力値がstoreへ反映される', async () => {
        contentWarningStore.set(true);

        render(ReasonInput);
        await tick();

        const input = screen.getByRole('textbox');
        await fireEvent.input(input, { target: { value: 'adult content' } });
        await tick();

        expect(contentWarningReasonStore.value).toBe('adult content');
    });

    it('changeイベントで同じ値を重複してstoreへ書き込まない', async () => {
        contentWarningStore.set(true);

        render(ReasonInput);
        await tick();

        const input = screen.getByRole('textbox');
        const setSpy = vi.spyOn(contentWarningReasonStore, 'set');

        await fireEvent.input(input, { target: { value: 'adult content' } });
        await fireEvent.change(input, { target: { value: 'adult content' } });
        await tick();

        expect(setSpy).toHaveBeenCalledTimes(1);
        expect(contentWarningReasonStore.value).toBe('adult content');
    });

    it('キーボード同期で uiStore の状態が変わっても表示状態を再同期しない', async () => {
        contentWarningStore.set(true);

        render(ReasonInput);
        await tick();

        const setSpy = vi.spyOn(reasonInputVisibleStore, 'set');
        keyboardHeightStore.set(300);
        bottomPositionStore.set(300);
        flushSync();
        keyboardHeightStore.set(0);
        bottomPositionStore.set(66);
        flushSync();

        expect(setSpy).not.toHaveBeenCalled();
    });

    it('Content Warningが無効なときに入力欄を表示しない', async () => {
        contentWarningStore.set(false);

        render(ReasonInput);
        await tick();

        expect(screen.queryByRole('textbox')).toBeNull();
    });
});
