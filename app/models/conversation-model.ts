export interface ConversationPartner {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
}

export interface ConversationModel {
    partner: ConversationPartner;
    partnerId: number;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    isOnline?: boolean;
}

export interface ConversationsModel {
    items: ConversationModel[];
}