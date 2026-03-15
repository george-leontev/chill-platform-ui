import { PostAuthorModel } from "./post-author-model";

export type PostsModel = {
    id: number;

    title: string;

    content: string;

    createdAt: string;

    images?: string[];

    author: PostAuthorModel;
};
