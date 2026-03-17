"use client";

import { usePosts } from "../../contexts/posts-data-context";
import { PostsModel } from "../../models/posts-model";
import { useEffect, useState } from "react";
import PostCard from "../../components/post-card";

export default function LikedPage() {
    const { getLikedPostsAsync, isLoading } = usePosts();

    const [likedPosts, setLikedPosts] = useState<PostsModel[]>([]);

    useEffect(() => {
        const fetchLikedPosts = async () => {
            const posts = await getLikedPostsAsync();
            if (posts) {
                // Sort by like createdAt (most recent first)
                const sorted = [...posts].sort((a, b) => {
                    // likes array should already be filtered to current user's like by the API
                    const aTime = a.likes?.[0]?.createdAt ? new Date(a.likes[0].createdAt).getTime() : 0;
                    const bTime = b.likes?.[0]?.createdAt ? new Date(b.likes[0].createdAt).getTime() : 0;
                    return bTime - aTime;
                });
                setLikedPosts(sorted);
            }
        };
        fetchLikedPosts();
    }, [getLikedPostsAsync]);

    if (isLoading && likedPosts.length === 0) {
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
                    <h1 className='text-2xl font-semibold text-gray-800'>Liked Posts</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* Posts List */}
                <div className='space-y-4'>
                    {likedPosts.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-gray-500'>No liked posts yet</p>
                        </div>
                    ) : (
                        likedPosts.map((post) => <PostCard key={post.id} post={post} initialIsLiked={true} />)
                    )}
                </div>
            </div>
        </div>
    );
}
