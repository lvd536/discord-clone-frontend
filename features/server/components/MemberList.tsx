import Image from 'next/image';

import { ServerMembersType } from '@/features/shared/types/channel.types';

const ROLE_COLORS: Record<string, string> = {
    OWNER: 'text-[#f04747]',
    ADMIN: 'text-[#e67e22]',
    MODERATOR: 'text-[#2ecc71]',
    GUEST: 'text-[#949ba4]',
};

const ROLE_NAMES: Record<string, string> = {
    OWNER: 'ВЛАДЕЛЕЦ',
    ADMIN: 'АДМИНИСТРАТОРЫ',
    MODERATOR: 'МОДЕРАТОРЫ',
    GUEST: 'В СЕТИ',
};

interface IProps {
    members: ServerMembersType;
}

export default function MemberList({ members }: IProps) {
    const groupedMembers = members.reduce(
        (acc, member) => {
            const role = member.role;
            if (!acc[role]) {
                acc[role] = [];
            }
            acc[role].push(member);
            return acc;
        },
        {} as Record<string, ServerMembersType>,
    );

    const roleOrder = ['OWNER', 'ADMIN', 'MODERATOR', 'GUEST'];
    return (
        <div className="discord-scroll flex h-full w-full flex-col overflow-y-auto px-2 py-4">
            {roleOrder.map((roleKey) => {
                const list = groupedMembers[roleKey];
                if (!list || list.length === 0) return null;

                return (
                    <div key={roleKey} className="mb-4 flex flex-col gap-0.5">
                        <h3 className="mb-1 px-2 text-[12px] font-bold tracking-wider text-[#949ba4] uppercase">
                            {ROLE_NAMES[roleKey] || roleKey} — {list.length}
                        </h3>

                        {list.map((member) => {
                            const roleColor = ROLE_COLORS[member.role] || 'text-[#dbdee1]';

                            return (
                                <div
                                    key={member.id}
                                    className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-[#35363c]/60 active:bg-[#3b3d44]"
                                >
                                    <div className="relative h-8 w-8 shrink-0">
                                        {member.user.avatarUrl ? (
                                            <Image
                                                src={member.user.avatarUrl}
                                                alt={member.user.displayName}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#5865f2] text-[12px] font-semibold text-white">
                                                {member.user.displayName
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                        <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31] bg-[#23a55a]" />
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span
                                            className={`truncate text-[14px] font-medium ${roleColor} transition-colors group-hover:text-white`}
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
