export type MessageResponse = {
    member: {
        user: {
            id: string;
            displayName: string;
            avatarUrl: string;
        };
    };
} & {
    channelId: string;
    content: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
};

export type MessageHistoryResponse = MessageResponse[];

export interface INormalizedMessage {
    id: string;
    senderId?: string;
    senderName: string;
    avatarUrl: string | null;
    content: string;
    timestamp: number;
    isUpdated?: boolean;
}
