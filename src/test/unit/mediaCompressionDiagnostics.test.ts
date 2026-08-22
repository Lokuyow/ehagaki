import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import MediaCompressionDebugPanel from '../../components/MediaCompressionDebugPanel.svelte';
import {
    classifyMediaCompressionAudioPath,
    clearMediaCompressionDiagnosticRecords,
    formatMediaCompressionDiagnostics,
    getAacCustomEncoderState,
    getMediaCompressionDiagnosticRecords,
    isMediaCompressionDebugEnabled,
    startMediaCompressionDiagnostic,
} from '../../lib/videoCompression/mediaCompressionDiagnostics';

function setSearch(search: string): void {
    window.history.replaceState({}, '', `${search || '/'}${search ? '' : ''}`);
}

describe('media compression diagnostics', () => {
    beforeEach(() => {
        setSearch('');
        clearMediaCompressionDiagnosticRecords();
    });

    afterEach(() => {
        setSearch('');
        clearMediaCompressionDiagnosticRecords();
    });

    it('is disabled unless media-debug=1 is present', () => {
        expect(isMediaCompressionDebugEnabled('')).toBe(false);
        expect(isMediaCompressionDebugEnabled('?media-debug=0')).toBe(false);
        expect(isMediaCompressionDebugEnabled('?media-debug=1')).toBe(true);
        expect(startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }))).toBeNull();
        expect(getMediaCompressionDiagnosticRecords()).toHaveLength(0);
    });

    it('creates a readable Conversion #1 record and Clear removes records only', () => {
        setSearch('?media-debug=1');
        const session = startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }));
        expect(session?.conversionId).toBe(1);
        session?.setTrackCounts(1, 1);
        session?.setAudio(0, {
            codec: 'aac',
            sourceSampleRate: 48000,
            sourceChannels: 2,
            audioPath: 'native-aac',
        });
        session?.finish({
            file: new File(['compressed'], 'output.mp4', { type: 'video/mp4' }),
            wasCompressed: true,
        });

        const text = formatMediaCompressionDiagnostics();
        expect(text).toContain('Conversion #1');
        expect(text).toContain('audio path: native-aac');
        expect(text).toContain('total compression:');
        expect(text).not.toContain('clip.mp4');

        clearMediaCompressionDiagnosticRecords();
        expect(getMediaCompressionDiagnosticRecords()).toHaveLength(0);
        expect(getAacCustomEncoderState()).toBe('not-loaded');
    });

    it('classifies native, custom, packet-copy, and unknown paths from observed state', () => {
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'not-loaded',
            capabilityBeforeSelection: true,
        })).toEqual({ path: 'native-aac' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'not-loaded',
            capabilityBeforeSelection: false,
            capabilityAfterRegistration: true,
            registrationSucceeded: true,
        })).toEqual({ path: 'custom-aac' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'not-loaded',
            capabilityBeforeSelection: false,
            capabilityAfterRegistration: false,
        })).toEqual({ path: 'packet-copy', reason: 'aac-encode-unavailable' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: false,
            stateAtStart: 'not-loaded',
            capabilityBeforeSelection: false,
        })).toEqual({ path: 'packet-copy', reason: 'decode-unavailable' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'registered',
            capabilityBeforeSelection: true,
        })).toEqual({ path: 'custom-aac' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'loading',
            capabilityBeforeSelection: true,
        })).toEqual({ path: 'unknown' });
    });

    it('shows only in diagnostic mode and wires expand, Copy, and Clear', async () => {
        const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText: clipboardWriteText },
        });

        const withoutDebug = render(MediaCompressionDebugPanel);
        expect(withoutDebug.container.querySelector('.media-debug-panel')).toBeNull();
        withoutDebug.unmount();

        setSearch('?media-debug=1');
        const session = startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }));
        const conversionId = session?.conversionId;
        session?.finish({
            file: new File(['y'], 'output.mp4', { type: 'video/mp4' }),
            wasCompressed: true,
        });
        render(MediaCompressionDebugPanel);

        expect(screen.getByRole('button', { name: /Media Compression Debug/ }).getAttribute('aria-expanded')).toBe('false');
        await fireEvent.click(screen.getByRole('button', { name: /Media Compression Debug/ }));
        expect(document.querySelector('pre')?.textContent).toContain(`Conversion #${conversionId}`);
        await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
        expect(clipboardWriteText).toHaveBeenCalledWith(expect.stringContaining(`Conversion #${conversionId}`));
        await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
        expect(document.querySelector('pre')?.textContent).toContain('No conversions recorded.');
        expect(getAacCustomEncoderState()).toBe('not-loaded');
    });
});
