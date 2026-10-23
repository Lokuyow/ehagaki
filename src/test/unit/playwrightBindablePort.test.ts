import { createServer, type Server } from 'node:net';
import { describe, expect, it } from 'vitest';
import { findBindablePlaywrightPort } from '../../../scripts/findBindablePlaywrightPort.mjs';

async function listeningServer(): Promise<{ server: Server; port: number }> {
    const server = createServer();
    await new Promise<void>((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Missing bound TCP port');
    return { server, port: address.port };
}

const close = (server: Server) => new Promise<void>((resolve, reject) =>
    server.close(error => error ? reject(error) : resolve()));

describe('Playwright automatic port bind probe', () => {
    it('skips a busy candidate and releases the selected port for the web server', async () => {
        const occupied = await listeningServer();
        const available = await listeningServer();
        await close(available.server);
        try {
            expect(await findBindablePlaywrightPort('127.0.0.1', [occupied.port, available.port]))
                .toBe(available.port);
            const owner = createServer();
            await new Promise<void>((resolve, reject) => {
                owner.once('error', reject);
                owner.listen(available.port, '127.0.0.1', resolve);
            });
            await close(owner);
        } finally { await close(occupied.server); }
    });

    it('fails rather than returning an unusable port when every candidate is busy', async () => {
        const occupied = await listeningServer();
        try {
            await expect(findBindablePlaywrightPort('127.0.0.1', [occupied.port]))
                .rejects.toThrow('No bindable Playwright port');
        } finally { await close(occupied.server); }
    });
});
