import { useCallback } from 'react';

export const useAuthCookie = () => {
    const setAuthToken = useCallback((token: string) => {
        document.cookie = `access_token=${token}; path=/; max-age=900; SameSite=Lax`;
    }, []);

    const removeAuthToken = useCallback(() => {
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }, []);

    return { setAuthToken, removeAuthToken };
};
