"use client";

import { useState } from "react";
import { Avatar, Input } from "antd";
import { Search, ArrowLeft, Send, Smile, Paperclip, Phone, Video } from "lucide-react";

const { TextArea } = Input;

const mockChats = [
    {
        id: 1,
        name: "Alice Johnson",
        username: "@alice",
        avatar: "https://i.pravatar.cc/150?img=1",
        lastMessage: "Hey! How are you doing?",
        time: "5m ago",
        unread: true,
    },
    {
        id: 2,
        name: "Bob Smith",
        username: "@bob",
        avatar: "https://i.pravatar.cc/150?img=2",
        lastMessage: "That sounds great!",
        time: "1h ago",
        unread: false,
    },
    {
        id: 3,
        name: "Carol Williams",
        username: "@carol",
        avatar: "https://i.pravatar.cc/150?img=3",
        lastMessage: "See you tomorrow!",
        time: "2h ago",
        unread: false,
    },
];

const mockMessages = {
    1: [
        { id: 1, text: "Hey! How are you doing?", sender: "them", time: "10:30 AM" },
        { id: 2, text: "I'm doing great, thanks for asking!", sender: "me", time: "10:32 AM" },
        { id: 3, text: "Want to grab coffee later?", sender: "them", time: "10:33 AM" },
        { id: 4, text: "Sure! What time works for you?", sender: "me", time: "10:35 AM" },
        { id: 5, text: "How about 3 PM at the usual place?", sender: "them", time: "10:36 AM" },
    ],
    2: [
        { id: 1, text: "Did you see the game last night?", sender: "them", time: "Yesterday" },
        { id: 2, text: "Yes! It was amazing!", sender: "me", time: "Yesterday" },
    ],
    3: [
        { id: 1, text: "Are you coming to the party?", sender: "them", time: "Monday" },
        { id: 2, text: "Wouldn't miss it!", sender: "me", time: "Monday" },
        { id: 3, text: "Great! See you there!", sender: "them", time: "Monday" },
    ],
};

export default function ChatsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChat, setSelectedChat] = useState<typeof mockChats[0] | null>(null);
    const [messages, setMessages] = useState(mockMessages);
    const [messageInput, setMessageInput] = useState("");

    const filteredChats = mockChats.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedChat) return;

        const newMessage = {
            id: Date.now(),
            text: messageInput,
            sender: "me" as const,
            time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        };

        setMessages((prev) => ({
            ...prev,
            [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
        }));
        setMessageInput("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Chat Window View
    if (selectedChat) {
        const chatMessages = messages[selectedChat.id] || [];

        return (
            <div className='w-full flex justify-center h-[calc(100vh-2rem)]'>
                <div className='w-full max-w-3xl flex flex-col h-full'>
                    {/* Header */}
                    <div className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-t-2xl'>
                        <button
                            onClick={() => setSelectedChat(null)}
                            className='p-2 hover:bg-gray-100 rounded-full transition'
                        >
                            <ArrowLeft size={20} className='text-gray-600' />
                        </button>
                        <Avatar size={40} src={selectedChat.avatar} />
                        <div className='flex-1'>
                            <h3 className='font-semibold text-gray-800'>{selectedChat.name}</h3>
                            <p className='text-xs text-gray-500'>{selectedChat.username}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button className='p-2 hover:bg-gray-100 rounded-full transition'>
                                <Phone size={20} className='text-gray-600' />
                            </button>
                            <button className='p-2 hover:bg-gray-100 rounded-full transition'>
                                <Video size={20} className='text-gray-600' />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
                        {chatMessages.length === 0 ? (
                            <div className='text-center py-12'>
                                <p className='text-gray-500'>No messages yet. Say hi! 👋</p>
                            </div>
                        ) : (
                            chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`
                                            max-w-[70%] px-4 py-2 rounded-2xl
                                            ${msg.sender === "me"
                                                ? "bg-violet-600 text-white rounded-br-sm"
                                                : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                                            }
                                        `}
                                    >
                                        <p className='text-sm'>{msg.text}</p>
                                        <p
                                            className={`
                                                text-xs mt-1
                                                ${msg.sender === "me" ? "text-violet-200" : "text-gray-400"}
                                            `}
                                        >
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input */}
                    <div className='p-4 bg-white border border-gray-100 rounded-b-2xl'>
                        <div className='flex items-center gap-3'>
                            <button className='p-2 hover:bg-gray-100 rounded-full transition'>
                                <Paperclip size={20} className='text-gray-500' />
                            </button>
                            <TextArea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Type a message...'
                                autoSize={{ minRows: 1, maxRows: 4 }}
                                className='flex-1'
                            />
                            <button className='p-2 hover:bg-gray-100 rounded-full transition'>
                                <Smile size={20} className='text-gray-500' />
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                                className='p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Chats List View
    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>Chats</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* Search */}
                <div className='mb-6'>
                    <Input
                        prefix={<Search size={18} className='text-gray-400' />}
                        placeholder='Search chats...'
                        className='w-full'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Chats List */}
                <div className='space-y-2'>
                    {filteredChats.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-gray-500'>No chats found</p>
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition'
                            >
                                <div className='relative'>
                                    <Avatar size={48} src={chat.avatar} />
                                    {chat.unread && (
                                        <span className='absolute top-0 right-0 w-3 h-3 bg-violet-600 rounded-full border-2 border-white' />
                                    )}
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center justify-between'>
                                        <span className='font-semibold text-gray-800'>{chat.name}</span>
                                        <span className='text-xs text-gray-400'>{chat.time}</span>
                                    </div>
                                    <p className='text-sm text-gray-500 truncate'>{chat.lastMessage}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
