import { UserInfoModel } from "./user-info-model";

export type ProfileModel = {
    id: number;

    user: UserInfoModel;

    avatarUrl: string;

    bio: string;

    phone: string;

    location: string;

    birthDate: string | Date;

    gender: string;

    age: number;

    createdAt: string | Date;

    updatedAt: string | Date;
};
