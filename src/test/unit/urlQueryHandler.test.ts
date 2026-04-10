import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getContentFromUrlQuery,
  cleanupAllQueryParams,
  hasContentQueryParam,
  getReplyQuoteFromUrlQuery,
  hasReplyQuoteQueryParam,
} from '../../lib/urlQueryHandler';

describe('urlQueryHandler', () => {
  let originalLocation: Location;
  let originalHistory: History;

  beforeEach(() => {
    originalLocation = window.location;
    originalHistory = window.history;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    delete window.history;
  });

  afterEach(() => {
    // @ts-ignore
    window.location = originalLocation;
    // @ts-ignore
    window.history = originalHistory;
  });

  describe('getContentFromUrlQuery', () => {
    it('URLクエリパラメータからコンテンツを取得できる', () => {
      // @ts-ignore
      window.location = {
        search: '?content=Hello%20World',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBe('Hello World');
    });

    it('日本語のコンテンツをデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: '?content=%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBe('こんにちは');
    });

    it('contentパラメータがない場合はnullを返す', () => {
      // @ts-ignore
      window.location = {
        search: '?other=value',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBeNull();
    });

    it('空のクエリの場合はnullを返す', () => {
      // @ts-ignore
      window.location = {
        search: '',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBeNull();
    });

    it('改行を含むコンテンツを正しくデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: '?content=Line1%0ALine2',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBe('Line1\nLine2');
    });

    it('CRLF改行を含むコンテンツを正しく正規化できる', () => {
      // @ts-ignore
      window.location = {
        search: '?content=Line1%0D%0ALine2',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBe('Line1\nLine2');
    });

    it('CR改行を含むコンテンツを正しく正規化できる', () => {
      // @ts-ignore
      window.location = {
        search: '?content=Line1%0DLine2',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBe('Line1\nLine2');
    });

    it('空行を含むコンテンツを正しく処理できる', () => {
      // @ts-ignore
      window.location = {
        search: '?content=Line1%0D%0A%0D%0ALine2',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBe('Line1\n\nLine2');
    });

    it('特殊文字を含むコンテンツを正しくデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: '?content=%23hashtag%20%40mention%20https%3A%2F%2Fexample.com',
      } as Location;

      const result = getContentFromUrlQuery();
      expect(result).toBe('#hashtag @mention https://example.com');
    });
  });

  describe('hasContentQueryParam', () => {
    it('contentパラメータがある場合trueを返す', () => {
      // @ts-ignore
      window.location = {
        search: '?content=test',
      } as Location;

      expect(hasContentQueryParam()).toBe(true);
    });

    it('contentパラメータがない場合falseを返す', () => {
      // @ts-ignore
      window.location = {
        search: '?other=value',
      } as Location;

      expect(hasContentQueryParam()).toBe(false);
    });

    it('空のクエリの場合falseを返す', () => {
      // @ts-ignore
      window.location = {
        search: '',
      } as Location;

      expect(hasContentQueryParam()).toBe(false);
    });
  });

  describe('cleanupAllQueryParams', () => {
    it('contentパラメータを削除する', () => {
      const mockReplaceState = vi.fn();
      // @ts-ignore
      window.location = {
        search: '?content=test&other=value',
        pathname: '/test',
      } as Location;
      // @ts-ignore
      window.history = {
        replaceState: mockReplaceState,
      } as History;

      cleanupAllQueryParams();

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test');
    });

    it('空のcontentパラメータを削除する', () => {
      const mockReplaceState = vi.fn();
      // @ts-ignore
      window.location = {
        search: '?content=',
        pathname: '/test',
      } as Location;
      // @ts-ignore
      window.history = {
        replaceState: mockReplaceState,
      } as History;

      cleanupAllQueryParams();

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test');
    });

    it('contentパラメータのみの場合、クエリ文字列全体を削除する', () => {
      const mockReplaceState = vi.fn();
      // @ts-ignore
      window.location = {
        search: '?content=test',
        pathname: '/test',
      } as Location;
      // @ts-ignore
      window.history = {
        replaceState: mockReplaceState,
      } as History;

      cleanupAllQueryParams();

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test');
    });

    it('想定外のパラメータを削除する', () => {
      const mockReplaceState = vi.fn();
      // @ts-ignore
      window.location = {
        search: '?unknown=value&other=test',
        pathname: '/test',
      } as Location;
      // @ts-ignore
      window.history = {
        replaceState: mockReplaceState,
      } as History;

      cleanupAllQueryParams();

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test');
    });

    it('クエリパラメータがない場合は何もしない', () => {
      const mockReplaceState = vi.fn();
      // @ts-ignore
      window.location = {
        search: '',
        pathname: '/test',
      } as Location;
      // @ts-ignore
      window.history = {
        replaceState: mockReplaceState,
      } as History;

      cleanupAllQueryParams();

      expect(mockReplaceState).not.toHaveBeenCalled();
    });

    it('contentと他のパラメータが混在する場合、すべて削除する', () => {
      const mockReplaceState = vi.fn();
      // @ts-ignore
      window.location = {
        search: '?content=test&foo=bar&baz=qux',
        pathname: '/test',
      } as Location;
      // @ts-ignore
      window.history = {
        replaceState: mockReplaceState,
      } as History;

      cleanupAllQueryParams();

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test');
    });
  });

  describe('getReplyQuoteFromUrlQuery', () => {
    const validNevent = 'nevent1qgsthwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwcpzamhxue69uhhyetvv9ujuetcv9khqmr99e3k7mgqyz424242424242424242424242424242424242424242424242425grql2v';
    const validNote = 'note1424242424242424242424242424242424242424242424242424qv3q9y6';
    const expectedEventId = 'a'.repeat(64);

    it('replyパラメータからneventをデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: `?reply=${validNevent}`,
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).not.toBeNull();
      expect(result!.mode).toBe('reply');
      expect(result!.eventId).toBe(expectedEventId);
      expect(result!.relayHints).toContain('wss://relay.example.com');
      expect(result!.authorPubkey).toBe('b'.repeat(64));
    });

    it('quoteパラメータからneventをデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: `?quote=${validNevent}`,
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).not.toBeNull();
      expect(result!.mode).toBe('quote');
      expect(result!.eventId).toBe(expectedEventId);
    });

    it('noteフォーマットをデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: `?reply=${validNote}`,
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).not.toBeNull();
      expect(result!.mode).toBe('reply');
      expect(result!.eventId).toBe(expectedEventId);
      expect(result!.relayHints).toHaveLength(0);
      expect(result!.authorPubkey).toBeNull();
    });

    it('パラメータがない場合はnullを返す', () => {
      // @ts-ignore
      window.location = {
        search: '',
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).toBeNull();
    });

    it('無効なbech32の場合はnullを返す', () => {
      // @ts-ignore
      window.location = {
        search: '?reply=invalid_value',
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).toBeNull();
    });
  });

  describe('hasReplyQuoteQueryParam', () => {
    it('replyパラメータがある場合はtrueを返す', () => {
      // @ts-ignore
      window.location = {
        search: '?reply=nevent1xxx',
      } as Location;

      expect(hasReplyQuoteQueryParam()).toBe(true);
    });

    it('quoteパラメータがある場合はtrueを返す', () => {
      // @ts-ignore
      window.location = {
        search: '?quote=note1xxx',
      } as Location;

      expect(hasReplyQuoteQueryParam()).toBe(true);
    });

    it('どちらもない場合はfalseを返す', () => {
      // @ts-ignore
      window.location = {
        search: '?content=hello',
      } as Location;

      expect(hasReplyQuoteQueryParam()).toBe(false);
    });
  });
});
