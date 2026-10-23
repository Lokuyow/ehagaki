import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/** @param {string} host @param {Iterable<number>} candidates */
export async function findBindablePlaywrightPort(host, candidates) {
    for (const port of candidates) {
        const server = createServer();
        try {
            /** @type {Promise<void>} */
            const listening = new Promise((resolve, reject) => {
                server.once('error', reject);
                server.listen({ host, port, exclusive: true }, resolve);
            });
            await listening;
        } catch (error) {
            const code = typeof error === 'object' && error !== null && 'code' in error
                ? error.code : undefined;
            if (code === 'EADDRINUSE' || code === 'EACCES') continue;
            throw error;
        }
        /** @type {Promise<void>} */
        const closed = new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        await closed;
        return port;
    }
    throw new Error('No bindable Playwright port in the automatic range.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const [host, rawMin, rawMax, rawStart] = process.argv.slice(2);
    const [min, max, start] = [rawMin, rawMax, rawStart].map(Number);
    if (!host || ![min, max, start].every(Number.isInteger)
        || min < 1024 || max > 65536 || min >= max || start < min || start >= max) {
        throw new Error('Invalid Playwright port probe arguments.');
    }
    function* candidates() {
        for (let offset = 0; offset < max - min; offset++) {
            yield min + (start - min + offset) % (max - min);
        }
    }
    findBindablePlaywrightPort(host, candidates())
        .then(port => process.stdout.write(String(port)))
        .catch(error => { console.error(error.message); process.exitCode = 1; });
}
