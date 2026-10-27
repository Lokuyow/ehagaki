import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/svelte';
import ProfileAvatar from '../../components/ProfileAvatar.svelte';

afterEach(cleanup);

describe('ProfileAvatar loading feedback', () => {
    it('distinguishes a pending profile from an account with no image', async () => {
        const view = render(ProfileAvatar, { showLoadingIndicator: true, pending: true });
        const root = () => view.container.querySelector('[data-avatar-root]')!;
        const fallback = () => view.container.querySelector('[data-avatar-fallback]')!;
        expect(root().getAttribute('aria-busy')).toBe('true');
        expect(fallback().getAttribute('data-loading')).toBe('true');
        await view.rerender({ showLoadingIndicator: true, pending: false });
        expect(root().hasAttribute('aria-busy')).toBe(false);
        expect(fallback().hasAttribute('data-loading')).toBe(false);
        expect(fallback().getAttribute('data-status')).toBe('error');
    });

    it('ends loading on the image load event and does not reset the completed state', async () => {
        const onLoadingStatusChange = vi.fn();
        const view = render(ProfileAvatar, { src: 'https://avatar.example/one.png', showLoadingIndicator: true, onLoadingStatusChange });
        const root = view.container.querySelector('[data-avatar-root]')!;
        expect(root.getAttribute('aria-busy')).toBe('true');
        await fireEvent.load(view.container.querySelector('img')!);
        expect(root.getAttribute('data-status')).toBe('loaded');
        expect(root.hasAttribute('aria-busy')).toBe(false);
        expect(onLoadingStatusChange).toHaveBeenLastCalledWith('loaded');
    });

    it('tracks a changed URL and stops loading if its image fails', async () => {
        const view = render(ProfileAvatar, { src: 'https://avatar.example/one.png', showLoadingIndicator: true });
        await fireEvent.load(view.container.querySelector('img')!);
        await view.rerender({ src: 'https://avatar.example/two.png', showLoadingIndicator: true });
        const root = view.container.querySelector('[data-avatar-root]')!;
        expect(root.getAttribute('aria-busy')).toBe('true');
        await fireEvent.error(view.container.querySelector('img')!);
        expect(root.getAttribute('data-status')).toBe('error');
        expect(root.hasAttribute('aria-busy')).toBe(false);
        expect(view.container.querySelector('[data-avatar-fallback]')!.hasAttribute('data-loading')).toBe(false);
    });

    it('keeps the existing immediate image display when the indicator is not enabled', () => {
        const view = render(ProfileAvatar, { src: 'https://avatar.example/one.png' });
        expect(view.container.querySelector('[data-avatar-root]')!.getAttribute('data-status')).toBe('loaded');
        expect(view.container.querySelector('[data-avatar-fallback]')!.hasAttribute('data-loading')).toBe(false);
    });
});
