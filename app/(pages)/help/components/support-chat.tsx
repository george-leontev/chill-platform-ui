"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Smartphone, Loader2 } from "lucide-react";
import { useAuth } from "@/app/contexts/app-auth-context";
import { useAuthHttpRequest } from "@/app/contexts/use-auth-http-request";
import { routes } from "@/app/constants/app-api-routes";
import { HttpConstants } from "@/app/constants/app-http-constants";
import { SupportMessageModel, SupportTicketModel } from "@/app/models/support-ticket-model";

export default function SupportChat() {
    const { getUserAuthDataFromStorage } = useAuth();
    const authHttpRequest = useAuthHttpRequest();

    const [isExpanded, setIsExpanded] = useState(false);
    const [ticket, setTicket] = useState<SupportTicketModel | null>(null);
    const [messages, setMessages] = useState<SupportMessageModel[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [wsError, setWsError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch ticket when expanded
    const fetchTicket = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authHttpRequest({
                method: "GET",
                url: `${routes.host}${routes.supportTicket}`,
            });

            if (response && response.data && response.status === HttpConstants.StatusCodes.Ok) {
                const ticketData = response.data as SupportTicketModel;
                setTicket(ticketData);
                setMessages(ticketData.messages || []);
            }
        } catch (err) {
            console.error("Failed to fetch support ticket:", err);
        } finally {
            setIsLoading(false);
        }
    }, [authHttpRequest]);

    // Connect WebSocket when expanded
    useEffect(() => {
        if (!isExpanded) return;

        const authData = getUserAuthDataFromStorage();
        if (!authData?.token) return;

        const wsUrl = `${routes.host.replace("http", "ws")}${routes.wsSupport}?token=${authData.token}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setWsError(null);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "support_reply") {
                    const msg = data.data.message as SupportMessageModel;
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === msg.id)) return prev;
                        return [...prev, msg];
                    });
                } else if (data.type === "support_ticket_closed") {
                    setTicket((prev) => (prev ? { ...prev, status: "closed" } : prev));
                }
            } catch (err) {
                console.error("WS message parse error:", err);
            }
        };

        ws.onerror = () => {
            setWsError("Connection lost. Messages may not arrive in real-time.");
        };

        ws.onclose = () => {
            wsRef.current = null;
        };

        return () => {
            ws.close();
            wsRef.current = null;
        };
    }, [isExpanded, getUserAuthDataFromStorage]);

    // Fetch ticket on expand
    useEffect(() => {
        if (isExpanded && !ticket) {
            fetchTicket();
        }
    }, [isExpanded, ticket, fetchTicket]);

    const handleSend = async () => {
        if (!inputValue.trim() || isSending) return;
        setIsSending(true);

        try {
            const response = await authHttpRequest({
                method: "POST",
                url: `${routes.host}${routes.supportMessage}`,
                data: { content: inputValue.trim() },
            });

            if (response && response.data && response.status === HttpConstants.StatusCodes.Ok) {
                const newMsg = response.data as SupportMessageModel;
                setMessages((prev) => [...prev, newMsg]);
                setTicket((prev) => (prev ? { ...prev, id: newMsg.ticketId } : prev));
                setInputValue("");
            }
        } catch (err) {
            console.error("Failed to send support message:", err);
        } finally {
            setIsSending(false);
        }
    };

    const isClosed = ticket?.status === "closed";

    return (
        <motion.div
            className='overflow-hidden bg-white border border-gray-100 rounded-2xl'
            initial={false}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition'
            >
                <div className='p-3 bg-violet-50 rounded-xl'>
                    <MessageCircle size={20} className='text-violet-600' />
                </div>
                <div className='flex-1'>
                    <p className='font-medium text-gray-800'>Live Chat</p>
                    <p className='text-sm text-gray-500'>
                        {isExpanded
                            ? isClosed
                                ? "Ticket closed"
                                : "Chat with us right here"
                            : "Chat with our support team"}
                    </p>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-gray-400'
                    >
                        <polyline points='6 9 12 15 18 9' />
                    </svg>
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className='px-4 pb-4 border-t border-gray-100'>
                            {/* Mobile app prompt */}
                            <div className='flex items-start gap-3 p-3 mt-3 bg-violet-50/60 rounded-xl'>
                                <Smartphone size={18} className='text-violet-600 mt-0.5 shrink-0' />
                                <p className='text-sm text-gray-700 leading-relaxed'>
                                    For the best chatting experience, download our mobile app! You can
                                    also send us a message right here — the chat below is ready to use.
                                </p>
                            </div>

                            {/* WS error notice */}
                            {wsError && (
                                <div className='mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700'>
                                    {wsError}
                                </div>
                            )}

                            {/* Chat messages area */}
                            <div className='mt-3 min-h-[120px] max-h-[300px] overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-xl'>
                                {isLoading ? (
                                    <div className='flex items-center justify-center h-[120px] text-gray-400'>
                                        <Loader2 size={24} className='animate-spin' />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className='flex flex-col items-center justify-center h-[120px] text-gray-400'>
                                        <MessageCircle size={32} className='mb-2' />
                                        <p className='text-sm'>No messages yet</p>
                                        <p className='text-xs'>Send a message to start the chat</p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.isFromSupport ? "justify-start" : "justify-end"}`}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                                                        msg.isFromSupport
                                                            ? "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                                                            : "bg-violet-600 text-white rounded-br-md"
                                                    }`}
                                                >
                                                    {msg.content}
                                                </motion.div>
                                            </div>
                                        ))}
                                        {isClosed && (
                                            <div className='text-center text-xs text-gray-400 pt-2'>
                                                This ticket has been closed by support.
                                            </div>
                                        )}
                                    </>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Message input */}
                            {!isClosed && (
                                <div className='flex items-center gap-2 mt-3'>
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onPressEnter={handleSend}
                                        placeholder='Type a message...'
                                        className='flex-1'
                                        size='middle'
                                        disabled={isSending || isLoading}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isSending || isLoading}
                                        className='
                                            flex items-center justify-center
                                            w-10 h-10
                                            bg-violet-600 text-white
                                            rounded-full
                                            hover:bg-violet-700
                                            transition
                                            disabled:opacity-50
                                            disabled:cursor-not-allowed
                                            cursor-pointer
                                            shrink-0
                                        '
                                    >
                                        {isSending ? (
                                            <Loader2 size={16} className='animate-spin' />
                                        ) : (
                                            <Send size={16} />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
