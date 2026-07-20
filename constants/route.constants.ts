export const ROUTES = {
    BASE: '/',
    PROFILE: '/profile',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        SUCCESS: '/auth/oauth-success',
    },
    DASHBOARD: {
        BASE: '/dashboard',
        SERVER: {
            BASE: '/dashboard/server',
            ID: (serverId: string) => `/dashboard/server/${serverId}`,
            CHANNEL: (serverId: string, channelId: string) =>
                `/dashboard/server/${serverId}/channels/${channelId}`,
        },
        ME: {
            BASE: '/dashboard/me',
            ID: (chatId: string) => `/dashboard/me/${chatId}`,
            FRIENDS: {
                BASE: '/dashboard/me/friends',
                REQUESTS: '/dashboard/me/friends/requests',
            },
        },
    },
} as const;
