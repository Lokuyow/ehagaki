import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { locale, waitLocale } from 'svelte-i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../../i18n';
import ReasonInput from '../../components/ReasonInput.svelte';
import {
    contentWarningReasonStore,
    contentWarningStore,
} from '../../stores/tagsStore.svelte';
import { reasonInputVisibleStore } from '../../stores/uiStore.svelte';

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

    it('Content Warningが無効なときに入力欄を表示しない', async () => {
        contentWarningStore.set(false);

        render(ReasonInput);
        await tick();

        expect(screen.queryByRole('textbox')).toBeNull();
    });
});
