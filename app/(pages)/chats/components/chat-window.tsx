"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Input } from "antd";
import { ArrowLeft, Send, Smile, Paperclip, Phone, Video } from "lucide-react";
import ChatMessageBubble from "./chat-message-bubble";
import EmojiPicker from "@/app/components/emoji-picker";
import { ConversationModel } from "@/app/models/conversation-model";
import { MessageModel } from "@/app/models/message-model";
import { useMessages } from "@/app/contexts/messages-context";

const { TextArea } = Input;

interface ChatWindowProps {
    selectedChat: ConversationModel;
    messages: MessageModel[];
    currentUserId: number;
    onBack: () => void;
    onSendMessage: (text: string) => void;
}

export default function ChatWindow({ selectedChat, messages, currentUserId, onBack, onSendMessage }: ChatWindowProps) {
    const { sendTypingIndicator, isUserTyping, markAsRead } = useMessages();
    const [messageInput, setMessageInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const prevMessagesLengthRef = useRef<number>(0);

    const partnerTyping = isUserTyping(selectedChat.partner.id);

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, []);

    // Mark messages as read when new messages arrive from partner
    useEffect(() => {
        const unreadFromPartner = messages.filter(
            (m) => m.senderId === selectedChat.partner.id && !m.isRead,
        );

        if (unreadFromPartner.length > 0 && prevMessagesLengthRef.current !== messages.length) {
            markAsRead(selectedChat.partner.id);
        }
        prevMessagesLengthRef.current = messages.length;
    }, [messages, selectedChat.partner.id, markAsRead]);

    // Scroll to bottom when messages change or typing indicator appears/disappears
    useEffect(() => {
        scrollToBottom();
    }, [messages, partnerTyping, scrollToBottom]);

    const handleSendMessage = useCallback(() => {
        if (!messageInput.trim()) return;
        onSendMessage(messageInput);
        setMessageInput("");
        // Stop typing indicator when message is sent
        sendTypingIndicator(selectedChat.partner.id, false);
    }, [messageInput, onSendMessage, sendTypingIndicator, selectedChat.partner.id]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage],
    );

    const handleEmojiSelect = (emoji: string) => {
        setMessageInput((prev) => prev + emoji);
    };

    // Send typing indicator when user starts/stops typing
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (messageInput.trim()) {
                sendTypingIndicator(selectedChat.partner.id, true);
            } else {
                sendTypingIndicator(selectedChat.partner.id, false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [messageInput, sendTypingIndicator, selectedChat.partner.id]);

    // Stop typing indicator when component unmounts (user leaves chat)
    useEffect(() => {
        return () => {
            sendTypingIndicator(selectedChat.partner.id, false);
        };
    }, [sendTypingIndicator, selectedChat.partner.id]);

    return (
        <div className='w-full flex justify-center h-[calc(100vh-2rem)]'>
            <div className='w-full max-w-3xl flex flex-col h-full'>
                <div className='flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-t-2xl'>
                    <button onClick={onBack} className='p-2 hover:bg-gray-100 rounded-full transition'>
                        <ArrowLeft size={20} className='text-gray-600' />
                    </button>
                    <div className='relative'>
                        <Avatar
                            size={40}
                            src={selectedChat.partner.avatar || undefined}
                            alt={`${selectedChat.partner.firstName} ${selectedChat.partner.lastName}`}
                        />
                        {/* Online status indicator */}
                        {selectedChat.isOnline && (
                            <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white' />
                        )}
                    </div>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                            <h3 className='font-semibold text-gray-800'>
                                {selectedChat.partner.firstName} {selectedChat.partner.lastName}
                            </h3>
                            {selectedChat.isOnline && (
                                <span className='text-xs text-green-600 font-medium'>Online</span>
                            )}
                        </div>
                        <p className='text-xs text-gray-500'>{selectedChat.partner.username}</p>
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
                <div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
                    {!messages || messages.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-gray-500'>No messages yet. Say hi! 👋</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <ChatMessageBubble key={msg.id} message={msg} currentUserId={currentUserId} />
                        ))
                    )}
                    {/* Typing indicator */}
                    {partnerTyping && (
                        <div className='flex items-center gap-2 text-gray-500 text-sm'>
                            <div className='flex gap-1'>
                                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                                <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                            </div>
                            <span>{selectedChat.partner.firstName} is typing...</span>
                        </div>
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
                        <div className='flex justify-center items-center relative'>
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className='
                                    flex items-center justify-center
                                    w-9 h-9 rounded-lg
                                    text-gray-500
                                    hover:bg-gray-100
                                    hover:text-violet-600
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                '
                                title='Add emoji'
                            >
                                <Smile size={20} className='text-gray-500' />
                            </button>
                            {showEmojiPicker && (
                                <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
                            )}
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim()}
                            className='p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
