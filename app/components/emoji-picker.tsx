"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

const emojis = [
    "😀", "😂", "😍", "🥰", "😊", "😎", "🥳", "🌟", "✨", "🎉",
    "🔥", "💯", "🙌", "👏", "🤝", "💖", "🌈", "🫶", "🏆", "☀️",
    "🌸", "🎵", "🍀", "🦋", "🍕", "🚀", "💡", "🎨", "🌙", "⭐"
];

const EMOJIS_PER_PAGE = 10;
const totalPages = Math.ceil(emojis.length / EMOJIS_PER_PAGE);

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const startIndex = currentPage * EMOJIS_PER_PAGE;
    const currentEmojis = emojis.slice(startIndex, startIndex + EMOJIS_PER_PAGE);

    return (
        <div
            ref={pickerRef}
            className='
                absolute bottom-full right-0 mb-2
                bg-white border border-gray-200 rounded-xl shadow-lg
                p-3 z-10
                min-w-[200px]
            '
        >
            <div className='grid grid-cols-5 gap-1 mb-2'>
                {currentEmojis.map((emoji) => (
                    <button
                        key={emoji}
                        onClick={() => {
                            onSelect(emoji);
                            onClose();
                        }}
                        className='
                            w-10 h-10
                            flex items-center justify-center
                            text-xl
                            hover:bg-gray-100 rounded
                            transition
                        '
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            <div className='flex items-center justify-center gap-2'>
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className='
                        p-1
                        disabled:opacity-30 disabled:cursor-not-allowed
                        hover:bg-gray-100 rounded
                        transition
                    '
                >
                    <ChevronLeft className='w-4 h-4' />
                </button>
                <div className='flex gap-1'>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`
                                w-2 h-2 rounded-full
                                transition
                                ${currentPage === i ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'}
                            `}
                        />
                    ))}
                </div>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                    className='
                        p-1
                        disabled:opacity-30 disabled:cursor-not-allowed
                        hover:bg-gray-100 rounded
                        transition
                    '
                >
                    <ChevronRight className='w-4 h-4' />
                </button>
            </div>
        </div>
    );
}
