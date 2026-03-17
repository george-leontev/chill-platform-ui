"use client";

import { Image as AntImage } from "antd";
import { PostImageModel } from "../models/post-image-model";
import { useState } from "react";

interface PostImagesGalleryProps {
    images: PostImageModel[];
}

export default function PostImagesGallery({ images }: PostImagesGalleryProps) {
    const [expanded, setExpanded] = useState(false);

    const additionalImagesCount = images.length > 3 ? images.length - 3 : 0;

    const handleExpandClick = () => {
        setExpanded(true);
    };

    const handleCollapseClick = () => {
        setExpanded(false);
    };

    if (!images || images.length === 0) {
        return null;
    }

    // Expanded grid view - shows all images when expanded
    if (expanded && images.length > 3) {
        return (
            <div className='mt-3 mb-3'>
                <div className='grid grid-cols-3 gap-2'>
                    {images.map((img, idx) => (
                        <div
                            key={img.id || idx}
                            className='relative w-full h-48 rounded-xl overflow-hidden'
                        >
                            <AntImage
                                src={img.imageUrl}
                                alt={`Post image ${idx + 1}`}
                                className='w-full h-full cursor-pointer'
                                style={{ objectFit: "fill" }}
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleCollapseClick}
                    className='mt-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer'
                >
                    Show less
                </button>
            </div>
        );
    }

    // Compact view - shows only first 3 images
    return (
        <AntImage.PreviewGroup>
            <div className='mt-3 grid gap-2'>
                {images.length === 1 && (
                    <div className='relative w-full h-64 rounded-xl overflow-hidden'>
                        <AntImage
                            src={images[0].imageUrl}
                            alt='Post image'
                            className='w-full h-full cursor-pointer'
                            style={{ objectFit: "fill" }}
                        />
                    </div>
                )}
                {images.length === 2 && (
                    <div className='grid grid-cols-2 gap-2'>
                        {images.map((img, idx) => (
                            <div
                                key={img.id || idx}
                                className='relative w-full h-48 rounded-xl overflow-hidden'
                            >
                                <AntImage
                                    src={img.imageUrl}
                                    alt={`Post image ${idx + 1}`}
                                    className='w-full h-full cursor-pointer'
                                    style={{ objectFit: "fill" }}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {images.length >= 3 && (
                    <div className='grid grid-cols-3 gap-2'>
                        {images.slice(0, 3).map((img, idx) => {
                            const isThirdImageWithOverflow = idx === 2 && additionalImagesCount > 0;

                            if (isThirdImageWithOverflow) {
                                return (
                                    <div
                                        key={img.id || idx}
                                        className='relative w-full h-32 rounded-xl overflow-hidden bg-gray-500 cursor-pointer'
                                        onClick={handleExpandClick}
                                    >
                                        <AntImage
                                            src={img.imageUrl}
                                            alt={`Post image ${idx + 1}`}
                                            className='w-full h-full'
                                            style={{ objectFit: "fill", opacity: 0.5 }}
                                        />
                                        <div className='absolute inset-0 flex items-center justify-center z-10'>
                                            <span className='text-white text-2xl font-bold'>
                                                +{additionalImagesCount}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={img.id || idx}
                                    className='relative w-full h-32 rounded-xl overflow-hidden'
                                >
                                    <AntImage
                                        src={img.imageUrl}
                                        alt={`Post image ${idx + 1}`}
                                        className='w-full h-full cursor-pointer'
                                        style={{ objectFit: "fill" }}
                                    />
                                </div>
                            );
                        })}
                        {/* Hidden images for PreviewGroup */}
                        {additionalImagesCount > 0 && (
                            <>
                                {images.slice(3).map((img, idx) => (
                                    <div key={img.id || idx + 3} className='hidden'>
                                        <AntImage
                                            src={img.imageUrl}
                                            alt={`Post image ${idx + 4}`}
                                            style={{ objectFit: "fill" }}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </AntImage.PreviewGroup>
    );
}
