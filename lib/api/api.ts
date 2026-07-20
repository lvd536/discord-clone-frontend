import axios from 'axios';

import { ROUTES } from '@/constants/route.constants';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    if (typeof window === 'undefined') {
        try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();

            const accessToken = cookieStore.get('access_token')?.value;
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            const allCookies = cookieStore.getAll();
            const cookieString = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');
            if (cookieString) {
                config.headers.Cookie = cookieString;
            }
        } catch (err) {
            console.error('Ошибка чтения кук на сервере:', err);
        }
    } else {
        const accessToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1];

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            if (typeof window === 'undefined') {
                try {
                    const { cookies } = await import('next/headers');
                    const cookieStore = await cookies();
                    const refreshToken = cookieStore.get('refresh_token')?.value;

                    if (!refreshToken) {
                        return Promise.reject(error);
                    }

                    const refreshResponse = await axios.post(
                        `${BASE_URL}/auth/refresh`,
                        {},
                        {
                            headers: {
                                Cookie: `refresh_token=${refreshToken}`,
                            },
                        },
                    );

                    const newAccessToken = refreshResponse.data.access_token;
                    if (newAccessToken) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Критическая ошибка рефреша на сервере:', refreshError);
                    return Promise.reject(error);
                }
            } else {
                try {
                    const refreshResponse = await axios.post(
                        `${BASE_URL}/auth/refresh`,
                        {},
                        { withCredentials: true },
                    );

                    const newAccessToken = refreshResponse.data.access_token;

                    if (newAccessToken) {
                        document.cookie = `access_token=${newAccessToken}; path=/; max-age=900; SameSite=Lax`;
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Критическая ошибка обновления токена на клиенте:', refreshError);
                    document.cookie =
                        'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    window.location.href = ROUTES.AUTH.LOGIN;
                }
            }
        }

        return Promise.reject(error);
    },
);
