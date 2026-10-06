import DOMPurify from 'dompurify';
import { validateAndNormalizeUrl } from '../utils/editorUrlUtils';

const HARD_LINE_BREAK = '\uE000';
const ESCAPE_MARKER = '\uE001';
const ESCAPED_ESCAPE_MARKER = '\uE002';

type TextBlock = { type: 'text'; text: string };
type CodeBlock = { type: 'code'; text: string };
type RuleBlock = { type: 'rule' };
type QuoteBlock = { type: 'quote'; blocks: ClipboardBlock[] };
type ListBlock = {
    type: 'list';
    ordered: boolean;
    start: number;
    step: 1 | -1;
    items: Array<{ blocks: ClipboardBlock[]; value: number | null }>;
};
type ClipboardBlock = TextBlock | CodeBlock | RuleBlock | QuoteBlock | ListBlock;

const IGNORED_TAGS = new Set([
    'base',
    'head',
    'link',
    'meta',
    'noscript',
    'script',
    'style',
    'template',
    'title',
]);

const UNSUPPORTED_TAGS = new Set([
    'audio',
    'button',
    'canvas',
    'embed',
    'form',
    'iframe',
    'img',
    'input',
    'object',
    'picture',
    'select',
    'svg',
    'textarea',
    'video',
]);

const BLOCK_TAGS = new Set([
    'address',
    'article',
    'aside',
    'dd',
    'details',
    'dialog',
    'div',
    'dl',
    'dt',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'header',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'main',
    'nav',
    'ol',
    'p',
    'pre',
    'section',
    'ul',
    'table',
]);

function hasUnsupportedContent(root: ParentNode): boolean {
    return Array.from(root.querySelectorAll('*')).some((element) =>
        UNSUPPORTED_TAGS.has(element.tagName.toLowerCase()),
    );
}

function safeHrefFromAnchor(anchor: HTMLAnchorElement): string | null {
    const detachedAnchor = anchor.ownerDocument.createElement('a');
    const originalHref = anchor.getAttribute('href');
    if (originalHref === null) return null;

    detachedAnchor.setAttribute('href', originalHref);
    const sanitized = DOMPurify.sanitize(detachedAnchor, {
        ALLOWED_TAGS: ['a'],
        ALLOWED_ATTR: ['href'],
        RETURN_DOM_FRAGMENT: true,
    });
    const href = sanitized.querySelector('a')?.getAttribute('href');
    if (!href) return null;

    const absoluteHttpUrl = validateAndNormalizeUrl(href);
    if (absoluteHttpUrl) return absoluteHttpUrl;

    if (/^https?:/i.test(href)) return null;

    if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(href)) {
        return href;
    }

    return href;
}

function sameDestination(displayText: string, href: string): boolean {
    const normalizedDisplayUrl = validateAndNormalizeUrl(displayText);
    const normalizedHrefUrl = validateAndNormalizeUrl(href);

    if (normalizedDisplayUrl && normalizedHrefUrl) {
        return normalizedDisplayUrl === normalizedHrefUrl;
    }

    return displayText === href;
}

function normalizeInlineWhitespace(value: string): string {
    return value.replace(/[\t\n\f\r \u00a0]+/g, ' ');
}

function escapeTextMarkers(text: string): string {
    return text
        .replaceAll(ESCAPE_MARKER, `${ESCAPE_MARKER}${ESCAPED_ESCAPE_MARKER}`)
        .replaceAll(HARD_LINE_BREAK, ESCAPE_MARKER);
}

function readInlineNodes(nodes: Node[]): string {
    return nodes.map((node) => readInlineText(node)).join('');
}

function readTableCellNodes(nodes: Node[]): string {
    const parts: string[] = [];
    let inlineText = '';

    const flushInline = () => {
        if (inlineText.trim()) parts.push(inlineText.trim());
        inlineText = '';
    };

    for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            inlineText += escapeTextMarkers(node.textContent ?? '');
            continue;
        }
        if (!(node instanceof Element)) continue;

        const tag = node.tagName.toLowerCase();
        if (IGNORED_TAGS.has(tag) || UNSUPPORTED_TAGS.has(tag)) continue;
        if (tag === 'br') {
            inlineText += ' ';
            continue;
        }

        if (BLOCK_TAGS.has(tag) || tag === 'blockquote' || tag === 'li' || tag === 'tr') {
            flushInline();
            const blockText = readTableCellNodes(Array.from(node.childNodes));
            if (blockText.trim()) parts.push(blockText.trim());
            continue;
        }

        inlineText += readInlineText(node);
    }

    flushInline();
    return parts.join(' ');
}

function tableCellText(cell: Element): string {
    return decodeHardLineBreaks(readTableCellNodes(Array.from(cell.childNodes)))
        .replace(/[\t\n\f\r \u00a0]+/g, ' ')
        .trim();
}

function isHeaderRow(row: HTMLTableRowElement): boolean {
    return row.parentElement?.tagName.toLowerCase() === 'thead' ||
        (row.cells.length > 0 && Array.from(row.cells).every((cell) => cell.tagName.toLowerCase() === 'th'));
}

function tableText(table: HTMLTableElement): string {
    const rows = Array.from(table.querySelectorAll('tr'))
        .filter((row) => row.closest('table') === table)
        .map((row) => ({ element: row, cells: Array.from(row.cells) }))
        .filter(({ cells }) => cells.length > 0);
    if (rows.length === 0) return '';

    const caption = table.caption ? tableCellText(table.caption) : '';
    const header = isHeaderRow(rows[0].element) ? rows[0].cells : null;
    const renderedRows = rows.map(({ cells }) =>
        `| ${cells.map(tableCellText).map((cell) => cell.replaceAll('|', '\\|')).join(' | ')} |`,
    );
    if (header) {
        const separator = `| ${header.map(() => '---').join(' | ')} |`;
        renderedRows.splice(1, 0, separator);
    }
    const content = renderedRows.join('\n');

    return caption ? `${caption}\n\n${content}` : content;
}

function readInlineText(node: Node, inPre = false): string {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        const escaped = text.replaceAll(HARD_LINE_BREAK, `${HARD_LINE_BREAK}${HARD_LINE_BREAK}`);
        return inPre ? escaped : escaped.replace(/[\t\n\f\r \u00a0]+/g, ' ');
    }

    if (!(node instanceof Element)) return '';

    const tag = node.tagName.toLowerCase();
    if (IGNORED_TAGS.has(tag) || UNSUPPORTED_TAGS.has(tag)) return '';
    if (tag === 'br') return HARD_LINE_BREAK;

    if (tag === 'a' && node instanceof HTMLAnchorElement) {
        const rawDisplayText = Array.from(node.childNodes)
            .map((child) => readInlineText(child, inPre))
            .join('');
        if (inPre) return rawDisplayText;

        const displayText = normalizeInlineWhitespace(rawDisplayText).trim();
        const href = safeHrefFromAnchor(node);

        if (!href || !displayText || sameDestination(displayText, href)) {
            return displayText || href || '';
        }

        return `${displayText} (${href})`;
    }

    const content = Array.from(node.childNodes)
        .map((child) => readInlineText(child, inPre || tag === 'pre'))
        .join('');
    return inPre || tag === 'pre' ? content : normalizeInlineWhitespace(content);
}

function paragraphText(text: string): TextBlock | null {
    const normalized = normalizeInlineWhitespace(text).trim();
    return normalized ? { type: 'text', text: normalized } : null;
}

function listBlock(element: HTMLOListElement | HTMLUListElement): ListBlock {
    const ordered = element.tagName.toLowerCase() === 'ol';
    const items = Array.from(element.children)
        .filter((child): child is HTMLLIElement => child.tagName.toLowerCase() === 'li')
        .map((item) => {
            const value = item.getAttribute('value') ?? '';
            const explicitValue = /^[+-]?\d+$/.test(value) ? Number(value) : NaN;
            return {
                blocks: parseFlow(Array.from(item.childNodes)),
                value: ordered && Number.isSafeInteger(explicitValue) ? explicitValue : null,
            };
        });
    const reversed = ordered && (element as HTMLOListElement).reversed;
    const defaultStart = reversed ? items.length : 1;
    const start = element.getAttribute('start') ?? '';
    const explicitStart = ordered && /^[+-]?\d+$/.test(start) ? Number(start) : NaN;

    return {
        type: 'list',
        ordered,
        start: Number.isSafeInteger(explicitStart) ? explicitStart : defaultStart,
        step: reversed ? -1 : 1,
        items,
    };
}

function parseFlow(nodes: Node[]): ClipboardBlock[] {
    const blocks: ClipboardBlock[] = [];
    let inlineText = '';

    const flushInline = () => {
        const block = paragraphText(inlineText);
        if (block) blocks.push(block);
        inlineText = '';
    };

    for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent ?? '';
            if (text.trim() || inlineText) inlineText += text;
            continue;
        }

        if (!(node instanceof Element)) continue;

        const tag = node.tagName.toLowerCase();
        if (IGNORED_TAGS.has(tag) || UNSUPPORTED_TAGS.has(tag)) continue;

        if (tag === 'ol' || tag === 'ul') {
            flushInline();
            blocks.push(listBlock(node as HTMLOListElement | HTMLUListElement));
            continue;
        }

        if (tag === 'blockquote') {
            flushInline();
            blocks.push({ type: 'quote', blocks: parseFlow(Array.from(node.childNodes)) });
            continue;
        }

        if (/^h[1-6]$/.test(tag)) {
            flushInline();
            const heading = normalizeInlineWhitespace(
                decodeHardLineBreaks(readInlineNodes(Array.from(node.childNodes))).replace(/\n/g, ' '),
            ).trim();
            if (heading) {
                blocks.push({
                    type: 'text',
                    text: tag === 'h1' || tag === 'h2' ? `【${heading}】` : `■ ${heading}`,
                });
            }
            continue;
        }

        if (tag === 'hr') {
            flushInline();
            blocks.push({ type: 'rule' });
            continue;
        }

        if (tag === 'table') {
            flushInline();
            const text = tableText(node as HTMLTableElement);
            if (text) blocks.push({ type: 'text', text });
            continue;
        }

        if (tag === 'pre') {
            flushInline();
            blocks.push({ type: 'code', text: readInlineText(node, true) });
            continue;
        }

        if (BLOCK_TAGS.has(tag)) {
            flushInline();
            blocks.push(...parseFlow(Array.from(node.childNodes)));
            continue;
        }

        inlineText += readInlineText(node);
    }

    flushInline();
    return blocks;
}

function renderListItem(
    blocks: ClipboardBlock[],
    marker: string,
    depth: number,
): string {
    const indentation = '  '.repeat(depth);
    let output = '';
    let previousType: ClipboardBlock['type'] | null = null;

    for (const block of blocks) {
        let rendered = '';
        if (block.type === 'text') {
            const lines = block.text.split(HARD_LINE_BREAK);
            rendered = lines
                .map((line, index) =>
                    `${indentation}${index === 0 && !output ? marker : ' '.repeat(marker.length)}${line}`,
                )
                .join('\n');
        } else if (block.type === 'code') {
            const continuationIndent = `${indentation}${' '.repeat(marker.length)}`;
            rendered = `${indentation}${output ? ' '.repeat(marker.length) : marker}［コード］\n` +
                `${codeBlockBody(block.text)}` +
                `${continuationIndent}［/コード］`;
        } else if (block.type === 'list') {
            rendered = renderList(block, depth + 1);
        } else if (block.type === 'quote') {
            rendered = renderQuote(block, depth + 1);
        }

        if (!rendered) continue;
        output += output
            ? previousType === 'list' || block.type === 'list'
                ? '\n' + rendered
                : '\n\n' + rendered
            : rendered;
        previousType = block.type;
    }

    return output || `${indentation}${marker.trimEnd()}`;
}

function renderList(block: ListBlock, depth: number): string {
    let nextOrdinal = block.start;

    return block.items
        .map(({ blocks, value }) => {
            if (value !== null) nextOrdinal = value;

            const ordinal = nextOrdinal;
            nextOrdinal += block.step;
            const marker = block.ordered ? `${ordinal}. ` : '• ';
            return renderListItem(blocks, marker, depth);
        })
        .join('\n');
}

function prefixQuoteLines(value: string): string {
    return value
        .split(/(\n|\uE000)/)
        .map((part, index) => index % 2 === 0 ? `> ${part}` : part)
        .join('');
}

function decodeHardLineBreaks(value: string): string {
    let decoded = '';
    for (let index = 0; index < value.length; index += 1) {
        if (value[index] === ESCAPE_MARKER) {
            if (value[index + 1] === ESCAPED_ESCAPE_MARKER) {
                decoded += ESCAPE_MARKER;
                index += 1;
            } else {
                decoded += HARD_LINE_BREAK;
            }
            continue;
        }

        if (value[index] !== HARD_LINE_BREAK) {
            decoded += value[index];
            continue;
        }

        decoded += '\n';
    }
    return decoded;
}

function codeBlockBody(text: string): string {
    const hasLineBreak = text.endsWith('\n') || text.endsWith(HARD_LINE_BREAK);
    return hasLineBreak ? text : `${text}\n`;
}

function renderCodeBlock(text: string): string {
    return `［コード］\n${codeBlockBody(text)}［/コード］`;
}

function renderQuote(block: QuoteBlock, listDepth = 0): string {
    return prefixQuoteLines(renderBlocks(block.blocks, listDepth));
}

function renderBlocks(blocks: ClipboardBlock[], listDepth = 0): string {
    const rendered: string[] = [];

    for (const block of blocks) {
        if (block.type === 'text') {
            rendered.push(block.text);
        } else if (block.type === 'code') {
            rendered.push(renderCodeBlock(block.text));
        } else if (block.type === 'rule') {
            rendered.push('');
        } else if (block.type === 'quote') {
            rendered.push(renderQuote(block, listDepth));
        } else {
            rendered.push(renderList(block, listDepth));
        }
    }

    return rendered.filter((value) => value.length > 0).join('\n\n');
}

/** Converts external structured HTML into text lines without creating editor marks or nodes. */
export function htmlToPlainTextLines(html: string): string[] | null {
    if (!html.trim()) return null;

    const parsed = new DOMParser().parseFromString(html, 'text/html');
    if (hasUnsupportedContent(parsed)) return null;

    const text = renderBlocks(parseFlow(Array.from(parsed.body.childNodes)));
    if (!text.trim()) return null;

    return decodeHardLineBreaks(text).split('\n');
}
