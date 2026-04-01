"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { ProfileModel } from "../models/profile-model";
import { routes } from "../constants/app-api-routes";
import { HttpConstants } from "../constants/app-http-constants";
import { useAuthHttpRequest } from "./use-auth-http-request";

type ProfileContextType = {
    profile: ProfileModel | null;
    isLoading: boolean;
    getProfileAsync: () => Promise<ProfileModel | undefined>;
    createProfileAsync: (profileData: Omit<ProfileModel, "id">) => Promise<ProfileModel | undefined>;
    updateProfileAsync: (profileData: Partial<ProfileModel>) => Promise<ProfileModel | undefined>;
    deleteProfileAsync: () => Promise<ProfileModel | undefined>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const authHttpRequest = useAuthHttpRequest();
    const [profile, setProfile] = useState<ProfileModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getProfileAsync = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authHttpRequest({
                method: "GET",
                url: routes.profile,
            });

            if (response && response.data && response.status === HttpConstants.StatusCodes.Ok) {
                const profileData = response.data as ProfileModel;
                setProfile(profileData);
                return profileData;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [authHttpRequest]);

    const createProfileAsync = useCallback(
        async (profileData: Omit<ProfileModel, "id">) => {
            setIsLoading(true);
            try {
                const response = await authHttpRequest({
                    method: "POST",
                    url: routes.profile,
                    data: profileData,
                });

                if (response && response.data && response.status === HttpConstants.StatusCodes.Ok) {
                    const createdProfile = response.data as ProfileModel;
                    setProfile(createdProfile);
                    return createdProfile;
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [authHttpRequest],
    );

    const updateProfileAsync = useCallback(
        async (profileData: Partial<ProfileModel>) => {
            setIsLoading(true);
            try {
                const response = await authHttpRequest({
                    method: "PUT",
                    url: routes.profile,
                    data: profileData,
                });

                if (response && response.data && response.status === HttpConstants.StatusCodes.Ok) {
                    const updatedProfile = response.data as ProfileModel;
                    setProfile(updatedProfile);
                    return updatedProfile;
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [authHttpRequest],
    );

    const deleteProfileAsync = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authHttpRequest({
                method: "DELETE",
                url: routes.profile,
            });

            if (response && response.data && response.status === HttpConstants.StatusCodes.Ok) {
                const deletedProfile = response.data as ProfileModel;
                setProfile(null);
                return deletedProfile;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [authHttpRequest]);

    useEffect(() => {
        getProfileAsync();
    }, [getProfileAsync]);

    return (
        <ProfileContext.Provider
            value={{
                profile,
                isLoading,
                getProfileAsync,
                createProfileAsync,
                updateProfileAsync,
                deleteProfileAsync,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};
