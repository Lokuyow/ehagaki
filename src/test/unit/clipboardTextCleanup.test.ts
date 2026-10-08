import { describe, expect, it } from 'vitest';
import { cleanupExternalRichPasteLines } from '../../lib/editor/clipboardTextCleanup';

describe('cleanupExternalRichPasteLines', () => {
    it('removes bold and strike markers while retaining surrounding text', () => {
        expect(cleanupExternalRichPasteLines([
            '**重要**',
            '__強調__',
            '~~旧仕様~~',
            '- **E–I**：説明',
            '> **重要です**',
        ])).toEqual([
            '重要',
            '強調',
            '旧仕様',
            '- E–I：説明',
            '> 重要です',
        ]);
    });

    it('removes only one-to-six leading heading markers followed by whitespace', () => {
        expect(cleanupExternalRichPasteLines([
            '# 見出し',
            '## 比較',
            '### 詳細',
            '#### 四',
            '##### 五',
            '###### 六',
            '#hashtag',
            'C#',
            '本文中の # は残す',
            '####### too many',
        ])).toEqual([
            '見出し',
            '比較',
            '詳細',
            '四',
            '五',
            '六',
            '#hashtag',
            'C#',
            '本文中の # は残す',
            '####### too many',
        ]);
    });

    it('removes fence marker lines and leaves code and surrounding line boundaries intact', () => {
        expect(cleanupExternalRichPasteLines([
            '前の文章',
            '```python',
            'def f(**kwargs):',
            '    return kwargs["__value__"]',
            '    return ~~literal~~',
            '```',
            '後の文章',
        ])).toEqual([
            '前の文章',
            'def f(**kwargs):',
            '    return kwargs["__value__"]',
            '    return ~~literal~~',
            '後の文章',
        ]);
    });

    it('preserves fenced code bytes including single backticks and empty lines', () => {
        const code = ['const value = `test`;', '', 'const other = "**literal**";'];
        expect(cleanupExternalRichPasteLines(['説明', '```ts', ...code, '```', '続き']))
            .toEqual(['説明', ...code, '続き']);
    });

    it('removes only paired single-backtick delimiters outside fences', () => {
        expect(cleanupExternalRichPasteLines([
            '`foo()`',
            'value `**kwargs` and __emphasis__',
            'unmatched ` delimiter',
            '``multi`` delimiter',
        ])).toEqual([
            'foo()',
            'value **kwargs and emphasis',
            'unmatched ` delimiter',
            '``multi`` delimiter',
        ]);
    });

    it('keeps lists, quotes, tables, links, single markers, URLs, and blank lines', () => {
        expect(cleanupExternalRichPasteLines([
            '- item',
            '1. item',
            '> quote',
            '| A | B |',
            '| --- | --- |',
            '[label](https://example.com/)',
            '![alt](https://example.com/image.png)',
            '*single* and _single_',
            'https://example.com/path#fragment',
            '',
            'after blank',
        ])).toEqual([
            '- item',
            '1. item',
            '> quote',
            '| A | B |',
            '| --- | --- |',
            '[label](https://example.com/)',
            '![alt](https://example.com/image.png)',
            '*single* and _single_',
            'https://example.com/path#fragment',
            '',
            'after blank',
        ]);
    });

    it('preserves emphasis-like characters inside HTTP URLs while cleaning surrounding text', () => {
        expect(cleanupExternalRichPasteLines([
            'https://example.com/foo__bar',
            '[label](https://example.com/foo__bar)',
            '![alt](https://example.com/foo__bar.png)',
            'foo__bar **bold** ~~strike~~',
            '**before** https://example.com/foo__bar ~~after~~',
        ])).toEqual([
            'https://example.com/foo__bar',
            '[label](https://example.com/foo__bar)',
            '![alt](https://example.com/foo__bar.png)',
            'foobar bold strike',
            'before https://example.com/foo__bar after',
        ]);
    });

    it('cleans the supplied plain representation without rebuilding its structure', () => {
        expect(cleanupExternalRichPasteLines([
            'こんな二層モデルで考えると分かりやすいです。',
            '',
            '**第1層：気質・神経の基本設定**',
            '刺激感受性、報酬感受性、覚醒水準。',
            '',
            '**第2層：その上で使う認知・判断の方略**',
            '具体を見る、抽象化する。',
            '',
            '- **E–I**：第1層の影響がかなり大きい',
            '- **J–P**：第1層＋第2層',
            '- **S–N**：第2層の影響が比較的大きい',
            '',
            '> **EI・JPは「脳の基本設定」寄り。**',
        ])).toEqual([
            'こんな二層モデルで考えると分かりやすいです。',
            '',
            '第1層：気質・神経の基本設定',
            '刺激感受性、報酬感受性、覚醒水準。',
            '',
            '第2層：その上で使う認知・判断の方略',
            '具体を見る、抽象化する。',
            '',
            '- E–I：第1層の影響がかなり大きい',
            '- J–P：第1層＋第2層',
            '- S–N：第2層の影響が比較的大きい',
            '',
            '> EI・JPは「脳の基本設定」寄り。',
        ]);
    });
});
