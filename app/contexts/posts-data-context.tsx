"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { PostsModel } from "../models/posts-model";
import { CreateOrUpdatePostModel } from "../models/create-or-update-post-model";
import { routes } from "../constants/app-api-routes";
import { HttpConstants } from "../constants/app-http-constants";
import { useAuthHttpRequest } from "./use-auth-http-request";

type NewsContextType = {
    posts: PostsModel[];
    isLoading: boolean;
    getPostByIdAsync: (id: number) => Promise<PostsModel | undefined>;
    createPostAsync: (post: CreateOrUpdatePostModel) => Promise<PostsModel | undefined>;
};

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
    const authHttpRequest = useAuthHttpRequest();
    const [posts, setPosts] = useState<PostsModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAllPostsAsync = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authHttpRequest({
                method: "GET",
                url: `${routes.posts}`,
            });

            if (response && response.data && response.status == HttpConstants.StatusCodes.Ok) {
                const posts = response.data.items as PostsModel[];
                await new Promise((resolve) => setTimeout(resolve, 2000));

                return posts;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [authHttpRequest]);

    const getPostByIdAsync = useCallback(
        async (id: number) => {
            setIsLoading(true);
            try {
                const response = await authHttpRequest({
                    method: "GET",
                    url: `${routes.posts}/${id}`,
                });

                if (response && response.data && response.status === 200) {
                    const posts = response.data as PostsModel;

                    if (!posts) {
                        return;
                    }

                    return posts;
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [authHttpRequest],
    );

    const createPostAsync = useCallback(
        async (post: CreateOrUpdatePostModel) => {
            setIsLoading(true);
            try {
                const response = await authHttpRequest({
                    method: "POST",
                    url: `${routes.posts}`,
                    data: post,
                });

                if (response && response.data && response.status === 200) {
                    const createdPost = response.data as PostsModel;

                    if (!createdPost) {
                        return;
                    }

                    setPosts((prev) => [createdPost, ...prev]);

                    await new Promise((resolve) => setTimeout(resolve, 600));

                    return createdPost;
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [authHttpRequest],
    );

    useEffect(() => {
        (async () => {
            const posts = await getAllPostsAsync();

            if (posts) {
                setPosts(posts);
            }
        })();
    }, [getAllPostsAsync]);

    return (
        <NewsContext.Provider value={{ posts, isLoading, getPostByIdAsync, createPostAsync }}>
            {children}
        </NewsContext.Provider>
    );
}

export const usePosts = () => {
    const context = useContext(NewsContext);
    if (context === undefined) {
        throw new Error("usePosts must be used within a PostsProvider");
    }

    return context;
};
