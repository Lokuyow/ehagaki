import { hashtagHistoryRepository } from "../storage/hashtagHistoryRepository";
import type { HashtagHistoryEntry } from "../types";

export function loadHashtagHistory(): Promise<HashtagHistoryEntry[]> {
    return hashtagHistoryRepository.getAll();
}

export function saveHashtagsToHistory(hashtags: string[]): Promise<void> {
    return hashtagHistoryRepository.save(hashtags);
}

export function getSuggestions(query: string): Promise<string[]> {
    return hashtagHistoryRepository.getSuggestions(query);
}

