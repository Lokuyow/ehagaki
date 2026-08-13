export interface AppPostNotificationPort {
    notifyPostSuccess(options?: {
        eventId?: string;
        replyToEventId?: string;
        quotedEventIds?: string[];
    }): boolean;
    notifyPostError(error?: string | { code: string; message?: string }): boolean;
}
