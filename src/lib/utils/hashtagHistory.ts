import { hashtagHistoryRepository } from "../storage/hashtagHistoryRepository";

export function saveHashtagsToHistory(hashtags: string[]): Promise<void> {
    return hashtagHistoryRepository.save(hashtags);
}

export function getSuggestions(query: string): Promise<string[]> {
    return hashtagHistoryRepository.getSuggestions(query);
}
