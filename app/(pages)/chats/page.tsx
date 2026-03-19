"use client";

import { useState } from "react";
import ChatWindow from "./components/chat-window";
import ChatsList from "./components/chats-list";
import { useMessages } from "../../contexts/messages-context";
import { useAuth } from "../../contexts/app-auth-context";
import { ConversationModel } from "@/app/models/conversation-model";

export default function ChatsPage() {
    const { messages, getConversationAsync, sendMessage, markAsRead } = useMessages();
    const { getUserAuthDataFromStorage } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChat, setSelectedChat] = useState<ConversationModel | null>(null);

    const userData = getUserAuthDataFromStorage();
    const currentUserId = userData?.userId;

    const handleSelectChat = (conversation: ConversationModel) => {
        setSelectedChat(conversation);
        getConversationAsync(conversation.partner.id);
        markAsRead(conversation.partner.id);
    };

    const handleSendMessage = (text: string) => {
        if (!selectedChat) return;
        sendMessage(selectedChat.partner.id, text);
    };

    if (!currentUserId) {
        return null;
    }

    return selectedChat ? (
        <ChatWindow
            selectedChat={selectedChat}
            messages={messages}
            currentUserId={currentUserId}
            onBack={() => setSelectedChat(null)}
            onSendMessage={handleSendMessage}
        />
    ) : (
        <ChatsList
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectChat={handleSelectChat}
        />
    );
}
