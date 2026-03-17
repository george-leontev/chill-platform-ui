"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
    postId: number;
    content?: string;
}

export default function ShareButton({ postId, content = "" }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const getUrlToShare = () => {
        return `${window.location.origin}/posts/${postId}`;
    };

    const getShareText = () => {
        return `Check out this post: ${content}`;
    };

    const shareOptions = [
        {
            name: "Telegram",
            icon: (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.121.832.941z' />
                </svg>
            ),
            color: "text-blue-500",
            onClick: () => {
                const url = `https://t.me/share/url?url=${encodeURIComponent(getUrlToShare())}&text=${encodeURIComponent(getShareText())}`;
                window.open(url, "_blank");
            },
        },
        {
            name: "WhatsApp",
            icon: (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012 0C5.472 0 .16 5.314.157 11.842c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.527 0 11.842-5.314 11.843-11.842a11.821 11.821 0 00-3.48-8.413Z' />
                </svg>
            ),
            color: "text-green-500",
            onClick: () => {
                const url = `https://wa.me/?text=${encodeURIComponent(getShareText() + " " + getUrlToShare())}`;
                window.open(url, "_blank");
            },
        },
        {
            name: "Twitter",
            icon: (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                </svg>
            ),
            color: "text-gray-900",
            onClick: () => {
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getUrlToShare())}`;
                window.open(url, "_blank");
            },
        },
        {
            name: "Copy Link",
            icon: (
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                    />
                </svg>
            ),
            color: "text-gray-600",
            onClick: async () => {
                try {
                    await navigator.clipboard.writeText(getUrlToShare());
                    alert("Link copied to clipboard!");
                } catch (err) {
                    console.error("Failed to copy:", err);
                }
            },
        },
        {
            name: "More",
            icon: (
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
                    />
                </svg>
            ),
            color: "text-gray-600",
            onClick: async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: "Check out this post",
                            text: getShareText(),
                            url: getUrlToShare(),
                        });
                    } catch (err) {
                        console.error("Share failed:", err);
                    }
                } else {
                    alert("Web Share API is not supported in your browser");
                }
            },
        },
    ];

    return (
        <div className='relative'>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors cursor-pointer'
            >
                <Share2 size={18} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />

                        {/* Share options menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className='absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 min-w-[180px]'
                        >
                            <div className='flex flex-col gap-1'>
                                {shareOptions.map((option) => (
                                    <button
                                        key={option.name}
                                        onClick={() => {
                                            option.onClick();
                                            setIsOpen(false);
                                        }}
                                        className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'
                                    >
                                        <span className={option.color}>{option.icon}</span>
                                        <span className='text-sm text-gray-700'>{option.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
