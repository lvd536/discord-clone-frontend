'use client';

import { useCallback, useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

import { Socket, io } from 'socket.io-client';

import { usePresenceStore } from '@/features/shared/store/presence.store';

export function usePresence(accessToken?: string | null) {
    const socketRef = useRef<Socket | null>(null);
    const prevServerIdRef = useRef<string | null>(null);
    const pathname = usePathname();

    const { userConnected, userDisconnected, setCheckStatusFn } = usePresenceStore();

    useEffect(() => {
        if (!accessToken) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                console.log('Socket: disconnect! Can not find accesstoken');
            }
            return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

        const socket = io(`${baseUrl}/presence`, {
            auth: { token: accessToken },
            withCredentials: true,
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setCheckStatusFn((userIds: string[]) => {
                if (socket.connected && userIds.length > 0) {
                    socket.emit('check_users_presence', userIds);
                }
            });

            const match = window.location.pathname.match(/\/dashboard\/server\/([^/]+)/);
            if (match && match[1]) {
                socket.emit('subscribe_server', match[1]);
                prevServerIdRef.current = match[1];
            }

            console.log('Socket: connected');
        });

        socket.on('presence_change', (data: { userId: string; isOnline: boolean }) => {
            if (data.isOnline) {
                userConnected(data.userId);
            } else {
                userDisconnected(data.userId);
            }
            console.log('Socket: presence change! userId:', data.userId);
        });

        socket.on('presence_checked_result', (onlineIds: string[]) => {
            onlineIds.forEach((id) => userConnected(id));
        });

        const heartbeatInterval = setInterval(() => {
            if (socket.connected) {
                socket.emit('heartbeat');
            }
        }, 25000);

        return () => {
            clearInterval(heartbeatInterval);
            socket.disconnect();
            socketRef.current = null;
            setCheckStatusFn(() => {});
        };
    }, [accessToken, userConnected, userDisconnected, setCheckStatusFn]);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const match = pathname.match(/\/dashboard\/server\/([^/]+)/);
        const currentServerId = match ? match[1] : null;

        if (currentServerId !== prevServerIdRef.current) {
            if (prevServerIdRef.current && socket.connected) {
                socket.emit('unsubscribe_server', prevServerIdRef.current);
                console.log('Socket: unsubscribe_server');
            }

            if (currentServerId && socket.connected) {
                socket.emit('subscribe_server', currentServerId);
                console.log('Socket: subscribe_server');
            }

            prevServerIdRef.current = currentServerId;
        }
    }, [pathname]);

    const checkUsersStatus = useCallback((userIds: string[]) => {
        if (socketRef.current?.connected && userIds.length > 0) {
            socketRef.current.emit('check_users_presence', userIds);
            console.log('Socket: check_users_presence');
        }
    }, []);

    return { checkUsersStatus };
}
