import { PostAuthorModel } from "./post-author-model";
import { PostImageModel } from "./post-image-model";
import { PostLikeModel } from "./post-like-model";

export type PostsModel = {
    id: number;

    title: string;

    content: string;

    createdAt: string;

    isLiked: boolean;

    likesCount: number;

    images?: PostImageModel[];

    likes?: PostLikeModel[];

    author: PostAuthorModel;
};
