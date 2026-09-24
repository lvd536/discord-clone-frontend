export enum NOTIFICATION_TYPE {
    NEW_MESSAGE_NOTIFICATION = 'NEW_MESSAGE_NOTIFICATION',
    FRIENDSHIP_REQUEST = 'FRIENDSHIP_REQUEST',
    FRIENDSHIP_ACCEPT = 'FRIENDSHIP_ACCEPT',
}

export interface NotificationPayload {
    channelId: string;
    message: string;
    type: NOTIFICATION_TYPE;
    metadata?: {
        serverId?: string;
        channelName?: string;
        senderName?: string;
        conversationId?: string;
    };
}

export interface SendNotificationDto {
    channelId: string;
    message: string;
    type: NOTIFICATION_TYPE;
    metadata?: object;
}
