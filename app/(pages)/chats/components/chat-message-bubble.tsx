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
                    {/* Read receipt indicator for sent messages */}
                    {isMe && (
                        <Check
                            size={14}
                            className={`${message.isRead ? "text-blue-300" : "text-violet-300"}`}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}
