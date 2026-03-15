const PostSkeleton = () => {
    return (
        <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm animate-pulse'>
            <div className='flex gap-3'>
                <div className='w-10 h-10 bg-gray-200 rounded-full' />

                <div className='flex-1 space-y-3'>
                    <div className='flex items-center gap-2'>
                        <div className='w-28 h-4 bg-gray-200 rounded' />
                        <div className='w-20 h-4 bg-gray-200 rounded' />
                    </div>

                    <div className='space-y-2'>
                        <div className='w-full h-4 bg-gray-200 rounded' />
                        <div className='w-5/6 h-4 bg-gray-200 rounded' />
                    </div>

                    <div className='w-16 h-4 bg-gray-200 rounded' />
                </div>
            </div>
        </div>
    );
};

const PostsSkeleton = () => {
    return (
        <div className='space-y-4'>
            {[1, 2, 3, 4].map((i) => (
                <PostSkeleton key={i} />
            ))}
        </div>
    );
};

export default PostsSkeleton;
