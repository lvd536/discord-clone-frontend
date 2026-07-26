import { ConversationType } from '@backend/types/__generated__/enums';

export type ChatResponseType = {
    participants: ({
        user: {
            id: string;
            displayName: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        conversationId: string;
        lastReadAt: Date;
    })[];
} & {
    id: string;
    name: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    type: ConversationType;
};

export type UserConversationsType = ({
    messages: {
        createdAt: Date;
        content: string;
    }[];
    participants: ({
        user: {
            id: string;
            email: string;
            displayName: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        conversationId: string;
        lastReadAt: Date;
    })[];
} & {
    id: string;
    name: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    type: ConversationType;
})[];

export type DirectMessageHistoryType = ({
    sender: {
        id: string;
        displayName: string;
        avatarUrl: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    fileUrl: string;
    conversationId: string;
    senderId: string;
})[];

export type DirectMessageResponse = {
    sender: {
        id: string;
        displayName: string;
        avatarUrl: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    fileUrl: string;
    conversationId: string;
    senderId: string;
};
