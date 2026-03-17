"use client";

import { ThumbsUp, Heart } from "lucide-react";
import { usePosts } from "../contexts/posts-data-context";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LikeButtonProps {
    postId: number;
    initialIsLiked?: boolean;
    likeCount?: number;
}

export default function LikeButton({ postId, initialIsLiked = false, likeCount: initialLikeCount }: LikeButtonProps) {
    const { toggleLikeAsync } = usePosts();
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
    const [showParticles, setShowParticles] = useState(false);

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const wasLiked = isLiked;
        
        // Optimistically update UI
        setIsLiked(!wasLiked);
        setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

        if (!wasLiked) {
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 600);
        }

        const result = await toggleLikeAsync(postId);
        if (result) {
            setIsLiked(result.liked);
            if (result.likeCount !== undefined) {
                setLikeCount(result.likeCount);
            }
        }
    };

    const particles = Array.from({ length: 6 });

    return (
        <button
            type="button"
            onClick={handleLike}
            className={`
                relative flex items-center gap-2 text-sm
                ${isLiked ? "text-violet-600" : "text-gray-500"}
                hover:text-violet-600
                transition-colors
                cursor-pointer
            `}
        >
            <AnimatePresence>
                {showParticles &&
                    particles.map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 1,
                                scale: 0,
                                x: 0,
                                y: 0,
                            }}
                            animate={{
                                opacity: 0,
                                scale: [0, 1, 0],
                                x: (Math.random() - 0.5) * 60,
                                y: (Math.random() - 0.5) * 60 - 20,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className='absolute text-violet-500'
                            style={{
                                left: "50%",
                                top: "50%",
                            }}
                        >
                            <Heart size={8} fill='currentColor' />
                        </motion.div>
                    ))}
            </AnimatePresence>

            <motion.div
                animate={isLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
            </motion.div>

            <motion.span
                key={likeCount}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className={isLiked ? 'text-violet-600 font-medium' : ''}
            >
                {likeCount}
            </motion.span>
        </button>
    );
}
