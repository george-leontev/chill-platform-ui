"use client";

import { Avatar, Input, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { ImagePlus, Smile, Loader2, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import EmojiPicker from "./emoji-picker";

const { TextArea } = Input;

interface CreatePostFormProps {
    onSubmit: (content: string, imageUrls: string[]) => Promise<void>;
    isPosting: boolean;
}

const MAX_IMAGES = 8;

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function CreatePostForm({ onSubmit, isPosting }: CreatePostFormProps) {
    const [postContent, setPostContent] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleUploadChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
        const filtered = newFileList
            .filter((file) => {
                const isImage = file.type?.startsWith("image/");
                const isUnder5MB = (file.size ?? 0) / 1024 / 1024 < 5;
                return isImage && isUnder5MB;
            })
            .slice(0, MAX_IMAGES);

        setFileList(filtered);

        const urls = await Promise.all(
            filtered.map(async (file) => {
                if (file.url && file.url.startsWith("data:")) return file.url;
                if (file.originFileObj) {
                    return await fileToBase64(file.originFileObj);
                }
                return "";
            }),
        );
        setPreviewUrls(urls.filter(Boolean));
    };

    const removeImage = (index: number) => {
        const newFileList = fileList.filter((_, i) => i !== index);
        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        setFileList(newFileList);
        setPreviewUrls(newPreviewUrls);
    };

    const insertEmoji = (emoji: string) => {
        setPostContent((prev) => prev + emoji);
    };

    const handleSubmit = async () => {
        if (!postContent.trim()) return;
        await onSubmit(postContent, previewUrls);
        setPostContent("");
        setFileList([]);
        setPreviewUrls([]);
    };

    return (
        <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5'>
            <div className='flex gap-4'>
                <Avatar size={42} src='https://i.pravatar.cc/100' />

                <div className='flex-1'>
                    <TextArea
                        placeholder='Share something with Chill Platform...'
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        className='text-gray-700 text-base'
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        disabled={isPosting}
                    />

                    {/* Image previews */}
                    {previewUrls.length > 0 && (
                        <div className='flex flex-wrap gap-2 mt-3'>
                            {previewUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className='relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200'
                                >
                                    <Image src={url} alt={`attachment-${index}`} fill className='object-cover' />
                                    <button
                                        onClick={() => removeImage(index)}
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

                    <div className='flex items-center justify-end gap-2 mt-4'>
                        {/* Upload */}
                        <Upload
                            accept='image/*'
                            multiple
                            showUploadList={false}
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={handleUploadChange}
                            disabled={isPosting || fileList.length >= MAX_IMAGES}
                        >
                            <button
                                disabled={isPosting || fileList.length >= MAX_IMAGES}
                                className='
                                    flex items-center justify-center
                                    w-9 h-9 rounded-lg
                                    text-gray-500
                                    hover:bg-gray-100
                                    hover:text-violet-600
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                '
                                title={
                                    fileList.length >= MAX_IMAGES
                                        ? `Maximum ${MAX_IMAGES} images allowed`
                                        : "Attach images"
                                }
                            >
                                <ImagePlus size={18} />
                                {fileList.length > 0 && (
                                    <span className='ml-1 text-xs font-medium text-violet-600'>
                                        {fileList.length}/{MAX_IMAGES}
                                    </span>
                                )}
                            </button>
                        </Upload>

                        {/* Emoji Picker */}
                        <div className='relative'>
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                disabled={isPosting}
                                className='
                                    flex items-center justify-center
                                    w-9 h-9 rounded-lg
                                    text-gray-500
                                    hover:bg-gray-100
                                    hover:text-violet-600
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                '
                                title='Add emoji'
                            >
                                <Smile size={18} />
                            </button>

                            {showEmojiPicker && (
                                <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmojiPicker(false)} />
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={isPosting || !postContent.trim()}
                            className='
                                flex items-center justify-center gap-2
                                px-5 py-2
                                bg-violet-600
                                text-white
                                rounded-full
                                font-medium
                                hover:bg-violet-700
                                transition
                                shadow-sm
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                disabled:hover:bg-violet-600
                                cursor-pointer
                            '
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
