export interface MessageModel {
    id: number;
    content: string;
    isRead: boolean;
    senderId: number;
    receiverId: number;
    createdAt: string;
}
