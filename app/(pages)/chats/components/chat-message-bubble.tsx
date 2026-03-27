import { MessageModel } from "@/app/models/message-model";
import { Check } from "lucide-react";
import { formatMessageBubbleTime } from "@/app/utils/time-format";
import { motion } from "framer-motion";

interface ChatMessageBubbleProps {
    message: MessageModel;
    currentUserId: number;
}

export default function ChatMessageBubble({ message, currentUserId }: ChatMessageBubbleProps) {
    const isMe = message.senderId === currentUserId;
    const isRead = message.isRead;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`
                    max-w-[70%] px-4 py-2 rounded-2xl
                    ${isMe
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                    }
                `}
            >
                <p className='text-sm'>{message.content}</p>
                <div className='flex items-center justify-end gap-1 mt-1'>
                    <p
                        className={`
                            text-xs
                            ${isMe ? "text-violet-200" : "text-gray-400"}
                        `}
                    >
                        {formatMessageBubbleTime(message.createdAt)}
                    </p>
                    {/* Read receipt indicator - overlaid double check marks with animation */}
                    {isMe && (
                        <div className='relative w-5 h-4'>
                            {/* First check */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: isRead ? 0 : 0,
                                }}
                                transition={{ duration: 0.15 }}
                                className='absolute left-0 top-0'
                            >
                                <Check
                                    size={14}
                                    className={`${isRead ? "text-blue-400" : "text-violet-200"}`}
                                    strokeWidth={3}
                                />
                            </motion.div>
                            {/* Second check - slightly offset to create double check effect */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, x: 2 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: isRead ? 5 : 3,
                                }}
                                transition={{
                                    duration: 0.15,
                                    delay: isRead ? 0.08 : 0
                                }}
                                className='absolute left-0 top-0'
                            >
                                <Check
                                    size={14}
                                    className={`${isRead ? "text-blue-400" : "text-violet-200"}`}
                                    strokeWidth={3}
                                />
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
