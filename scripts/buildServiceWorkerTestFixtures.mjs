import { resolve } from 'node:path';
import { build } from 'vite';

export default async function buildServiceWorkerTestFixtures() {
    const previousVercel = process.env.VERCEL;
    try {
        for (const target of ['pages', 'root']) {
            if (target === 'root') process.env.VERCEL = '1';
            else delete process.env.VERCEL;
            await build({
                logLevel: 'warn',
                build: { outDir: resolve('node_modules/.cache/sw-update', target) },
            });
        }
    } finally {
        if (previousVercel === undefined) delete process.env.VERCEL;
        else process.env.VERCEL = previousVercel;
    }
}
