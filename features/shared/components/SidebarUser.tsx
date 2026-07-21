import Link from 'next/link';

import { User } from '@backend/types/__generated__/client';
import { Settings } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ROUTES } from '@/constants/route.constants';

interface IProps {
    user: User;
}

export default function SidebarUser({ user }: IProps) {
    return (
        <div className="flex h-13 w-full items-center justify-between bg-[#232428] px-2 py-1.5">
            <div className="flex max-w-30 cursor-pointer items-center gap-2 rounded p-1">
                {user.avatarUrl && (
                    <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">
                                {(user.displayName ?? user.email).slice(0, 2)}
                            </div>
                        </AvatarFallback>
                    </Avatar>
                )}
                <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-xs font-bold text-[#f2f3f5]">
                        {user.displayName ?? user.email.slice(0, 5)}
                    </span>
                </div>
            </div>
            <div className="flex gap-0.5">
                <div id="voice-controls-target"></div>
                <Link
                    href={ROUTES.PROFILE}
                    className="group rounded p-1 transition-colors hover:bg-[#35373c]"
                >
                    <Settings className="h-5 w-5 text-[#b5bac1] transition-colors group-hover:text-[#f2f3f5]" />
                </Link>
            </div>
        </div>
    );
}
