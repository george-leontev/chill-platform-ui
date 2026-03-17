"use client";

import { Avatar, Image as AntImage } from "antd";
import { ThumbsUp } from "lucide-react";
import { PostsModel } from "../models/posts-model";
import { useState } from "react";

interface PostCardProps {
    post: PostsModel;
    isLiked: boolean;
    onLike: (id: number) => void;
}

const PostCard = ({ post, isLiked, onLike }: PostCardProps) => {
    const [expanded, setExpanded] = useState(false);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";

        const d = new Date(dateString);

        if (isNaN(d.getTime())) {
            console.error("Invalid date:", dateString);
            return "";
        }

        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) {
            return "Just now";
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
    };

    const additionalImagesCount = post.images && post.images.length > 3 ? post.images.length - 3 : 0;

    const handleExpandClick = () => {
        setExpanded(true);
    };

    const handleCollapseClick = () => {
        setExpanded(false);
    };

    return (
        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
            <div className='flex gap-3'>
                <Avatar src={"https://i.pravatar.cc/150?img=8"} />

                <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                        <span className='font-semibold text-gray-800'>
                            {post.author.first_name} {post.author.last_name}
                        </span>

                        <span className='text-sm text-gray-500'>{post.author.username}</span>

                        <span className='text-xs text-gray-400'>•</span>

                        <span className='text-xs text-gray-400'>{formatDate(post.createdAt)}</span>
                    </div>

                    {/* Expanded grid view - shows all images when expanded */}
                    {expanded && post.images && post.images.length > 3 && (
                        <div className='mt-3 mb-3'>
                            <div className='grid grid-cols-3 gap-2'>
                                {post.images.map((img, idx) => (
                                    <div
                                        key={img.id || idx}
                                        className='relative w-full h-48 rounded-xl overflow-hidden'
                                    >
                                        <AntImage
                                            src={img.imageUrl}
                                            alt={`Post image ${idx + 1}`}
                                            className='w-full h-full cursor-pointer'
                                            style={{ objectFit: "fill" }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleCollapseClick}
                                className='mt-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer'
                            >
                                Show less
                            </button>
                        </div>
                    )}

                    {/* Compact view - shows only first 3 images */}
                    {!expanded && post.images && post.images.length > 0 && (
                        <AntImage.PreviewGroup>
                            <div className='mt-3 grid gap-2'>
                                {post.images.length === 1 && (
                                    <div className='relative w-full h-64 rounded-xl overflow-hidden'>
                                        <AntImage
                                            src={post.images[0].imageUrl}
                                            alt='Post image'
                                            className='w-full h-full cursor-pointer'
                                            style={{ objectFit: "fill" }}
                                        />
                                    </div>
                                )}
                                {post.images.length === 2 && (
                                    <div className='grid grid-cols-2 gap-2'>
                                        {post.images.map((img, idx) => (
                                            <div
                                                key={img.id || idx}
                                                className='relative w-full h-48 rounded-xl overflow-hidden'
                                            >
                                                <AntImage
                                                    src={img.imageUrl}
                                                    alt={`Post image ${idx + 1}`}
                                                    className='w-full h-full cursor-pointer'
                                                    style={{ objectFit: "fill" }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {post.images.length >= 3 && (
                                    <div className='grid grid-cols-3 gap-2'>
                                        {post.images.slice(0, 3).map((img, idx) => {
                                            const isThirdImageWithOverflow = idx === 2 && additionalImagesCount > 0;

                                            if (isThirdImageWithOverflow) {
                                                return (
                                                    <div
                                                        key={img.id || idx}
                                                        className='relative w-full h-32 rounded-xl overflow-hidden bg-gray-500 cursor-pointer'
                                                        onClick={handleExpandClick}
                                                    >
                                                        <AntImage
                                                            src={img.imageUrl}
                                                            alt={`Post image ${idx + 1}`}
                                                            className='w-full h-full'
                                                            style={{ objectFit: "fill", opacity: 0.5 }}
                                                        />
                                                        <div className='absolute inset-0 flex items-center justify-center z-10'>
                                                            <span className='text-white text-2xl font-bold'>
                                                                +{additionalImagesCount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={img.id || idx}
                                                    className='relative w-full h-32 rounded-xl overflow-hidden'
                                                >
                                                    <AntImage
                                                        src={img.imageUrl}
                                                        alt={`Post image ${idx + 1}`}
                                                        className='w-full h-full cursor-pointer'
                                                        style={{ objectFit: "fill" }}
                                                    />
                                                </div>
                                            );
                                        })}
                                        {/* Hidden images for PreviewGroup */}
                                        {additionalImagesCount > 0 && (
                                            <>
                                                {post.images.slice(3).map((img, idx) => (
                                                    <div key={img.id || idx + 3} className='hidden'>
                                                        <AntImage
                                                            src={img.imageUrl}
                                                            alt={`Post image ${idx + 4}`}
                                                            style={{ objectFit: "fill" }}
                                                        />
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </AntImage.PreviewGroup>
                    )}

                    {/* Content text below images */}
                    <p className='text-gray-700 mt-3'>{post.content}</p>

                    <div className='mt-3'>
                        <button
                            onClick={() => onLike(post.id)}
                            className={`
                                flex items-center gap-2 text-sm
                                ${isLiked ? "text-violet-600" : "text-gray-500"}
                                hover:text-violet-600
                                transition-colors
                                cursor-pointer
                            `}
                        >
                            <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
                            Like
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
