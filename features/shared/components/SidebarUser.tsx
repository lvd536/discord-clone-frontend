'use client';

import { User } from '@backend/types/__generated__/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import SidebarUserProfileCard from './SidebarUserProfileCard';

interface IProps {
    user: User;
}

export default function SidebarUser({ user }: IProps) {
    const initials = (user.displayName ?? user.email).slice(0, 2).toUpperCase();

    return (
        <Popover>
            <PopoverTrigger
                nativeButton={false}
                render={
                    <div className="group flex h-13 cursor-pointer items-center gap-2 bg-[#232428] p-1 transition-colors select-none hover:bg-[#35363c]/50">
                        <div className="relative shrink-0">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl ?? ''} className="object-cover" />
                                <AvatarFallback className="bg-[#5865f2] text-xs font-bold text-white uppercase">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#232428] bg-[#23a55a]" />
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-xs font-bold text-[#f2f3f5] group-hover:text-white">
                                {user.displayName ?? user.email.slice(0, 5)}
                            </span>
                            <span className="text-[10px] text-[#949ba4]">В сети</span>
                        </div>
                    </div>
                }
            />

            <PopoverContent
                side="top"
                align="start"
                sideOffset={14}
                className="z-50 w-80 overflow-hidden rounded-2xl border border-[#1f2023]/80 bg-[#111214] p-0 text-[#dbdee1] shadow-2xl select-none"
            >
                <SidebarUserProfileCard user={user} initials={initials} />
            </PopoverContent>
        </Popover>
    );
}
