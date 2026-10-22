import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const switchesPath = resolve(dirname(require.resolve('playwright-core/package.json')),
    'lib/server/chromium/chromiumSwitches.js');

function installedSwitches(platform: string): string[] {
    const module = { exports: {} };
    runInNewContext(readFileSync(switchesPath, 'utf8'), { module, process: { platform, env: {} } });
    return (module.exports as { chromiumSwitches: (assistantMode: boolean) => string[] })
        .chromiumSwitches(false);
}

describe('installed Playwright Chromium TCP workaround', () => {
    it('disables Windows port randomization without replacing other default switches', () => {
        const linux = installedSwitches('linux');
        const windows = installedSwitches('win32');
        const disabled = (args: string[]) => {
            const flags = args.filter(arg => arg.startsWith('--disable-features='));
            expect(flags).toHaveLength(1);
            return flags[0].slice('--disable-features='.length).split(',');
        };
        const defaults = disabled(linux);
        expect(defaults).toEqual(expect.arrayContaining(['Translate', 'PaintHolding', 'ThirdPartyStoragePartitioning']));
        expect(defaults).not.toContain('TcpPortRandomizationWin');
        expect(disabled(windows)).toEqual([...defaults, 'TcpPortRandomizationWin']);
        expect(windows.filter(arg => !arg.startsWith('--disable-features=')))
            .toEqual(linux.filter(arg => !arg.startsWith('--disable-features=')));
    });
});
