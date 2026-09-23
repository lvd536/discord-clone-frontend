'use client';

import { useEffect, useRef } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Socket, io } from 'socket.io-client';
import { toast } from 'sonner';

import { useAuthStore } from '@/features/auth/store/auth.store';

import { useNotificationStore } from '../store/notification.store';
import {
    NOTIFICATION_TYPE,
    NotificationPayload,
    SendNotificationDto,
} from '../types/notification.types';

export function useNotifications(accessToken?: string | null) {
    const profile = useAuthStore((s) => s.profile);
    const socketRef = useRef<Socket | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const pathnameRef = useRef(pathname);
    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    const { addUnreadMessage, incrementFriendRequests, setSendNotificationFn } =
        useNotificationStore();

    useEffect(() => {
        if (!accessToken) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

        const socket = io(`${baseUrl}/notifications`, {
            auth: { token: accessToken },
            withCredentials: true,
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setSendNotificationFn((dto: SendNotificationDto) => {
                if (socket.connected) {
                    socket.emit('send_notification', dto);
                }
            });
        });

        socket.on('notification', (data: NotificationPayload) => {
            const sender = data.metadata?.senderName || 'Пользователь';

            if (profile?.displayName === sender) return;

            switch (data.type) {
                case NOTIFICATION_TYPE.NEW_MESSAGE_NOTIFICATION: {
                    const { channelId, metadata } = data;
                    const currentPath = pathnameRef.current;

                    const isCurrentlyInThisChannel = [
                        channelId,
                        metadata?.conversationId,
                        metadata?.serverId,
                    ].some((id) => id && currentPath.includes(id));

                    if (!isCurrentlyInThisChannel) {
                        const serverId = data.metadata?.serverId;
                        addUnreadMessage(data.channelId, serverId);

                        toast(`${sender}`, {
                            description: data.message,
                            action: {
                                label: 'Перейти',
                                onClick: () => {
                                    if (serverId) {
                                        router.push(
                                            `/dashboard/server/${serverId}/channels/${data.channelId}`,
                                        );
                                    } else {
                                        router.push(`/dashboard/@me/${data.channelId}`);
                                    }
                                },
                            },
                        });
                    }
                    break;
                }

                case NOTIFICATION_TYPE.FRIENDSHIP_REQUEST: {
                    incrementFriendRequests();

                    toast.info(`Новый запрос в друзья от ${sender}`, {
                        action: {
                            label: 'Посмотреть',
                            onClick: () => router.push('/dashboard/@me/friends'),
                        },
                    });
                    break;
                }

                case NOTIFICATION_TYPE.FRIENDSHIP_ACCEPT: {
                    toast.success(`${sender} принял(а) запрос в друзья!`, {
                        action: {
                            label: 'Написать',
                            onClick: () => router.push('/dashboard/@me/friends'),
                        },
                    });
                    router.refresh();
                    break;
                }
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setSendNotificationFn(() => {});
        };
    }, [
        accessToken,
        addUnreadMessage,
        incrementFriendRequests,
        setSendNotificationFn,
        router,
        profile?.displayName,
    ]);
}
