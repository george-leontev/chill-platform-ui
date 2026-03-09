"use client";

import { Avatar, Input } from "antd";
import { ImagePlus, Smile, ThumbsUp } from "lucide-react";
import { useState } from "react";

const { TextArea } = Input;

export default function HomePage() {
    const [liked, setLiked] = useState<number[]>([]);

    const posts = [
        {
            id: 1,
            name: "Alice Johnson",
            username: "@alice",
            avatar: "https://i.pravatar.cc/150?img=5",
            content: "Just finished building a new React project. Feeling productive today 🚀",
        },
        {
            id: 2,
            name: "Mark Brown",
            username: "@mark",
            avatar: "https://i.pravatar.cc/150?img=8",
            content: "Coffee + coding = perfect morning ☕",
        },
    ];

    function toggleLike(id: number) {
        setLiked((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
    }

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                {/* HEADER */}
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>For You</h1>

                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* CREATE POST */}
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6'>
                    <div className='flex gap-4'>
                        <Avatar size={42} src='https://i.pravatar.cc/100' />

                        <div className='flex-1'>
                            <TextArea
                                placeholder='Share something with Chill Platform...'
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                className='text-gray-700 text-base'
                            />

                            {/* ACTION ROW */}
                            <div className='flex items-center justify-end gap-2 mt-4'>
                                <button
                                    className='
                  flex items-center justify-center
                  w-9 h-9 rounded-lg
                  text-gray-500
                  hover:bg-gray-100
                  hover:text-violet-600
                  transition
                  '
                                >
                                    <ImagePlus size={18} />
                                </button>

                                <button
                                    className='
                  flex items-center justify-center
                  w-9 h-9 rounded-lg
                  text-gray-500
                  hover:bg-gray-100
                  hover:text-violet-600
                  transition
                  '
                                >
                                    <Smile size={18} />
                                </button>

                                <button
                                    className='
                  px-5 py-2
                  bg-violet-600
                  text-white
                  rounded-full
                  font-medium
                  hover:bg-violet-700
                  transition
                  shadow-sm
                  '
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* POSTS */}
                <div className='space-y-4'>
                    {posts.map((post) => {
                        const isLiked = liked.includes(post.id);

                        return (
                            <div key={post.id} className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
                                <div className='flex gap-3'>
                                    <Avatar src={post.avatar} />

                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-semibold text-gray-800'>{post.name}</span>

                                            <span className='text-sm text-gray-500'>{post.username}</span>
                                        </div>

                                        <p className='text-gray-700 mt-1'>{post.content}</p>

                                        <div className='mt-3'>
                                            <button
                                                onClick={() => toggleLike(post.id)}
                                                className={`
                          flex items-center gap-2 text-sm
                          ${isLiked ? "text-violet-600" : "text-gray-500"}
                          hover:text-violet-600
                        `}
                                            >
                                                <ThumbsUp size={18} />
                                                Like
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
