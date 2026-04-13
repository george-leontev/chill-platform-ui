"use client";

import { usePosts } from "../../contexts/posts-data-context";
import { PostsModel } from "../../models/posts-model";
import { CreateOrUpdatePostModel } from "../../models/create-or-update-post-model";
import { useEffect, useState, useMemo, useCallback } from "react";
import PostCard from "../../components/post-card";
import { Modal, Input, message as antdMessage } from "antd";
import { Trash2, Pencil, X } from "lucide-react";
import Image from "next/image";

const { TextArea } = Input;

export default function MyPostsPage() {
    const { getMyPostsAsync, updatePostAsync, deletePostAsync, isLoading } = usePosts();

    const [myPosts, setMyPosts] = useState<PostsModel[]>([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<PostsModel | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editPreviewUrls, setEditPreviewUrls] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleEditClick = useCallback((post: PostsModel) => {
        setEditingPost(post);
        setEditContent(post.content);
        setEditPreviewUrls(post.images?.map((img) => img.imageUrl) || []);
        setEditModalOpen(true);
    }, []);

    const handleSaveEdit = useCallback(async () => {
        if (!editingPost || !editContent.trim()) return;
        setIsSaving(true);
        try {
            const payload: CreateOrUpdatePostModel = {
                title: editingPost.title || "",
                content: editContent,
                images: editPreviewUrls,
            };
            const result = await updatePostAsync(editingPost.id, payload);
            if (result) {
                setMyPosts((prev) => prev.map((p) => (p.id === editingPost.id ? result : p)));
                setEditModalOpen(false);
                setEditingPost(null);
                antdMessage.success("Post updated successfully");
            }
        } catch (err) {
            console.error(err);
            antdMessage.error("Failed to update post");
        } finally {
            setIsSaving(false);
        }
    }, [editingPost, editContent, editPreviewUrls, updatePostAsync]);

    const handleDeletePost = useCallback(
        async (postId: number) => {
            setIsDeleting(true);
            try {
                await deletePostAsync(postId);
                setMyPosts((prev) => prev.filter((p) => p.id !== postId));
                antdMessage.success("Post deleted");
            } catch (err) {
                console.error(err);
                antdMessage.error("Failed to delete post");
            } finally {
                setIsDeleting(false);
            }
        },
        [deletePostAsync],
    );

    const removeEditImage = useCallback((index: number) => {
        setEditPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }, []);

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
                        <div key={post.id} className='relative group'>
                            <PostCard post={post} initialIsLiked={post.isLiked} />
                            {/* Action overlay */}
                            <div className='absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <button
                                    onClick={() => handleEditClick(post)}
                                    className='p-2 bg-white rounded-full shadow-md hover:bg-violet-50 transition border border-gray-200'
                                    title='Edit post'
                                >
                                    <Pencil size={16} className='text-gray-600' />
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    disabled={isDeleting}
                                    className='p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition border border-gray-200 disabled:opacity-50'
                                    title='Delete post'
                                >
                                    <Trash2 size={16} className='text-red-500' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit Modal */}
                <Modal
                    title='Edit Post'
                    open={editModalOpen}
                    onCancel={() => setEditModalOpen(false)}
                    onOk={handleSaveEdit}
                    okText='Save Changes'
                    cancelText='Cancel'
                    confirmLoading={isSaving}
                    okButtonProps={{ className: "bg-violet-600 hover:!bg-violet-700" }}
                >
                    <div className='mt-4'>
                        <TextArea
                            rows={6}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder='Edit your post content...'
                            className='text-gray-700'
                        />

                        {/* Image previews */}
                        {editPreviewUrls.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {editPreviewUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className='relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200'
                                    >
                                        <Image src={url} alt={`attachment-${index}`} fill className='object-cover' />
                                        <button
                                            onClick={() => removeEditImage(index)}
                                            className='
                                                absolute top-1 right-1
                                                w-5 h-5
                                                bg-black/60 hover:bg-black/80
                                                text-white rounded-full
                                                flex items-center justify-center
                                                opacity-0 group-hover:opacity-100
                                                transition
                                            '
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className='text-xs text-gray-400 mt-3'>
                            Tip: To add or remove images, edit the post from the create form.
                        </p>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
