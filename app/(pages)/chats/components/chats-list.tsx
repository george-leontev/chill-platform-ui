"use client";

import { Avatar, Input } from "antd";
import { Search } from "lucide-react";
import { useMessages } from "../../../contexts/messages-context";
import { ConversationModel } from "../../../models/conversation-model";
import { formatMessageTime } from "@/app/utils/time-format";

interface ChatsListProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSelectChat: (conversation: ConversationModel) => void;
}

export default function ChatsList({ searchQuery, onSearchChange, onSelectChat }: ChatsListProps) {
    const { conversations, isLoading } = useMessages();

    const filtered = conversations.filter((c) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            c.partner.firstName.toLowerCase().includes(searchLower) ||
            c.partner.lastName.toLowerCase().includes(searchLower) ||
            c.partner.username.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>Chats</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                <div className='mb-6'>
                    <Input
                        prefix={<Search size={18} className='text-gray-400' />}
                        placeholder='Search chats...'
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className='text-center py-12 text-gray-400'>Loading...</div>
                ) : (
                    <div className='space-y-2'>
                        {filtered.length === 0 ? (
                            <div className='text-center py-12'>
                                <p className='text-gray-500'>No chats found</p>
                            </div>
                        ) : (
                            filtered.map((conv) => (
                                <div
                                    key={conv.partner.id}
                                    onClick={() => onSelectChat(conv)}
                                    className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition'
                                >
                                    <div className='relative'>
                                        <Avatar
                                            size={48}
                                            src={conv.partner.avatar || undefined}
                                            alt={`${conv.partner.firstName} ${conv.partner.lastName}`}
                                        />
                                        {/* Online status indicator */}
                                        {conv.isOnline && (
                                            <span className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white' />
                                        )}
                                        {/* Unread indicator */}
                                        {conv.unreadCount > 0 && !conv.isOnline && (
                                            <span className='absolute top-0 right-0 w-3 h-3 bg-violet-600 rounded-full border-2 border-white' />
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center justify-between'>
                                            <span className='font-semibold text-gray-800'>
                                                {conv.partner.firstName} {conv.partner.lastName}
                                            </span>
                                            <span className='text-xs text-gray-400'>
                                                {formatMessageTime(conv.lastMessageAt)}
                                            </span>
                                        </div>
                                        <p className='text-sm text-gray-500 truncate'>{conv.lastMessage}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
