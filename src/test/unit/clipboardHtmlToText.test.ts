import { describe, expect, it } from 'vitest';
import { htmlToPlainTextLines } from '../../lib/editor/clipboardHtmlToText';

describe('htmlToPlainTextLines', () => {
    it.each([
        ['heading and paragraph', '<h2>Weekly update</h2><p>Body text</p>', '【Weekly update】\n\nBody text'],
        ['h1 and h2 headings use bracket markers', '<h1>Main</h1><h2>Section</h2>', '【Main】\n\n【Section】'],
        ['h3 through h6 headings use square markers', '<h3>Third</h3><h4>Fourth</h4><h5>Fifth</h5><h6>Sixth</h6>', '■ Third\n\n■ Fourth\n\n■ Fifth\n\n■ Sixth'],
        ['paragraphs and inline formatting', '<p><strong>Bold</strong> text</p><p><em>Italic</em> and <s>strike</s></p>', 'Bold text\n\nItalic and strike'],
        ['unordered list', '<ul><li>First</li><li>Second</li></ul>', '• First\n• Second'],
        ['ordered list with start and item value', '<ol start="3"><li>Third</li><li value="8">Eighth</li><li>Ninth</li></ol>', '3. Third\n8. Eighth\n9. Ninth'],
        ['reversed ordered list', '<ol reversed><li>Second</li><li>First</li></ol>', '2. Second\n1. First'],
        ['nested list', '<ul><li>Parent<ul><li>Child</li></ul></li><li>Tail</li></ul>', '• Parent\n  • Child\n• Tail'],
        ['nested ordered list', '<ol start="4"><li>Parent<ol><li>Child</li></ol></li></ol>', '4. Parent\n  1. Child'],
        ['emphasis and inline code in list items', '<ul><li><strong>Bold</strong> item</li><li><em>Italic</em> <code>literal()</code></li></ul>', '• Bold item\n• Italic literal()'],
        ['blockquote lines', '<blockquote><p>First<br>Second</p><p>Third</p></blockquote>', '> First\n> Second\n> \n> Third'],
        ['nested blockquote', '<blockquote><p>Outer</p><blockquote><p>Inner</p></blockquote></blockquote>', '> Outer\n> \n> > Inner'],
        ['preformatted whitespace is preserved inside code markers', '<pre><code>  const x = 1;\n\n\treturn x;  </code></pre>', '［コード］\n  const x = 1;\n\n\treturn x;  \n［/コード］'],
        ['line breaks and horizontal rule', '<p>First<br>line</p><hr><p>Last</p>', 'First\nline\n\nLast'],
        ['paragraph list mixture', '<p>Intro</p><ul><li>First</li><li>Second</li></ul><p>Finish</p>', 'Intro\n\n• First\n• Second\n\nFinish'],
        ['uppercase tags, attributes, and wrapper elements', '<DIV class="copied"><H3 id="title">Title</H3><p class="body">Body</p></DIV>', '■ Title\n\nBody'],
        ['three-column comparison table', '<table><thead><tr><th></th><th>A</th><th>B</th><th>C</th></tr></thead><tbody><tr><th scope="row">性能</th><td>高</td><td>中</td><td>低</td></tr><tr><th scope="row">価格</th><td>高</td><td>安</td><td>中</td></tr></tbody></table>', '① A\n② B\n③ C\n\n〈性能〉\n① 高\n② 中\n③ 低\n\n〈価格〉\n① 高\n② 安\n③ 中'],
        ['generic table rows retain column labels', '<table><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody><tr><td>Ada</td><td>Engineer</td></tr><tr><td>Lin</td><td>Designer</td></tr></tbody></table>', 'Name: Ada / Role: Engineer\nName: Lin / Role: Designer'],
        ['table followed by heading paragraph and list', '<table><thead><tr><th></th><th>A</th><th>B</th></tr></thead><tbody><tr><th>速度</th><td>速い</td><td>普通</td></tr></tbody></table><h2>続き</h2><p>本文</p><ul><li>項目</li></ul>', '① A\n② B\n\n〈速度〉\n① 速い\n② 普通\n\n【続き】\n\n本文\n\n• 項目'],
        ['HTML entities in link destinations', '<p><a href="https://example.com/docs?a=1&amp;b=2#guide">Read docs</a></p>', 'Read docs (https://example.com/docs?a=1&b=2#guide)'],
        ['same HTTP URL in label and destination', '<p><a href="https://example.com/guide">https://example.com/guide</a></p>', 'https://example.com/guide'],
        ['different HTTP URL in URL-shaped label', '<p><a href="https://target.example/path">https://label.example/path</a></p>', 'https://label.example/path (https://target.example/path)'],
        ['relative URL without resolving it against a base', '<p><a href="../guide?q=1#intro">Guide</a></p>', 'Guide (../guide?q=1#intro)'],
        ['mailto URL retained as text', '<p><a href="mailto:hello@example.com">Email</a></p>', 'Email (mailto:hello@example.com)'],
        ['dangerous URL scheme omitted while its label stays', '<p><a href="javascript:alert(1)">Read more</a></p>', 'Read more'],
        ['invalid HTTP destination omitted while its label stays', '<p><a href="https://">Read more</a></p>', 'Read more'],
        ['obfuscated dangerous URL omitted', '<p><a href="java&#10;script:alert(1)">Read more</a></p>', 'Read more'],
        ['empty link text falls back to a safe URL', '<p><a href="https://example.com/reference"><span></span></a></p>', 'https://example.com/reference'],
        ['paragraph separators do not accumulate across wrappers', '<div><p>One</p></div><section><div><p>Two</p></div></section>', 'One\n\nTwo'],
    ])('converts %s to readable text', (_case, html, expected) => {
        expect(htmlToPlainTextLines(html)).toEqual(expected.split('\n'));
    });

    it.each([
        '<img alt=":wave:" src="https://example.com/wave.png" data-custom-emoji="true">',
        '<p>Text</p><video src="https://example.com/clip.mp4"></video>',
        '<svg role="img"><text>icon</text></svg>',
        '<button type="button">Action</button>',
        '<table><tr><td>Text</td></tr><tr><td><img src="https://example.com/image.png"></td></tr></table>',
        '<iframe src="https://example.com/"></iframe>',
    ])('leaves unsupported clipboard payloads to the existing paste path: %s', (html) => {
        expect(htmlToPlainTextLines(html)).toBeNull();
    });

    it.each([
        '',
        '<script>hidden()</script>',
        '<style>.hidden { display: none }</style>',
        '<p><img src="https://example.com/image.png"></p>',
    ])('returns null when HTML has no supported text: %s', (html) => {
        expect(htmlToPlainTextLines(html)).toBeNull();
    });
});
