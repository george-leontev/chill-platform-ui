"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ConversationModel } from "../models/conversation-model";
import { MessageModel } from "../models/message-model";
import { messageRoutes } from "../constants/app-api-routes";
import { HttpConstants } from "../constants/app-http-constants";
import { useAuthHttpRequest } from "./use-auth-http-request";
import { useAuth } from "./app-auth-context";

type MessagesContextType = {
    conversations: ConversationModel[];
    messages: MessageModel[];
    isLoading: boolean;
    isConnected: boolean;
    onlineUsers: Set<number>;
    getConversationsAsync: () => Promise<void>;
    getConversationAsync: (partnerId: number) => Promise<void>;
    sendMessage: (receiverId: number, content: string) => void;
    markAsRead: (partnerId: number) => void;
    isUserOnline: (userId: number) => boolean;
};

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
    const authHttpRequest = useAuthHttpRequest();
    const { getUserAuthDataFromStorage } = useAuth();

    const [conversations, setConversations] = useState<ConversationModel[]>([]);
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

    const wsRef = useRef<WebSocket | null>(null);

    const getConversationsAsync = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authHttpRequest({
                method: "GET",
                url: messageRoutes.conversations,
            });
            if (response?.status === HttpConstants.StatusCodes.Ok) {
                setConversations(response.data.items as ConversationModel[]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [authHttpRequest]);

    const getConversationAsync = useCallback(
        async (partnerId: number) => {
            setIsLoading(true);
            try {
                const response = await authHttpRequest({
                    method: "GET",
                    url: messageRoutes.conversation(partnerId),
                });
                if (response?.status === HttpConstants.StatusCodes.Ok) {
                    const items = response.data.items as MessageModel[];
                    // API returns desc, reverse for display (oldest first)
                    setMessages([...items].reverse());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [authHttpRequest],
    );

    const markAsRead = useCallback(
        (partnerId: number) => {
            authHttpRequest({
                method: "PUT",
                url: messageRoutes.markAsRead(partnerId),
            });
            // update unread count locally
            setConversations((prev) => prev.map((c) => (c.partner.id === partnerId ? { ...c, unreadCount: 0 } : c)));
            // send read receipt via WS only if connected
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                    JSON.stringify({
                        type: "read",
                        sender_id: partnerId,
                    }),
                );
            }
        },
        [authHttpRequest],
    );

    const sendMessage = useCallback((receiverId: number, content: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected");
            return;
        }
        wsRef.current.send(
            JSON.stringify({
                type: "new_message",
                receiver_id: receiverId,
                content,
            }),
        );
    }, []);

    useEffect(() => {
        const userData = getUserAuthDataFromStorage();
        if (!userData?.token) return;

        const connect = () => {
            const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/api/ws/messages?token=${userData.token}`;
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => setIsConnected(true);

            ws.onclose = () => {
                setIsConnected(false);
                // reconnect after 3s if closed unexpectedly
                setTimeout(connect, 3000);
            };

            ws.onerror = (err) => {
                console.error("WebSocket error:", err);
                ws.close();
            };

            ws.onmessage = (event) => {
                const payload = JSON.parse(event.data);
                console.log("WebSocket payload:", payload);

                if (payload.type === "new_message") {
                    const msg = payload.data as MessageModel;
                    console.log("Message data:", msg);
                    console.log("msg.senderId:", msg.senderId, "msg.createdAt:", msg.createdAt);

                    // append to messages
                    setMessages((prev) => [...prev, msg]);

                    // update conversation last message
                    setConversations((prev) =>
                        prev.map((c) =>
                            c.partner.id === msg.senderId
                                ? {
                                      ...c,
                                      lastMessage: msg.content,
                                      lastMessageAt: msg.createdAt,
                                      unreadCount: c.unreadCount + 1,
                                  }
                                : c,
                        ),
                    );
                }

                if (payload.type === "read") {
                    // Update message read status in current conversation
                    setMessages((prev) => prev.map((m) => (m.id === payload.message_id ? { ...m, isRead: true } : m)));
                }

                if (payload.type === "online_users") {
                    // Handle online users list from server
                    const userIds = payload.userIds as number[];
                    setOnlineUsers(new Set(userIds));
                    // Update conversations with online status
                    setConversations((prev) =>
                        prev.map((c) => ({
                            ...c,
                            is_online: userIds.includes(c.partner.id),
                        })),
                    );
                }

                if (payload.type === "user_online") {
                    // Handle single user coming online
                    const userId = payload.userId as number;
                    setOnlineUsers((prev) => new Set(prev).add(userId));
                    setConversations((prev) =>
                        prev.map((c) => (c.partner.id === userId ? { ...c, is_online: true } : c)),
                    );
                }

                if (payload.type === "user_offline") {
                    // Handle single user going offline
                    const userId = payload.userId as number;
                    setOnlineUsers((prev) => {
                        const next = new Set(prev);
                        next.delete(userId);
                        return next;
                    });
                    setConversations((prev) =>
                        prev.map((c) => (c.partner.id === userId ? { ...c, is_online: false } : c)),
                    );
                }
            };
        };

        connect();

        return () => {
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, [getUserAuthDataFromStorage]);

    useEffect(() => {
        getConversationsAsync();
    }, [getConversationsAsync]);

    const isUserOnline = useCallback(
        (userId: number) => {
            return onlineUsers.has(userId);
        },
        [onlineUsers],
    );

    return (
        <MessagesContext.Provider
            value={{
                conversations,
                messages,
                isLoading,
                isConnected,
                onlineUsers,
                isUserOnline,
                getConversationsAsync,
                getConversationAsync,
                sendMessage,
                markAsRead,
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
}

export const useMessages = () => {
    const context = useContext(MessagesContext);
    if (!context) throw new Error("useMessages must be used within MessagesProvider");
    return context;
};
