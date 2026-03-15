import { Dispatch, SetStateAction } from 'react';
import type { AuthUserModel } from './auth-user-model';
import type { SignInModel } from './signin-model';
import { SignUpModel } from './signup-model';

export type SignInAsyncFunc = (singIn: SignInModel) => Promise<void>;
export type SignOutAsyncFunc = () => Promise<void>;
export type SignUpAsyncFunc = (signUp: SignUpModel) => Promise<void>;
export type SignUpVerificationAsyncFunc = (token: string) => Promise<void>;
export type GetUserAuthDataFromStorageFunc = () => AuthUserModel | null;

export type AuthContextModel = {
  user: AuthUserModel | null;

  setUser: Dispatch<SetStateAction<AuthUserModel | null>>;

  signIn: SignInAsyncFunc;

  signOut: SignOutAsyncFunc;

  signUp: SignUpAsyncFunc;

  verify: SignUpVerificationAsyncFunc;

  getUserAuthDataFromStorage: GetUserAuthDataFromStorageFunc;

  isAuthenticated: () => boolean;
};
