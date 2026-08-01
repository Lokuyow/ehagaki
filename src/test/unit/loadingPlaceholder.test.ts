import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import LoadingPlaceholder from '../../components/LoadingPlaceholder.svelte';

describe('LoadingPlaceholder', () => {
    it('既存のLoaderをデフォルトで表示できる', () => {
        const { container } = render(LoadingPlaceholder, {
            props: { showLoader: true },
        });

        expect(container.querySelector('.loader-container')).not.toBeNull();
        expect(container.querySelector('.inline-spinner')).toBeNull();
    });

    it('小型spinnerをサイズ指定付きで装飾表示できる', () => {
        const { container } = render(LoadingPlaceholder, {
            props: {
                variant: 'spinner',
                showLoader: true,
                loaderSize: 24,
                ariaHidden: true,
            },
        });

        const placeholder = container.querySelector('.loading-placeholder');
        const spinner = container.querySelector('.inline-spinner');
        expect(placeholder?.getAttribute('aria-hidden')).toBe('true');
        expect(spinner).not.toBeNull();
        expect(spinner?.getAttribute('style')).toContain('--loader-size: 24px');
        expect(container.querySelector('.loader-container')).toBeNull();
    });
});
