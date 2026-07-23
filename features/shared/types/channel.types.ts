import { ChannelType, RolePermissions } from '@backend/types/__generated__/enums';

export type ChannelResponse = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    serverId: string;
    name: string;
    type: ChannelType;
};

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
        userId: string;
        serverId: string;
    })[];
    channels: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        serverId: string;
        type: ChannelType;
    }[];
} & {
    id: string;
    inviteCode: string;
    name: string;
    imageUrl: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ServerMembersType = ({
    roles: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        serverId: string;
        color: string;
        permissions: RolePermissions[];
    }[];
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
    userId: string;
    serverId: string;
})[];
