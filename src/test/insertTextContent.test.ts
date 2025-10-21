import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { normalizeLineBreaks } from '../lib/utils/editorUtils';

/**
 * insertTextContent関数のロジックをテスト用に抽出
 * アクセス時の処理なので、常に直接挿入（既存内容を置き換え）
 */
function insertTextContentLogic(
  content: string,
  currentEditorText: string
): { type: string; content: any[] } {
  if (!content) return { type: 'doc', content: [] };

  // 実際の関数と同じく改行コードを正規化
  const normalizedContent = normalizeLineBreaks(content);
  
  // 改行で分割してパラグラフの配列を作成
  const lines = normalizedContent.split('\n');
  
  // Tiptapのパラグラフノードとして構造化
  const paragraphNodes = lines.map((line) => ({
    type: 'paragraph',
    content: line ? [{ type: 'text', text: line }] : undefined,
  }));
  
  // アクセス時の処理なので、常に直接挿入（既存内容を置き換え）
  return {
    type: 'doc',
    content: paragraphNodes,
  };
}describe('insertTextContent - Tiptap paragraph node structure', () => {
  it('単一行のテキストを正しいパラグラフノードとして構造化', () => {
    const content = 'Hello World';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello World' }],
        },
      ],
    });
  });

  it('複数行のテキストを複数のパラグラフノードとして構造化', () => {
    const content = 'Line1\nLine2\nLine3';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line1' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line2' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line3' }],
        },
      ],
    });
  });

  it('空行を含むテキストを正しく処理', () => {
    const content = 'Line1\n\nLine3';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line1' }],
        },
        {
          type: 'paragraph',
          content: undefined, // 空行
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line3' }],
        },
      ],
    });
  });

  it('CRLF改行を含むテキストを正しく処理', () => {
    const content = 'Line1\r\n\r\nLine3';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line1' }],
        },
        {
          type: 'paragraph',
          content: undefined, // 空行
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line3' }],
        },
      ],
    });
  });

  it('CR改行を含むテキストを正しく処理', () => {
    const content = 'Line1\r\rLine3';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line1' }],
        },
        {
          type: 'paragraph',
          content: undefined, // 空行
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Line3' }],
        },
      ],
    });
  });

  it('先頭と末尾に改行がある場合も正しく処理', () => {
    const content = '\nHello\n';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: undefined, // 先頭の空行
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello' }],
        },
        {
          type: 'paragraph',
          content: undefined, // 末尾の空行
        },
      ],
    });
  });

  it('エディターに既存コンテンツがある場合も常に直接挿入', () => {
    const content = 'New Line 1\nNew Line 2';
    const result = insertTextContentLogic(content, 'Existing content');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'New Line 1' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'New Line 2' }],
        },
      ],
    });
  });

  it('日本語を含むテキストを正しく処理', () => {
    const content = 'こんにちは\n世界';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'こんにちは' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '世界' }],
        },
      ],
    });
  });

  it('ハッシュタグとメンションを含むテキストを正しく処理', () => {
    const content = '#nostr\n@npub1xxx\nhttps://example.com';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '#nostr' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '@npub1xxx' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'https://example.com' }],
        },
      ],
    });
  });

  it('空文字列の場合は空の配列を返す', () => {
    const content = '';
    const result = insertTextContentLogic(content, '');

    expect(result).toEqual({
      type: 'doc',
      content: [],
    });
  });
});

describe('insertTextContent - Integration with Tiptap Editor', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  it('単一行テキストをエディターに挿入', () => {
    const content = 'Hello World';
    const lines = content.split('\n');
    const paragraphNodes = lines.map((line) => ({
      type: 'paragraph',
      content: line ? [{ type: 'text', text: line }] : undefined,
    }));

    editor.commands.setContent({
      type: 'doc',
      content: paragraphNodes,
    });

    expect(editor.getText()).toBe('Hello World');
  });

  it('複数行テキストをエディターに挿入し、改行が維持される', () => {
    const content = 'Line1\nLine2\nLine3';
    const lines = content.split('\n');
    const paragraphNodes = lines.map((line) => ({
      type: 'paragraph',
      content: line ? [{ type: 'text', text: line }] : undefined,
    }));

    editor.commands.setContent({
      type: 'doc',
      content: paragraphNodes,
    });

    // Tiptapでは各パラグラフ間に改行が入る
    expect(editor.getText()).toBe('Line1\n\nLine2\n\nLine3');
  });

  it('空行を含むテキストをエディターに挿入', () => {
    const content = 'Line1\n\nLine3';
    const lines = content.split('\n');
    const paragraphNodes = lines.map((line) => ({
      type: 'paragraph',
      content: line ? [{ type: 'text', text: line }] : undefined,
    }));

    editor.commands.setContent({
      type: 'doc',
      content: paragraphNodes,
    });

    // 空行は空のパラグラフとして表現される
    expect(editor.getText()).toBe('Line1\n\n\n\nLine3');
  });

  it('既存コンテンツがある場合も常に直接挿入（置き換え）', () => {
    // 既存コンテンツを設定
    editor.commands.setContent({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Existing' }],
        },
      ],
    });

    // 新しいコンテンツを挿入（置き換え）
    const content = 'New Line';
    const lines = content.split('\n');
    const paragraphNodes = lines.map((line) => ({
      type: 'paragraph',
      content: line ? [{ type: 'text', text: line }] : undefined,
    }));

    editor.commands.setContent({
      type: 'doc',
      content: paragraphNodes,
    });

    expect(editor.getText()).toBe('New Line');
  });

  it('日本語を含むテキストをエディターに挿入', () => {
    const content = 'こんにちは\n世界';
    const lines = content.split('\n');
    const paragraphNodes = lines.map((line) => ({
      type: 'paragraph',
      content: line ? [{ type: 'text', text: line }] : undefined,
    }));

    editor.commands.setContent({
      type: 'doc',
      content: paragraphNodes,
    });

    expect(editor.getText()).toBe('こんにちは\n\n世界');
  });
});
