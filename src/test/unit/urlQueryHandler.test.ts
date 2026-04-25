import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nip19 } from 'nostr-tools';
import {
  getChannelFromEmbedPayload,
  getChannelFromUrlQuery,
  getContentFromUrlQuery,
  cleanupAllQueryParams,
  hasContentQueryParam,
  hasChannelQueryParam,
  getReplyQuoteFromEmbedPayload,
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

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test?other=value');
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

    it('消費対象でないパラメータは保持する', () => {
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

      expect(mockReplaceState).not.toHaveBeenCalled();
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

    it('contentと他のパラメータが混在する場合、消費対象だけ削除する', () => {
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

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test?foo=bar&baz=qux');
    });

    it('channel 関連パラメータも消費対象として削除する', () => {
      const mockReplaceState = vi.fn();
      // @ts-ignore
      window.location = {
        search: '?channel=note1424242424242424242424242424242424242424242424242424qv3q9y6&channelRelay=wss%3A%2F%2Frelay.example.com&channelName=General&channelAbout=Talk&channelPicture=https%3A%2F%2Fexample.com%2Fchannel.png&other=value',
        pathname: '/test',
      } as Location;
      // @ts-ignore
      window.history = {
        replaceState: mockReplaceState,
      } as History;

      cleanupAllQueryParams();

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test?other=value');
    });
  });

  describe('channel query helpers', () => {
    const validChannelNevent = nip19.neventEncode({
      id: 'a'.repeat(64),
      relays: ['wss://relay.example.com'],
      author: 'b'.repeat(64),
    });
    const validChannelNote = nip19.noteEncode('a'.repeat(64));

    it('channel パラメータがある場合 true を返す', () => {
      // @ts-ignore
      window.location = {
        search: '?channel=note1424242424242424242424242424242424242424242424242424qv3q9y6',
      } as Location;

      expect(hasChannelQueryParam()).toBe(true);
    });

    it('channel metadata を含む URL クエリを取得できる', () => {
      // @ts-ignore
      window.location = {
        search: `?channel=${validChannelNevent}&channelRelay=wss%3A%2F%2Fchannel-write.example.com&channelRelay=https%3A%2F%2Finvalid.example.com&channelName=General&channelAbout=General%20discussion&channelPicture=https%3A%2F%2Fexample.com%2Fchannel.png`,
      } as Location;

      expect(getChannelFromUrlQuery()).toEqual({
        eventId: 'a'.repeat(64),
        relayHints: ['wss://relay.example.com/'],
        channelRelays: ['wss://channel-write.example.com/'],
        name: 'General',
        about: 'General discussion',
        picture: 'https://example.com/channel.png',
      });
    });

    it('embed payload から channel metadata を取得できる', () => {
      expect(getChannelFromEmbedPayload({
        channel: {
          reference: validChannelNevent,
          relays: ['wss://channel-write.example.com'],
          name: 'General',
          about: 'General discussion',
          picture: 'https://example.com/channel.png',
        },
      } as any)).toEqual({
        eventId: 'a'.repeat(64),
        relayHints: ['wss://relay.example.com/'],
        channelRelays: ['wss://channel-write.example.com'],
        name: 'General',
        about: 'General discussion',
        picture: 'https://example.com/channel.png',
      });
    });

  });

  describe('getReplyQuoteFromUrlQuery', () => {
    const validNevent = 'nevent1qgsthwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwcpzamhxue69uhhyetvv9ujuetcv9khqmr99e3k7mgqyz424242424242424242424242424242424242424242424242425grql2v';
    const validNote = 'note1424242424242424242424242424242424242424242424242424qv3q9y6';
    const expectedEventId = 'a'.repeat(64);
    const secondEventId = 'b'.repeat(64);
    const secondQuoteNote = nip19.noteEncode(secondEventId);

    it('replyパラメータからneventをデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: `?reply=${validNevent}`,
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).not.toBeNull();
      expect(result!.reply).toEqual({
        eventId: expectedEventId,
        relayHints: ['wss://relay.example.com/'],
        authorPubkey: 'b'.repeat(64),
      });
      expect(result!.quotes).toEqual([]);
    });

    it('quoteパラメータからneventをデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: `?quote=${validNevent}`,
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).not.toBeNull();
      expect(result!.reply).toBeNull();
      expect(result!.quotes).toEqual([
        {
          eventId: expectedEventId,
          relayHints: ['wss://relay.example.com/'],
          authorPubkey: 'b'.repeat(64),
        },
      ]);
    });

    it('noteフォーマットをデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: `?reply=${validNote}`,
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).not.toBeNull();
      expect(result!.reply).toEqual({
        eventId: expectedEventId,
        relayHints: [],
        authorPubkey: null,
      });
      expect(result!.quotes).toEqual([]);
    });

    it('reply と複数 quote を同時にデコードできる', () => {
      // @ts-ignore
      window.location = {
        search: `?reply=${validNote}&quote=${validNevent}&quote=${secondQuoteNote}`,
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result).not.toBeNull();
      expect(result!.reply).toEqual({
        eventId: expectedEventId,
        relayHints: [],
        authorPubkey: null,
      });
      expect(result!.quotes).toHaveLength(2);
      expect(result!.quotes[0].eventId).toBe(expectedEventId);
      expect(result!.quotes[1].eventId).toBe(secondEventId);
    });

    it('relay hints を ws/wss のみへ正規化し件数上限と重複排除を行う', () => {
      const eventId = 'c'.repeat(64);
      const encoded = nip19.neventEncode({
        id: eventId,
        relays: [
          'wss://relay.example.com',
          'wss://relay.example.com/',
          'https://invalid.example.com',
          'wss://relay-2.example.com',
          'wss://relay-3.example.com',
          'wss://relay-4.example.com',
          'wss://user:pass@secret.example.com',
        ],
      });

      // @ts-ignore
      window.location = {
        search: `?reply=${encoded}`,
      } as Location;

      const result = getReplyQuoteFromUrlQuery();
      expect(result?.reply?.relayHints).toEqual([
        'wss://relay.example.com/',
        'wss://relay-2.example.com/',
        'wss://relay-3.example.com/',
      ]);
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

  describe('getReplyQuoteFromEmbedPayload', () => {
    const validNevent = 'nevent1qgsthwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwamhwcpzamhxue69uhhyetvv9ujuetcv9khqmr99e3k7mgqyz424242424242424242424242424242424242424242424242425grql2v';
    const validNote = 'note1424242424242424242424242424242424242424242424242424qv3q9y6';

    it('reply と quotes を runtime payload からデコードできる', () => {
      const result = getReplyQuoteFromEmbedPayload({
        reply: validNevent,
        quotes: [validNote],
      });

      expect(result).not.toBeNull();
      expect(result?.reply?.eventId).toBe('a'.repeat(64));
      expect(result?.quotes).toEqual([
        {
          eventId: 'a'.repeat(64),
          relayHints: [],
          authorPubkey: null,
        },
      ]);
    });

    it('無効な runtime payload の値だけしかない場合は null を返す', () => {
      const result = getReplyQuoteFromEmbedPayload({
        reply: 'invalid-value',
        quotes: ['also-invalid'],
      });

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
