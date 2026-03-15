"use client";

import { Avatar } from "antd";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

const mockPosts = [
    {
        id: 1,
        content: "Just finished my morning run! Feeling great 🏃‍♂️",
        likes: 24,
        comments: 5,
        createdAt: "2h ago",
    },
    {
        id: 2,
        content: "Beautiful sunset today! Check out this view 🌅",
        likes: 42,
        comments: 12,
        createdAt: "1d ago",
    },
    {
        id: 3,
        content: "Working on a new project. Excited to share more soon!",
        likes: 18,
        comments: 3,
        createdAt: "3d ago",
    },
];

export default function MyPostsPage() {
    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>My Posts</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* Stats */}
                <div className='grid grid-cols-3 gap-4 mb-6'>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>{mockPosts.length}</p>
                        <p className='text-sm text-gray-500'>Total Posts</p>
                    </div>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>
                            {mockPosts.reduce((acc, post) => acc + post.likes, 0)}
                        </p>
                        <p className='text-sm text-gray-500'>Total Likes</p>
                    </div>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>
                            {mockPosts.reduce((acc, post) => acc + post.comments, 0)}
                        </p>
                        <p className='text-sm text-gray-500'>Comments</p>
                    </div>
                </div>

                {/* Posts List */}
                <div className='space-y-4'>
                    {mockPosts.map((post) => (
                        <div
                            key={post.id}
                            className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'
                        >
                            <div className='flex gap-3'>
                                <Avatar size={42} src='https://i.pravatar.cc/100' />

                                <div className='flex-1'>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-semibold text-gray-800'>John Doe</span>
                                        <span className='text-xs text-gray-400'>•</span>
                                        <span className='text-xs text-gray-400'>{post.createdAt}</span>
                                    </div>

                                    <p className='text-gray-700 mt-1'>{post.content}</p>

                                    <div className='flex items-center gap-6 mt-4'>
                                        <button className='flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition'>
                                            <ThumbsUp size={18} />
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
                    ))}
                </div>
            </div>
        </div>
    );
}
