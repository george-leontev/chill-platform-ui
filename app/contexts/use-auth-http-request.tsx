import { useCallback } from "react";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpConstants } from "../constants/app-http-constants";
import { httpClientBase } from "./http-client-base";
import { useAuth } from "./app-auth-context";
import { proclaim, proclaimError } from "../utils/proclaim";
import { useRouter } from "next/navigation";

export type AxiosWithCredentialsFunc = (
    config: AxiosRequestConfig,
    suppressLoader?: boolean,
    suppressShowUnauthorized?: boolean,
) => Promise<AxiosResponse | undefined>;

export const useAuthHttpRequest = () => {
    const { getUserAuthDataFromStorage, setUser } = useAuth();
    const router = useRouter();

    const axiosWithCredentials = useCallback<AxiosWithCredentialsFunc>(
        async (
            config: AxiosRequestConfig,
            suppressLoader: boolean = false,
            suppressShowUnauthorized: boolean = false,
            suppressShowError: boolean = false,
        ) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let response: AxiosResponse<any, any> | null | AxiosResponse<unknown, any> | undefined = null;
            const userAuthData = getUserAuthDataFromStorage();
            config = config || {};
            config.headers = config.headers || {};
            config.headers = { ...config.headers, ...HttpConstants.Headers.AcceptJson };
            config.timeoutErrorMessage = "Server didn't return answer in the given time interval";

            if (userAuthData) {
                config.headers.Authorization = `Bearer ${userAuthData.token}`;
                config.headers["X-Requested-User-Email"] = userAuthData.email;
                config.headers["X-Requested-User-Id"] = userAuthData.userId;
            }

            try {
                response = (await httpClientBase.request(config)) as AxiosResponse;
            } catch (error) {
                response = (error as AxiosError).response;
                if (response?.status === HttpConstants.StatusCodes.Unauthorized) {
                    localStorage.removeItem("@userAuthData");
                    setUser(null);
                    router.push("/sign-in");

                    if (!suppressShowUnauthorized) {
                        proclaim({
                            type: "error",
                            title: response.data.message,
                            // displayTime: 30000000,
                        });
                    }
                } else {
                    if (!suppressShowError) {
                        await proclaimError(error);
                    }
                    console.log(error);
                }
            } finally {
                if (!suppressLoader) {
                    setTimeout(() => {
                        // hideLoader();
                    }, 100);
                }
            }

            return response;
        },
        [getUserAuthDataFromStorage, router, setUser],
    );

    return axiosWithCredentials;
};
