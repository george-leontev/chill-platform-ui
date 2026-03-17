"use client";

import { Avatar } from "antd";
import { MessageCircle, Share2 } from "lucide-react";
import { usePosts } from "../../contexts/posts-data-context";
import { PostsModel } from "../../models/posts-model";
import { useEffect, useState } from "react";
import PostImagesGallery from "../../components/post-images-gallery";
import LikeButton from "../../components/like-button";

export default function MyPostsPage() {
    const { getMyPostsAsync, isLoading } = usePosts();

    const [myPosts, setMyPosts] = useState<PostsModel[]>([]);

    useEffect(() => {
        const fetchMyPosts = async () => {
            const posts = await getMyPostsAsync();
            if (posts) {
                setMyPosts(posts);
            }
        };
        fetchMyPosts();
    }, [getMyPostsAsync]);

    if (isLoading && myPosts.length === 0) {
        return (
            <div className='w-full flex justify-center items-center min-h-screen'>
                <div className='text-gray-500'>Loading...</div>
            </div>
        );
    }

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
                        <p className='text-2xl font-bold text-violet-600'>{myPosts.length}</p>
                        <p className='text-sm text-gray-500'>Total Posts</p>
                    </div>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>0</p>
                        <p className='text-sm text-gray-500'>Total Likes</p>
                    </div>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>0</p>
                        <p className='text-sm text-gray-500'>Comments</p>
                    </div>
                </div>

                {/* Posts List */}
                <div className='space-y-4'>
                    {myPosts.map((post) => (
                        <div key={post.id} className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
                            <div className='flex gap-3'>
                                <Avatar size={42} src='https://i.pravatar.cc/100' />

                                <div className='flex-1'>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-semibold text-gray-800'>{post.author.username}</span>
                                        <span className='text-xs text-gray-400'>•</span>
                                        <span className='text-xs text-gray-400'>
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className='font-semibold text-gray-800 mt-2'>{post.title}</h3>

                                    <p className='text-gray-700 mt-1'>{post.content}</p>

                                    {/* Images Gallery */}
                                    {post.images && post.images.length > 0 && (
                                        <PostImagesGallery images={post.images} />
                                    )}

                                    <div className='flex items-center gap-6 mt-4'>
                                        <LikeButton postId={post.id} />
                                        <button className='flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition'>
                                            <MessageCircle size={18} />0
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
