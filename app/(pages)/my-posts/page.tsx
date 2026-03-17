"use client";

import { usePosts } from "../../contexts/posts-data-context";
import { PostsModel } from "../../models/posts-model";
import { useEffect, useState, useMemo } from "react";
import PostCard from "../../components/post-card";

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

    const totalLikes = useMemo(() => {
        return myPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
    }, [myPosts]);

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
                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>{myPosts.length}</p>
                        <p className='text-sm text-gray-500'>Total Posts</p>
                    </div>
                    <div className='bg-white border border-gray-100 rounded-2xl p-4 text-center'>
                        <p className='text-2xl font-bold text-violet-600'>{totalLikes}</p>
                        <p className='text-sm text-gray-500'>Total Likes</p>
                    </div>
                </div>

                {/* Posts List */}
                <div className='space-y-4'>
                    {myPosts.map((post) => (
                        <PostCard key={post.id} post={post} initialIsLiked={post.isLiked} />
                    ))}
                </div>
            </div>
        </div>
    );
}
