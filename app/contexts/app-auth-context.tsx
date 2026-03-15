"use client";

import axios from "axios";
import { createContext, useContext, useState, useCallback } from "react";
import type {
    AuthContextModel,
    GetUserAuthDataFromStorageFunc,
    SignInAsyncFunc,
    SignOutAsyncFunc,
    SignUpAsyncFunc,
    SignUpVerificationAsyncFunc,
} from "../models/auth-context";
import type { AuthUserModel } from "../models/auth-user-model";
import type { SignInModel } from "../models/signin-model";
import { HttpConstants } from "../constants/app-http-constants";
import { routes } from "../constants/app-api-routes";
import type { AppBaseProviderProps } from "../models/app-base-provider-props";
import { SignUpModel } from "../models/signup-model";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextModel>({} as AuthContextModel);
const useAuth = () => useContext(AuthContext);

function AuthProvider(props: AppBaseProviderProps) {
    const [user, setUser] = useState<AuthUserModel | null>(() => {
        try {
            const stored = localStorage.getItem("@userAuthData");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const router = useRouter();

    const getUserAuthDataFromStorage = useCallback<GetUserAuthDataFromStorageFunc>(() => {
        let userAuthData = null;
        try {
            const userAuthDataStr = localStorage.getItem("@userAuthData");
            if (userAuthDataStr) {
                userAuthData = JSON.parse(userAuthDataStr);
            }
        } catch (error) {
            console.log(
                `The error has occurred during getting auth data object from the app storage: ${(error as Error).message}`,
            );
        }
        return userAuthData;
    }, []);

    const signIn = useCallback<SignInAsyncFunc>(async (signIn: SignInModel) => {
        let userAuthData = null;
        try {
            debugger;
            const response = await axios.post(`${routes.host}${routes.signIn}`, signIn);

            if (response && response.status === HttpConstants.StatusCodes.Ok && response.data) {
                userAuthData = response.data;
                debugger;
                if (userAuthData) {
                    localStorage.setItem("@userAuthData", JSON.stringify(userAuthData));
                }
            }

            setUser(userAuthData);
        } catch (error) {
            console.log(`The authentication process was failed with error: ${(error as Error).message}`);
            throw error;
        }
    }, []);

    const signOut = useCallback<SignOutAsyncFunc>(async () => {
        const userAuthData = getUserAuthDataFromStorage();
        if (userAuthData) {
            try {
                const signoutResponse = await axios.post(`${routes.host}${routes.signOut}`, userAuthData, {
                    headers: {
                        ...HttpConstants.Headers.ContentTypeJson,
                        Authorization: `Bearer ${userAuthData.token}`,
                        "X-Requested-User-Email": userAuthData.email,
                        "X-Requested-User-Id": userAuthData.userId,
                    },
                });
                console.log(signoutResponse);
            } catch {
                console.log("It was happened error during a process of an user security token revoke!");
            }
        }
        localStorage.removeItem("@userAuthData");
        setUser(null);
        router.push("/sign-in");
    }, [getUserAuthDataFromStorage, router]);

    const signUp = useCallback<SignUpAsyncFunc>(async (signUp: SignUpModel) => {
        try {
            const response = await axios.post(`${routes.host}${routes.signUp}`, signUp);

            if (response && response.status === HttpConstants.StatusCodes.Ok && response.data) {
                return;
            }
        } catch (error) {
            console.log(`The registration process was failed with error: ${(error as Error).message}`);
            throw error;
        }
    }, []);

    const verify = useCallback<SignUpVerificationAsyncFunc>(async (token: string) => {
        let userAuthData = null;
        try {
            const response = await axios.get(`${routes.host}${routes.verification}?token=${token}`);

            if (response && response.status === HttpConstants.StatusCodes.Created && response.data) {
                userAuthData = response.data;
                if (userAuthData) {
                    localStorage.setItem("@userAuthData", JSON.stringify(userAuthData));
                }
            }

            setUser(userAuthData);
        } catch (error) {
            console.log(`The verification process was failed with error: ${(error as Error).message}`);
            throw error;
        }
    }, []);

    const isAuthenticated = useCallback(() => {
        const user = getUserAuthDataFromStorage();

        return user !== null;
    }, [getUserAuthDataFromStorage]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                signIn,
                signUp,
                signOut,
                verify,
                getUserAuthDataFromStorage,
                isAuthenticated,
            }}
            {...props}
        />
    );
}

export { AuthProvider, useAuth };
