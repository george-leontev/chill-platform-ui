import { UserInfoModel } from "./user-info-model";

export type PostAuthorModel = Pick<UserInfoModel, "id" | "firstName" | "lastName" | "username">;
