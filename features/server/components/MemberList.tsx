'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ServerMembersType } from '@/features/shared/types/channel.types';

interface IProps {
    members: ServerMembersType;
}

interface IGroupedMember {
    roleName: string;
    roleColor: string;
    members: ServerMembersType;
}

export default function MemberList({ members }: IProps) {
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

                            return (
                                <div
                                    key={member.id}
                                    className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-[#35363c]/60 active:bg-[#3b3d44]"
                                >
                                    <div className="relative h-8 w-8 shrink-0">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={member.user.avatarUrl ?? ''}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-[#5865f2] text-xs font-bold text-white uppercase">
                                                {member.user.displayName.substring(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31] bg-[#23a55a]" />
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span
                                            style={nameStyle}
                                            className="truncate text-[14px] font-medium transition-colors group-hover:text-white"
                                        >
                                            {member.user.displayName}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
