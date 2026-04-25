/**
 * URLクエリパラメータからコンテンツを取得する
 */
import { nip19 } from 'nostr-tools';
import { RelayConfigUtils } from './relayConfigUtils';
import { normalizeLineBreaks } from './utils/editorUrlUtils';
import type { EmbedComposerSetContextPayload } from './embedProtocol';
import type { ChannelContextQueryTarget, ReplyQuoteQueryResult } from './types';

function trimToNull(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function decodeEventPointerValue(
  value: string,
): {
  eventId: string;
  relayHints: string[];
  authorPubkey: string | null;
} | null {
  try {
    const decoded = nip19.decode(value);

    if (decoded.type === 'nevent') {
      const data = decoded.data as nip19.EventPointer;
      return {
        eventId: data.id,
        relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(data.relays ? [...data.relays] : [], {
          limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT,
        }),
        authorPubkey: data.author ?? null,
      };
    }

    if (decoded.type === 'note') {
      return {
        eventId: decoded.data as string,
        relayHints: [],
        authorPubkey: null,
      };
    }

    return null;
  } catch (error) {
    console.error('リプライ/引用パラメータのデコードに失敗:', error);
    return null;
  }
}

function buildReplyQuoteQueryResult(
  replyValues: string[],
  quoteValues: string[],
): ReplyQuoteQueryResult | null {
  const reply = replyValues
    .map((value) => decodeEventPointerValue(value))
    .find((value) => value !== null) ?? null;

  const seenQuoteIds = new Set<string>();
  const quotes = quoteValues
    .map((value) => decodeEventPointerValue(value))
    .filter((value): value is NonNullable<typeof value> => value !== null)
    .filter((value) => {
      if (seenQuoteIds.has(value.eventId)) {
        return false;
      }
      seenQuoteIds.add(value.eventId);
      return true;
    });

  if (!reply && quotes.length === 0) return null;

  return {
    reply,
    quotes,
  };
}

export function getReplyQuoteFromEmbedPayload(
  payload: EmbedComposerSetContextPayload,
): ReplyQuoteQueryResult | null {
  const replyValues = typeof payload.reply === 'string' ? [payload.reply] : [];
  const quoteValues = Array.isArray(payload.quotes)
    ? payload.quotes.filter((value): value is string => typeof value === 'string')
    : [];

  return buildReplyQuoteQueryResult(replyValues, quoteValues);
}

export function getChannelFromEmbedPayload(
  payload: EmbedComposerSetContextPayload,
): ChannelContextQueryTarget | null {
  if (!payload.channel || typeof payload.channel !== 'object') {
    return null;
  }

  const reference = typeof payload.channel.reference === 'string'
    ? payload.channel.reference
    : null;

  if (!reference) {
    return null;
  }

  const decoded = decodeEventPointerValue(reference);

  if (!decoded) {
    return null;
  }

  const channelRelays = Array.isArray(payload.channel.relays)
    ? payload.channel.relays.filter(
      (value): value is string => typeof value === 'string',
    )
    : [];

  return {
    eventId: decoded.eventId,
    relayHints: decoded.relayHints,
    ...(channelRelays.length > 0
      ? {
        channelRelays,
      }
      : {}),
    name: trimToNull(payload.channel.name),
    about: trimToNull(payload.channel.about),
    picture: trimToNull(payload.channel.picture),
  };
}

export function getContentFromUrlQuery(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;

  const urlParams = new URLSearchParams(window.location.search);
  const content = urlParams.get('content');

  if (!content) return null;

  try {
    // 改行コードを統一
    return normalizeLineBreaks(content);
  } catch (error) {
    console.error('URLクエリパラメータのデコードに失敗:', error);
    return null;
  }
}

/**
 * URLクエリパラメータからリプライ/引用情報を取得する
 * ?reply=nevent1... / ?reply=note1... / ?quote=nevent1... / ?quote=note1...
 */
export function getReplyQuoteFromUrlQuery(): ReplyQuoteQueryResult | null {
  if (typeof window === 'undefined' || !window.location) return null;

  const urlParams = new URLSearchParams(window.location.search);
  const replyValues = urlParams.getAll('reply');
  const quoteValues = urlParams.getAll('quote');

  return buildReplyQuoteQueryResult(replyValues, quoteValues);
}

export function getChannelFromUrlQuery(): ChannelContextQueryTarget | null {
  if (typeof window === 'undefined' || !window.location) return null;

  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get('channel');

  if (!reference) {
    return null;
  }

  const decoded = decodeEventPointerValue(reference);
  if (!decoded) {
    return null;
  }

  return {
    eventId: decoded.eventId,
    relayHints: decoded.relayHints,
    ...(urlParams.getAll('channelRelay').length > 0
      ? {
        channelRelays: RelayConfigUtils.sanitizeExternalRelayUrls(
          urlParams.getAll('channelRelay'),
        ),
      }
      : {}),
    name: trimToNull(urlParams.get('channelName')),
    about: trimToNull(urlParams.get('channelAbout')),
    picture: trimToNull(urlParams.get('channelPicture')),
  };
}

/**
 * URLクエリパラメータにreplyまたはquoteが含まれているかチェック
 */
export function hasReplyQuoteQueryParam(): boolean {
  if (typeof window === 'undefined' || !window.location) return false;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('reply') || urlParams.has('quote');
}

export function hasChannelQueryParam(): boolean {
  if (typeof window === 'undefined' || !window.location) return false;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('channel');
}

/**
 * 消費済みの外部入力クエリパラメータだけをクリーンアップ
 */
export function cleanupAllQueryParams(): void {
  if (typeof window === 'undefined' || !window.location) return;

  const urlParams = new URLSearchParams(window.location.search);

  let needsCleanup = false;

  // contentパラメータが空または存在する場合は削除
  if (urlParams.has('content')) {
    urlParams.delete('content');
    needsCleanup = true;
  }

  // reply/quoteパラメータを削除（処理済み）
  if (urlParams.has('reply')) {
    urlParams.delete('reply');
    needsCleanup = true;
  }
  if (urlParams.has('quote')) {
    urlParams.delete('quote');
    needsCleanup = true;
  }

  for (const key of ['channel', 'channelRelay', 'channelName', 'channelAbout', 'channelPicture']) {
    if (urlParams.has(key)) {
      urlParams.delete(key);
      needsCleanup = true;
    }
  }

  // クリーンアップが必要な場合のみURLを更新
  if (needsCleanup) {
    const newUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }
}

/**
 * URLクエリパラメータにcontentが含まれているかチェック
 */
export function hasContentQueryParam(): boolean {
  if (typeof window === 'undefined' || !window.location) return false;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('content');
}
