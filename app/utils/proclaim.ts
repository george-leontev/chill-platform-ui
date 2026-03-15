import { notification } from "antd";
import { AxiosError } from "axios";

type ProclaimOptions = {
    type?: "success" | "info" | "warning" | "error";
    title?: string;
    description?: string;
    duration?: number;
};

export function proclaim(options: ProclaimOptions) {
    const { type = "info", title = "", description, duration = 4 } = options;

    notification[type]({
        title,
        description,
        placement: "bottomRight",
        duration,
    });
}

export function proclaimInfo(options: ProclaimOptions) {
    proclaim({
        ...options,
        type: "info",
    });
}

export async function proclaimError(error: unknown) {
    let errorMessage = (error as AxiosError).message;

    const axiosError = error as AxiosError;

    if (axiosError.response?.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = axiosError.response.data as any;

        if (data?.message) {
            errorMessage = data.message;
        }

        if (!errorMessage && data instanceof Blob) {
            const json = await data.text();
            errorMessage = JSON.parse(json).message;
        }
    }

    if (errorMessage === "Network Error") {
        errorMessage = "Network error. Server unavailable or connection lost.";
    }

    proclaim({
        type: "error",
        title: errorMessage,
    });
}
