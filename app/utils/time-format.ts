/**
 * Formats a date string into a relative time or date string
 * - Less than 1 day: relative time (e.g., "5m ago", "2h ago")
 * - More than 1 day: formatted date (e.g., "Mar 12", "Dec 25")
 */
export function formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) {
        return "Just now";
    } else if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else {
        // More than 1 day ago - show date
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
}

/**
 * Formats a date string for message bubble timestamp
 * Shows time for today, date for older messages
 */
export function formatMessageBubbleTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays === 0) {
        // Today - show time
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else {
        // Older - show date and time
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " +
            date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
}
