export type SupportMessageModel = {
    id: number;
    ticketId: number;
    senderId: number;
    content: string;
    isFromSupport: boolean;
    createdAt: string;
};

export type SupportTicketModel = {
    id: number;
    userId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    messages: SupportMessageModel[];
};

export type CreateSupportMessageModel = {
    content: string;
};
