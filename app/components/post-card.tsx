import { Avatar } from "antd";
import { ThumbsUp } from "lucide-react";
import { PostsModel } from "../models/posts-model";

interface PostCardProps {
    post: PostsModel;
    isLiked: boolean;
    onLike: (id: number) => void;
}

const PostCard = ({ post, isLiked, onLike }: PostCardProps) => {
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
                            {post.author.first_name} {post.author.last_name}
                        </span>

                        <span className='text-sm text-gray-500'>{post.author.username}</span>

                        <span className='text-xs text-gray-400'>•</span>

                        <span className='text-xs text-gray-400'>{formatDate(post.createdAt)}</span>
                    </div>

                    {/* Images above content */}
                    {post.images && post.images.length > 0 && (
                        <div className='mt-3 grid gap-2'>
                            {post.images.length === 1 && (
                                <div className='relative w-full h-64 rounded-xl overflow-hidden'>
                                    <img src={post.images[0]} alt='Post image' className='w-full h-full object-cover' />
                                </div>
                            )}
                            {post.images.length === 2 && (
                                <div className='grid grid-cols-2 gap-2'>
                                    {post.images.map((img, idx) => (
                                        <div key={idx} className='relative w-full h-48 rounded-xl overflow-hidden'>
                                            <img
                                                src={img}
                                                alt={`Post image ${idx + 1}`}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {post.images.length >= 3 && (
                                <div className='grid grid-cols-3 gap-2'>
                                    {post.images.slice(0, 3).map((img, idx) => (
                                        <div key={idx} className='relative w-full h-32 rounded-xl overflow-hidden'>
                                            <img
                                                src={img}
                                                alt={`Post image ${idx + 1}`}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
