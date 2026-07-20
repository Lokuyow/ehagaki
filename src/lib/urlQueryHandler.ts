/**
 * URLクエリパラメータからコンテンツを取得する
 */
import { RelayConfigUtils } from './relayConfigUtils';
import { normalizeLineBreaks } from './utils/editorUrlUtils';
import type { EmbedComposerSetContextPayload } from './embedProtocol';
import type { ChannelContextQueryTarget, ReplyQuoteQueryResult } from './types';
import { decodeEventPointerValue } from './eventPointerUtils';

export { decodeEventPointerValue } from './eventPointerUtils';

function trimToNull(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readEmbedMetadataField(
  channel: Record<string, unknown>,
  field: 'name' | 'about' | 'picture',
): { provided: false } | { provided: true; value: string | null } {
  if (!Object.prototype.hasOwnProperty.call(channel, field)) {
    return { provided: false };
  }
  if (channel[field] === undefined) {
    return { provided: false };
  }
  return { provided: true, value: trimToNull(channel[field]) };
}

function parseChannelRelaysQuery(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function getCurrentUrlParams(): URLSearchParams | null {
  if (typeof window === 'undefined' || !window.location) {
    return null;
  }

  return new URLSearchParams(window.location.search);
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
  const channel = payload.channel as unknown as Record<string, unknown>;
  const name = readEmbedMetadataField(channel, 'name');
  const about = readEmbedMetadataField(channel, 'about');
  const picture = readEmbedMetadataField(channel, 'picture');

  return {
    eventId: decoded.eventId,
    relayHints: decoded.relayHints,
    ...(channelRelays.length > 0
      ? {
        channelRelays,
      }
      : {}),
    ...(name.provided ? { name: name.value } : {}),
    ...(about.provided ? { about: about.value } : {}),
    ...(picture.provided ? { picture: picture.value } : {}),
  };
}

export function getContentFromUrlQuery(): string | null {
  const urlParams = getCurrentUrlParams();

  if (!urlParams) return null;

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
  const urlParams = getCurrentUrlParams();

  if (!urlParams) return null;

  const replyValues = urlParams.getAll('reply');
  const quoteValues = urlParams.getAll('quote');

  return buildReplyQuoteQueryResult(replyValues, quoteValues);
}

export function getChannelFromUrlQuery(): ChannelContextQueryTarget | null {
  const urlParams = getCurrentUrlParams();

  if (!urlParams) return null;

  const reference = urlParams.get('channel');

  if (!reference) {
    return null;
  }

  const decoded = decodeEventPointerValue(reference);
  if (!decoded) {
    return null;
  }

  const channelRelays = parseChannelRelaysQuery(urlParams.get('channelRelays'));
  const name = trimToNull(urlParams.get('channelName'));
  const about = trimToNull(urlParams.get('channelAbout'));
  const picture = trimToNull(urlParams.get('channelPicture'));

  return {
    eventId: decoded.eventId,
    relayHints: decoded.relayHints,
    ...(channelRelays.length > 0
      ? {
        channelRelays: RelayConfigUtils.sanitizeExternalRelayUrls(
          channelRelays,
        ),
      }
      : {}),
    ...(name !== null ? { name } : {}),
    ...(about !== null ? { about } : {}),
    ...(picture !== null ? { picture } : {}),
  };
}

/**
 * URLクエリパラメータにreplyまたはquoteが含まれているかチェック
 */
export function hasReplyQuoteQueryParam(): boolean {
  const urlParams = getCurrentUrlParams();

  return !!urlParams && (urlParams.has('reply') || urlParams.has('quote'));
}

export function hasChannelQueryParam(): boolean {
  const urlParams = getCurrentUrlParams();

  return !!urlParams && urlParams.has('channel');
}

/**
 * 消費済みの外部入力クエリパラメータだけをクリーンアップ
 */
export function cleanupAllQueryParams(): void {
  if (typeof window === 'undefined' || !window.location) return;

  const urlParams = getCurrentUrlParams();

  if (!urlParams) return;

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

  for (const key of ['channel', 'channelRelays', 'channelName', 'channelAbout', 'channelPicture']) {
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
  const urlParams = getCurrentUrlParams();

  return !!urlParams && urlParams.has('content');
}
