"use client";

import { Avatar } from "antd";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

const mockLikedPosts = [
    {
        id: 1,
        author: {
            first_name: "Alice",
            last_name: "Johnson",
            username: "@alice",
        },
        content: "Just launched my new portfolio website! Check it out 🚀",
        likes: 156,
        comments: 23,
        createdAt: "1h ago",
        isLiked: true,
    },
    {
        id: 2,
        author: {
            first_name: "Bob",
            last_name: "Smith",
            username: "@bob",
        },
        content: "Amazing coffee shop I discovered today. The atmosphere is perfect for working!",
        likes: 89,
        comments: 15,
        createdAt: "5h ago",
        isLiked: true,
    },
    {
        id: 3,
        author: {
            first_name: "Carol",
            last_name: "Williams",
            username: "@carol",
        },
        content: "Weekend vibes! Spending time with family is the best therapy 💕",
        likes: 234,
        comments: 41,
        createdAt: "1d ago",
        isLiked: true,
    },
];

export default function LikedPage() {
    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>Liked Posts</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* Posts List */}
                <div className='space-y-4'>
                    {mockLikedPosts.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-gray-500'>No liked posts yet</p>
                        </div>
                    ) : (
                        mockLikedPosts.map((post) => (
                            <div
                                key={post.id}
                                className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'
                            >
                                <div className='flex gap-3'>
                                    <Avatar
                                        size={42}
                                        src={`https://i.pravatar.cc/150?img=${post.id}`}
                                    />

                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-semibold text-gray-800'>
                                                {post.author.first_name} {post.author.last_name}
                                            </span>
                                            <span className='text-sm text-gray-500'>
                                                {post.author.username}
                                            </span>
                                            <span className='text-xs text-gray-400'>•</span>
                                            <span className='text-xs text-gray-400'>{post.createdAt}</span>
                                        </div>

                                        <p className='text-gray-700 mt-1'>{post.content}</p>

                                        <div className='flex items-center gap-6 mt-4'>
                                            <button className='flex items-center gap-2 text-sm text-violet-600'>
                                                <ThumbsUp size={18} fill='currentColor' />
                                                {post.likes}
                                            </button>
                                            <button className='flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition'>
                                                <MessageCircle size={18} />
                                                {post.comments}
                                            </button>
                                            <button className='flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition'>
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
