"use client";

import { Avatar } from "antd";
import { PostsModel } from "../models/posts-model";
import PostImagesGallery from "./post-images-gallery";
import LikeButton from "./like-button";
import ShareButton from "./share-button";

interface PostCardProps {
    post: PostsModel;
    initialIsLiked?: boolean;
}

const PostCard = ({ post, initialIsLiked = false }: PostCardProps) => {
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

    return (
        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
            <div className='flex gap-3'>
                <Avatar src={"https://i.pravatar.cc/150?img=8"} />

                <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                        <span className='font-semibold text-gray-800'>
                            {post.author.firstName} {post.author.lastName}
                        </span>

                        <span className='text-sm text-gray-500'>{post.author.username}</span>

                        <span className='text-xs text-gray-400'>•</span>

                        <span className='text-xs text-gray-400'>{formatDate(post.createdAt)}</span>
                    </div>

                    {/* Images Gallery */}
                    {post.images && post.images.length > 0 && <PostImagesGallery images={post.images} />}

                    {/* Content text below images */}
                    <p className='text-gray-700 mt-3'>{post.content}</p>

                    <div className='flex items-center gap-6 mt-4'>
                        <LikeButton postId={post.id} initialIsLiked={initialIsLiked} likeCount={post.likesCount} />
                        <ShareButton postId={post.id} content={post.content} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
