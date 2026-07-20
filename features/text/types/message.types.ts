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

export type MessageHistoryResponse = ({
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
})[];
