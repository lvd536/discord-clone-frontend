import axios from 'axios';

export type ServerActionResponse<T> =
    { success: true; data: T } | { success: false; error: string };

export interface ActionErrorResponse {
    success: false;
    error: string;
}

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        return err.response?.data?.message || err.message || 'Произошла сетевая ошибка';
    }

    if (err instanceof Error) {
        return err.message;
    }

    return 'Произошла неизвестная ошибка';
}

export function handleServerError(err: unknown): ActionErrorResponse {
    return {
        success: false,
        error: getErrorMessage(err),
    };
}
