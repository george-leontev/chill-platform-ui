import { PostAuthorModel } from "./post-author-model";
import { PostImageModel } from "./post-image-model";

export type PostsModel = {
    id: number;

    title: string;

    content: string;

    createdAt: string;

    images?: PostImageModel[];

    author: PostAuthorModel;
};
