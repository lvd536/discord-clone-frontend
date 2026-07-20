import { MemberRole } from '@backend/types/__generated__/client';
import { ChannelType } from '@backend/types/__generated__/enums';

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
