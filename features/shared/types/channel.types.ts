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
    members: ServerMembersType;
    channels: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: ChannelType;
        serverId: string;
    }[];
    roles: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        serverId: string;
        color: string;
        permissions: RolePermissions[];
    }[];
} & {
    name: string;
    id: string;
    imageUrl: string | null;
    inviteCode: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ServerMembersType = ServerMemberType[];

export type ServerMemberType = {
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
};
