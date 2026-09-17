'use client';

import { useEffect } from 'react';

import { usePresenceStore } from '@/features/shared/store/presence.store';
import { ServerMembersType } from '@/features/shared/types/channel.types';

import { UserPopover } from './UserPopover';

interface IProps {
    members: ServerMembersType;
}

interface IGroupedMember {
    roleName: string;
    roleColor: string;
    members: ServerMembersType;
}

export default function MemberList({ members }: IProps) {
    const { onlineUsers, checkUsersPresence } = usePresenceStore();

    useEffect(() => {
        const memberIds = members.map((m) => m.user.id);
        if (memberIds.length > 0) {
            checkUsersPresence(memberIds);
        }
    }, [members, checkUsersPresence]);

    const groupedMembers = members.reduce(
        (acc, member) => {
            const primaryRole = member.roles && member.roles.length > 0 ? member.roles[0] : null;

            const roleId = primaryRole ? primaryRole.id : 'default_online';
            const roleName = primaryRole ? primaryRole.name.toUpperCase() : 'В СЕТИ';
            const roleColor = primaryRole ? primaryRole.color : '#949ba4';

            if (!acc[roleId]) {
                acc[roleId] = {
                    roleName,
                    roleColor,
                    members: [],
                };
            }
            acc[roleId].members.push(member);
            return acc;
        },
        {} as Record<string, IGroupedMember>,
    );

    const sortedGroups = Object.entries(groupedMembers)
        .map(([id, group]) => ({ id, ...group }))
        .sort((a, b) => {
            if (a.id === 'default_online') return 1;
            if (b.id === 'default_online') return -1;
            return 0;
        });

    return (
        <div className="discord-scroll flex h-full w-full flex-col overflow-y-auto px-2 py-4">
            {sortedGroups.map((group) => {
                return (
                    <div key={group.id} className="mb-4 flex flex-col gap-0.5">
                        <h3 className="mb-1 px-2 text-[12px] font-bold tracking-wider text-[#949ba4] uppercase">
                            {group.roleName} — {group.members.length}
                        </h3>

                        {group.members.map((member) => {
                            const nameStyle = { color: group.roleColor };

                            const isOnline = onlineUsers.has(member.user.id);

                            return (
                                <UserPopover
                                    member={member}
                                    nameStyle={nameStyle}
                                    isOnline={isOnline}
                                    key={member.id}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
