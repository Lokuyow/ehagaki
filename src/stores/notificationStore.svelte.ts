
let owner = $state<string | null>(null);
let hasUnread = $state(false);
export const notificationStore = {
    get owner() { return owner; },
    get hasUnread() { return hasUnread; },
    selectAccount(next: string | null) { owner = next; hasUnread = false; },
    update(account: string, unread: boolean) {
        if (owner !== account) return;
        hasUnread = unread;
    },
};
