import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import ProfileAvatar from '../../components/ProfileAvatar.svelte';
const pubkeyHex = 'abcdef'.repeat(10) + 'abcd';
const svg = (container: HTMLElement) => decodeURIComponent(container.querySelector<HTMLImageElement>('.profile-avatar-initial')!.src);

describe('ProfileAvatar', () => {
    it('renders generated fallbacks for missing and invalid picture URLs, preserving accessibility', async () => {
        const {container, rerender} = render(ProfileAvatar, {pubkeyHex, name: 'Alice', fallbackAriaLabel: 'Profile'});
        expect(svg(container)).toContain('>A</text>');
        expect(container.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Profile');
        await rerender({pubkeyHex, displayName: '山田', src: 'javascript:alert(1)', fallbackAriaLabel: ''});
        expect(svg(container)).toContain('>山</text>');
        expect(container.querySelector('[role="img"]')).toBeNull();
    });
    it('updates names and account colors', async () => {
        const {container, rerender} = render(ProfileAvatar, {pubkeyHex, name: 'Alice'});
        expect(svg(container)).toContain('#abcdef');
        await rerender({pubkeyHex: '123456' + '0'.repeat(58), name: 'Bob'});
        expect(svg(container)).toContain('#123456');
        expect(svg(container)).toContain('>B</text>');
    });
    it('responds to real image error events', async () => {
        const {container} = render(ProfileAvatar, {pubkeyHex, name: 'A', src: 'https://example.com/avatar.png'});
        await fireEvent.error(container.querySelector('[data-avatar-image]')!);
        await tick();
        expect(container.querySelector('[data-avatar-root]')?.getAttribute('data-status')).toBe('error');
    });
    it('shows the generated icon on image failure and allows recovery', async () => {
        const {container, rerender} = render(ProfileAvatar, {pubkeyHex, name: 'A', src: 'https://example.com/avatar.png', loadingStatus: 'loaded'});
        await rerender({pubkeyHex, name: 'A', src: 'https://example.com/avatar.png', loadingStatus: 'error'});
        await tick();
        expect(svg(container)).toContain('>A</text>');
        await rerender({pubkeyHex, name: 'A', src: 'https://example.com/new.png', loadingStatus: 'loaded'});
        await tick();
        expect((container.querySelector('[data-avatar-fallback]') as HTMLElement).style.display).toBe('none');
    });
});
