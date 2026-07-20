import { Account, User } from '@backend/types/__generated__/client';
import { ChannelType, MemberRole } from '@backend/types/__generated__/enums';

export type LoginFormDataType = {
    email: string;
    password: string;
};

export interface RegisterFormDataType extends LoginFormDataType {
    displayName: string;
}

export type AuthResponseType = {
    user: User;
    access_token: string;
};

export type ChannelResponse = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    serverId: string;
    name: string;
    type: ChannelType;
};

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

export type ServerInfoResponse = {
    members: ({
        user: {
            id: string;
            email: string;
            displayName: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serverId: string;
        role: MemberRole;
        userId: string;
    })[];
    channels: {
        id: string;
        name: string;
        type: ChannelType;
        createdAt: Date;
        updatedAt: Date;
        serverId: string;
    }[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string | null;
    inviteCode: string;
    ownerId: string;
};
