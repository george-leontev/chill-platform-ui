"use client";

import { PostsProvider, usePosts } from "@/app/contexts/posts-data-context";
import { useState, useMemo } from "react";
import PostsSkeleton from "@/app/components/posts-skeleton-component";
import PostCard from "@/app/components/post-card";
import CreatePostForm from "@/app/components/create-post-form";
import { CreateOrUpdatePostModel } from "@/app/models/create-or-update-post-model";

const HomePageInternal = () => {
    const { posts, isLoading, createPostAsync } = usePosts();
    const [isPosting, setIsPosting] = useState(false);

    const handlePostSubmit = async (content: string, imageUrls: string[]) => {
        setIsPosting(true);

        try {
            const newPost: CreateOrUpdatePostModel = {
                title: "",
                content: content,
                images: imageUrls,
            };

            const createdPost = await createPostAsync(newPost);

            if (createdPost) {
                // Post created successfully
            }
        } catch (error) {
            console.error("Error posting:", error);
        } finally {
            setIsPosting(false);
        }
    };

    const sortedPosts = useMemo(() => {
        if (!posts || posts.length === 0) return [];
        return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [posts]);

    if (isLoading) {
        return (
            <div className='w-full flex justify-center'>
                <div className='w-full max-w-3xl'>
                    <div className='flex flex-col items-center mb-8 w-full'>
                        <h1 className='text-2xl font-semibold text-gray-800'>For You</h1>
                        <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                    </div>
                    <PostsSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <div className='flex flex-col items-center mb-8 w-full'>
                    <h1 className='text-2xl font-semibold text-gray-800'>For You</h1>
                    <div className='w-28 h-1 bg-violet-600 rounded mt-2' />
                </div>

                {/* Create post form */}
                <div className='mb-6'>
                    <CreatePostForm onSubmit={handlePostSubmit} isPosting={isPosting} />
                </div>

                {/* Posts list */}
                <div className='space-y-4'>
                    {!sortedPosts || sortedPosts.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-gray-500'>No posts yet. Be the first to share something!</p>
                        </div>
                    ) : (
                        sortedPosts.map((post) => <PostCard key={post.id} post={post} initialIsLiked={post.isLiked} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default function HomePage() {
    return (
        <PostsProvider>
            <HomePageInternal />
        </PostsProvider>
    );
}
